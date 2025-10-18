import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as marketData from "./services/marketData";
import * as astroData from "./services/astroData";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  gann: router({
    marketData: publicProcedure
      .input(z.object({ symbol: z.string() }))
      .query(({ input }) => marketData.getMarketData(input.symbol)),
    
    historicalData: publicProcedure
      .input(z.object({ symbol: z.string(), days: z.number().optional() }))
      .query(({ input }) => marketData.getHistoricalData(input.symbol, input.days)),
    
    gannAngles: publicProcedure
      .input(z.object({ 
        pivotPrice: z.number(), 
        pivotDate: z.string(), 
        currentDate: z.string() 
      }))
      .query(({ input }) => 
        marketData.calculateGannAngles(input.pivotPrice, input.pivotDate, input.currentDate)
      ),
    
    lunarPhase: publicProcedure
      .input(z.object({ date: z.string().optional() }))
      .query(({ input }) => {
        const date = input.date ? new Date(input.date) : new Date();
        return astroData.getLunarPhase(date);
      }),
    
    planetaryPositions: publicProcedure
      .input(z.object({ date: z.string().optional() }))
      .query(({ input }) => {
        const date = input.date ? new Date(input.date) : new Date();
        return astroData.getPlanetaryPositions(date);
      }),
    
    planetaryAspects: publicProcedure
      .input(z.object({ date: z.string().optional() }))
      .query(({ input }) => {
        const date = input.date ? new Date(input.date) : new Date();
        const positions = astroData.getPlanetaryPositions(date);
        return astroData.getPlanetaryAspects(positions);
      }),
  }),
});

export type AppRouter = typeof appRouter;
