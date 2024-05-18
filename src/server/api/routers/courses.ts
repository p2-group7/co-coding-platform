import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Course } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";

// TODO: Public must be a protected
export const coursesRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        abrev: z.string().min(1),
        userId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.db.course.create({
        data: {
          name: input.name,
          abrev: input.abrev,
        },
      });
      try {
        if (course) {
          const courseId = course.id;
          if (courseId === undefined) {
            return new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
          }
          const usersOnCourse = await ctx.db.usersOnCourses.create({
            data: {
              userId: input.userId,
              courseId: courseId,
            },
          });

          if (!usersOnCourse) {
            return new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
          }
        }
      } catch (error) {
        console.log("Error creating course:", error);
        return new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return course;
    }),
  getCourse: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.course.findUnique({ where: { id: input.id } });
    }),
  getUserCourses: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.course.findMany({
        where: { users: { some: { userId: input.userId } } },
      });
    }),
});
