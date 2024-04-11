import CodeEditor from "@/components/ui/CodeEditor";
import { api } from "@/trpc/server";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

export default async function Home({
  params,
}: {
  params: { groupId: string };
}) {
  type RouterOutput = inferRouterOutputs<AppRouter>;

  type GetGroupOutput = RouterOutput["group"]["getGroup"];
  type GetCurrentUserOutput = RouterOutput["get"]["getCurrentUser"];

  // Make a database call to fetch groups data
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

  return (
    <main>
      <p>KAGEEEEEEE {params.groupId}</p>
      <div>
        <CodeEditor roomId={groupRoomId} username={usernameString} />
      </div>
    </main>
  );
}
