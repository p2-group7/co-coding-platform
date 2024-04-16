import CodeEditor from "@/components/ui/CodeEditor";
import { api } from "@/trpc/server";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

export default async function Home() {
  type RouterOutput = inferRouterOutputs<AppRouter>;

  type GetGroupOutput = RouterOutput["group"]["getGroup"];
  type GetCurrentUserOutput = RouterOutput["get"]["getCurrentUser"];

  // TODO: Make user data based on session and not placeholder data. Consider using a context for this

  // Make a database call to fetch groups data
  const username: GetCurrentUserOutput = await api.get.getCurrentUser(1); // todo update to user id
  const usernameString = username?.username ? username.username : "Anonymous";

  const group: GetGroupOutput = await api.group.getGroup(1);
  const groupRoomId = group?.roomId ? group.roomId : "testtt";

  return (
    <main>
      <div>
        <CodeEditor roomId={groupRoomId} username={usernameString} />
      </div>
    </main>
  );
}
