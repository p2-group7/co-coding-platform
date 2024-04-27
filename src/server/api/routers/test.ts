import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const testRouter = createTRPCRouter({
  //finds all the lecture
  getAllTestForExercise: publicProcedure
    .input(z.number())
    .query(({ ctx, input }) => {
      return ctx.db.test.findMany({ where: { exerciseId: input } });
    }),
});
