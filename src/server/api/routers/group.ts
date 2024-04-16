import { db } from "@/server/db";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// Create TRPC router
const groupRouter = createTRPCRouter({
  // Procedure for getting groups
  getGroups: publicProcedure.query(async () => {
    return await db.group.findMany();
  }),
  getGroup: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.db.group.findUnique({
      where: {
        id: input,
      },
    });
  }),
});

// This prevents us from importing server code on the client.
export default groupRouter;
