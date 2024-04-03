import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// TODO: Public must be a protected
export const exercisesRouter = createTRPCRouter({
  getAllExercises: publicProcedure.input(z.number())
  .query(({ ctx, input }) => {
    return ctx.db.exercise.findMany({where: {lectureId: input}})
  })
});
