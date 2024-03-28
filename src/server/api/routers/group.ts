import { db } from "@/server/db";
import type { GroupInfo } from "@/components/Navbar";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const getGroups = async () => {
  const groups = await db.group.findMany();
  return groups as unknown as GroupInfo[];
};

// TODO: make this router work
// const getGroups = async () => {
//   const groups = await db.group.findMany();
//   return groups as unknown as GroupInfo[];
// };

// // Create TRPC router
// const groupRouter = createTRPCRouter({
//   // Procedure for getting groups
//   getGroups: publicProcedure
//     .query(async () => {
//       return await getGroups();
//     }),
// });
 
// // This prevents us from importing server code on the client.
// export default groupRouter;
