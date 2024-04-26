import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// TODO: Public must be a protected
export const exercisesRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ exerciseName: z.string().min(2), lectureId: z.number(), exerciseDescription: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.exercise.create({
        data: {
          name: input.exerciseName,
          description: input.exerciseDescription,
          lectureId: input.lectureId,
        },
      });
    }),
  getAllExercises: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    // Get all exercises for the given lecture, but only select the id, name, and description
    return ctx.db.exercise.findMany({
      where: { lectureId: input },
      select: { id: true, name: true, description: true },
    });
  }),

  getExercise: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.exercise.findUnique({ where: { id: input.id } });
    }),
});
