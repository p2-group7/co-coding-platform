import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// TODO: Public must be a protected
export const exercisesRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ exerciseName: z.string().min(2), lectureId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.exercise.create({
        data: {
          name: input.exerciseName,
          lectureId: input.lectureId,
        },
      });
    }),
  getAllExercises: publicProcedure.input(z.number())
  .query(({ ctx, input }) => {
    return ctx.db.exercise.findMany({where: {lectureId: input}})
  }),

  getExercise: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.exercise.findUnique({ where: { id: input.id } });
    }),
});