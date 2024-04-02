import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// TODO: Public must be a protected
export const lecturesRouter = createTRPCRouter({
  getAll: publicProcedure.input(z.number())
  .query(({ ctx, input }) => {
    return ctx.db.lecture.findMany({where: {courseId: input}})
  })
});
