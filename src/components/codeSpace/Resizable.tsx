import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ExerciseInfoBox from "./exerciseInfoBox";
import { api } from "@/trpc/server";
import CodeEditor from "../ui/CodeEditor";

import TestSuiteScrollArea from "./Testsuite";

export async function Resizable() {
  const exercise = await api.exercise.getExercise({
    id: 1,
  });
  if (exercise === null) {
    return "You dont have access to this";
  }
  // codeeditor
  type RouterOutput = inferRouterOutputs<AppRouter>;

  type GetGroupOutput = RouterOutput["group"]["getGroup"];
  type GetCurrentUserOutput = RouterOutput["get"]["getCurrentUser"];

  // Make a database call to fetch groups data
  const username: GetCurrentUserOutput = await api.get.getCurrentUser(1); // todo update to user id
  const usernameString = username?.username ? username.username : "Anonymous";

  const group: GetGroupOutput = await api.group.getGroup(1);
  const groupRoomId = group?.roomId ? group.roomId : "testtt";
  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-screen">
      <ResizablePanel defaultSize={50}>
        <div className="m-1 flex h-full items-center justify-center">
          <ExerciseInfoBox
            ExsTitle={exercise.name}
            ExsDescription={exercise.description ?? "No description"}
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
