import "@/styles/globals.css";

import { api } from "@/trpc/server";
import Navbar from "@/components/Navbar";
import type { GroupInfo } from "@/components/Navbar";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;

type GetGroupsOutput = RouterOutput["group"]["getGroups"];

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Make a database call to fetch groups data
  const groupsData: GetGroupsOutput = await api.group.getGroups();

  // Map the retrieved data to GroupInfo interface
  const groups: GroupInfo[] = groupsData.map((group: GetGroupsOutput[0]) => ({
    id: group.id,
    name: group.name,
    href: `/codespace/` + group.id,
  }));

  return (
    <div className="flex h-screen flex-col">
      <div className="w-full">
        <Navbar groups={groups} /> {/* Pass groups data to Navbar component */}
      </div>
      {children}
    </div>
  );
}
