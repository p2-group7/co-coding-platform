import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// TODO: Public must be a protected
export const coursesRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1), abrev: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.course.create({
        data: {
          name: input.name,
          abrev: input.abrev,
        },
      });
    }),
  
  getCourse: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.course.findUnique({ where: { id: input.id } });
    }),
});
