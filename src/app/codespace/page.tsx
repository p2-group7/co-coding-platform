import CodeEditor from "@/components/ui/CodeEditor";
import { api } from "@/trpc/server";
import Navbar from "@/components/Navbar";
import type { GroupInfo } from "@/components/Navbar";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

export default async function Home() {
  type RouterOutput = inferRouterOutputs<AppRouter>;

  type GetGroupsOutput = RouterOutput["group"]["getGroups"];
  type GetGroupOutput = RouterOutput["group"]["getGroup"];
  type GetCurrentUserOutput = RouterOutput["get"]["getCurrentUser"];

  // Make a database call to fetch groups data
  const groupsData: GetGroupsOutput = await api.group.getGroups();
  const username: GetCurrentUserOutput = await api.get.getCurrentUser(1); // todo update to user id
  const usernameString = username?.username ? username.username : "Anonymous";

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
      <div>
        <CodeEditor roomId={groupRoomId} username={usernameString} />
      </div>
    </main>
  );
}
