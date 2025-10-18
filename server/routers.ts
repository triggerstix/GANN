import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getMarketData, getHistoricalData } from "./gann/marketData";
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
    
    gannChartData: publicProcedure
      .input(z.object({ symbol: z.string() }))
      .query(async ({ input }) => {
        const historical = await getHistoricalData(input.symbol, 60);
        return {
          symbol: input.symbol,
          data: historical,
          gannAngles: [
            { angle: "1x1", slope: 1, label: "45°" },
            { angle: "1x2", slope: 0.5, label: "26.25°" },
            { angle: "2x1", slope: 2, label: "63.75°" },
            { angle: "1x4", slope: 0.25, label: "14.04°" },
            { angle: "4x1", slope: 4, label: "75.96°" },
          ]
        };
      }),
    
    timeCyclesData: publicProcedure
      .input(z.object({ symbol: z.string() }))
      .query(async ({ input }) => {
        const historical = await getHistoricalData(input.symbol, 365);
        return {
          symbol: input.symbol,
          cycles: [
            { name: "30-Day Cycle", period: 30, phase: 0.6 },
            { name: "60-Day Cycle", period: 60, phase: 0.3 },
            { name: "90-Day Cycle", period: 90, phase: 0.8 },
            { name: "120-Day Cycle", period: 120, phase: 0.4 },
          ],
          data: historical
        };
      }),
    
    astroData: publicProcedure.query(async () => {
      return getAstrologicalData();
    }),
  }),
});

export type AppRouter = typeof appRouter;

