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
});
