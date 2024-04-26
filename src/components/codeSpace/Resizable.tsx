import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ExerciseInfoBox from "./ExerciseInfoBox";
import CodeEditor from "../ui/CodeEditor";
import TestSuiteScrollArea from "./Testsuite";

import { api } from "@/trpc/server";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;

type GetGroupOutput = RouterOutput["group"]["getGroup"];
type GetCurrentUserOutput = RouterOutput["get"]["getCurrentUser"];

// Gets exercise 1 as the default exercise.
export async function Resizable({ exerciseId }: { exerciseId: number }) {
  const exercise = await api.exercise.getExercise({
    id: exerciseId,
  });
  if (exercise === null) {
    return <div>You dont have access to this exercise</div>;
  }

  // codeeditor
  // Make a database call to fetch groups data
  const username: GetCurrentUserOutput = await api.get.getCurrentUser(1); // todo update to user id
  const usernameString = username?.username ? username.username : "Anonymous";

  const group: GetGroupOutput = await api.group.getGroup(1);
  const groupRoomId = group?.roomId ? group.roomId : "test";
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
        <ResizablePanelGroup direction="vertical" className="h-full w-full">
          <ResizablePanel defaultSize={50}>
            <div className="m-1">
              <CodeEditor roomId={groupRoomId} username={usernameString} />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup
              direction="horizontal"
              className="h-full w-full"
            >
              <ResizablePanel defaultSize={50}>
                <div className="m-1 flex h-full items-stretch justify-center">
                  <TestSuiteScrollArea />
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Four</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default Resizable;
