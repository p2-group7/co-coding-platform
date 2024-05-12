import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// TODO: Public must be a protected
export const fileRouter = createTRPCRouter({
  saveFile: publicProcedure
    .input(
      z.object({
        exerciseId: z.number(),
        groupId: z.number(),
        data: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.file.upsert({
        where: {
          exerciseId: input.exerciseId,
          groupId: input.groupId,
        },
        create: {
          data: input.data,
          exerciseId: input.exerciseId,
          groupId: input.groupId,
        },
        update: {
          data: input.data,
        },
      });
    }),
});
