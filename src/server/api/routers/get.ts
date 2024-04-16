import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const getRouter = createTRPCRouter({
  getCurrentUser: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.user.findUnique({
      where: {
        id: input,
      },
    });
  }),
  getCourses: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.course.findMany();
  }),
  getuser: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.user.findUnique({
      where: {
        username: input,
      },
    });
  }),
});
