import { db } from "@/server/db";
import type { GroupInfo } from "@/components/Navbar";

export const getGroups = async () => {
  const groups = await db.group.findMany();
  return groups as unknown as GroupInfo[];
};
