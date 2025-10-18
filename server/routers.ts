import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getMarketData, getHistoricalData, getGannAnglesData, getTimeCyclesData } from "./gann/marketData";
import { getAstrologicalData } from "./gann/astroData";

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

  // Gann trading analysis router
  gann: router({
    marketInfo: publicProcedure
      .input(z.object({ symbol: z.string() }))
      .query(async ({ input }) => {
        return getMarketData(input.symbol);
      }),
    
    historicalData: publicProcedure
      .input(z.object({ symbol: z.string(), days: z.number().optional() }))
      .query(async ({ input }) => {
        return getHistoricalData(input.symbol, input.days || 30);
      }),
    
    astroData: publicProcedure
      .query(async () => {
        return getAstrologicalData();
      }),
    
    gannChartData: publicProcedure
      .input(z.object({ 
        symbol: z.string(), 
        pivotPrice: z.number(), 
        pivotIndex: z.number(),
        days: z.number().optional() 
      }))
      .query(async ({ input }) => {
        return getGannAnglesData(input.symbol, input.pivotPrice, input.pivotIndex, input.days || 60);
      }),
    
    timeCyclesData: publicProcedure
      .input(z.object({ symbol: z.string(), days: z.number().optional() }))
      .query(async ({ input }) => {
        return getTimeCyclesData(input.symbol, input.days || 365);
      }),
  }),
});

export type AppRouter = typeof appRouter;

