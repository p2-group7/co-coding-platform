import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// TODO: Public must be a protected
export const lecturesRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ lectureName: z.string().min(2), courseId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.lecture.create({
        data: {
          name: input.lectureName,
          courseId: input.courseId,
        },
      });
    }),

  //finds all the lecture
  getAll: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.lecture.findMany({ where: { courseId: input } });
  }),

  getLecture: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.lecture.findUnique({ where: { id: input.id } });
    }),
});
