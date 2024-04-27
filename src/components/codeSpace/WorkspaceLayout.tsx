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

type RouterOutput = inferRouterOutputs<AppRouter>;

type GetGroupOutput = RouterOutput["group"]["getGroup"];
type GetCurrentUserOutput = RouterOutput["get"]["getCurrentUser"];

export async function WorkspaceLayout({ exerciseId }: { exerciseId: number }) {
  const exercise = await api.exercise.getExercise({
    id: exerciseId,
  });
  const tests = await api.test.getAllTestForExercise(exerciseId);
  if (exercise === null) {
    return <div>You dont have access to this exercise</div>;
  }
  // codeeditor
  // Make a database call to fetch groups data
  const username: GetCurrentUserOutput = await api.get.getCurrentUser(1); // todo update to user id
  const usernameString = username?.username ? username.username : "Anonymous";

  const group: GetGroupOutput = await api.group.getGroup(1);
  // room id is group id + exercise id, therefore ensuring all exercises for the group are unique
  const exerciseWorkspaceId = group?.roomId + "-" + exerciseId.toString();
  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-screen">
      <ResizablePanel defaultSize={50}>
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
