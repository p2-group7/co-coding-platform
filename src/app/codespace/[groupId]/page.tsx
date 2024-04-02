import CodeEditor from "@/components/ui/CodeEditor";
import { api } from "@/trpc/server";
import Navbar from "@/components/Navbar";
import type { GroupInfo } from "@/components/Navbar";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import { useRouter } from "next/router";

export default async function Home({
  params,
}: {
  params: { groupId: string };
}) {
  type RouterOutput = inferRouterOutputs<AppRouter>;

  type GetGroupsOutput = RouterOutput["group"]["getGroups"];
  type GetGroupOutput = RouterOutput["group"]["getGroup"];
  type GetCurrentUserOutput = RouterOutput["get"]["getCurrentUser"];

  // Make a database call to fetch groups data
  const groupsData: GetGroupsOutput = await api.group.getGroups();
  const user: GetCurrentUserOutput = await api.get.getCurrentUser(1); // todo update to user id
  const usernameString = user?.username ? user.username : "Anonymous";

  if (user?.groupId !== Number(params.groupId)) {
    return (
      <div>
        <p>
          You are not in this group. Go <a href="/">back</a> to the group page.
        </p>
      </div>
    );
  }

  const group: GetGroupOutput = await api.group.getGroup(1);
  const groupRoomId = group?.roomId ? group.roomId : "testtt";

  // Map the retrieved data to GroupInfo interface
  const groups: GroupInfo[] = groupsData.map((group: GetGroupsOutput[0]) => ({
    id: group.id,
    name: group.name,
    href: `/codespace/` + group.id,
  }));
  return (
    <main>
      <div>
        <Navbar groups={groups} /> {/* Pass groups data to Navbar component */}
      </div>
      <p>KAGEEEEEEE {params.groupId}</p>
      <div>
        <CodeEditor roomId={groupRoomId} username={usernameString} />
      </div>
    </main>
  );
}
