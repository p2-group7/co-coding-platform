import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ExerciseInfoBox from "./ExerciseInfoBox";

import { api } from "@/trpc/server";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import Codespace from "./Codespace";
import { getSession } from "@/lib/auth";

type RouterOutput = inferRouterOutputs<AppRouter>;

type GetGroupOutput = RouterOutput["group"]["getGroup"];
type GetCurrentUserOutput = RouterOutput["get"]["getCurrentUser"];

export async function WorkspaceLayout({ exerciseId }: { exerciseId: number }) {
  const session = await getSession();
  const userId = session?.userId;
  const groupId = session?.groupId;
  if (!userId || !groupId) {
    return <div>You are not logged in or assigned to a group</div>;
  }

  const exercise = await api.exercise.getExercise({
    id: exerciseId,
  });
  if (exercise === null) {
    return <div>You dont have access to this exercise</div>;
  }

  const tests = await api.test.getAllTestForExercise(exerciseId);

  // codeeditor
  // Make a database call to fetch groups data
  const username: GetCurrentUserOutput = await api.get.getCurrentUser(userId);
  const usernameString = username?.username ? username.username : "Anonymous";

  const group: GetGroupOutput = await api.group.getGroup(groupId);
  // room id is group id + exercise id, therefore ensuring all exercises for the group are unique
  const exerciseWorkspaceId = group?.roomId + "-" + exerciseId.toString();
  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-screen">
      <ResizablePanel defaultSize={30}>
        <div className="m-1 flex h-full items-center justify-center">
          <ExerciseInfoBox
            ExsTitle={exercise.name}
            ExsDescription={exercise.description ?? "No description"}
            ExsLectureId={exercise.lectureId}
            ExsExerciseId={exercise.id}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <Codespace
          tests={tests}
          usernameString={usernameString}
          groupRoomId={exerciseWorkspaceId}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default WorkspaceLayout;
