"use client";
import * as React from "react";

import { Separator } from "@/components/ui/separator";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import TestButton from "./TestButton";

type RouterOutput = inferRouterOutputs<AppRouter>;

type getAllTestsOutput = RouterOutput["test"]["getAllTestForExercise"];

export function Testsuite({
  testSubmit,
  tests,
  setOutput,
}: {
  testSubmit: (
    testInput: string,
    testOutput: string,
  ) => Promise<boolean | undefined>;
  tests: getAllTestsOutput;
  setOutput: (output: string) => void;
}) {
  return (
    <div className=" h-full w-full overflow-auto rounded-md border bg-secondary ">
      <div className="p-4 pb-2 ">
        {tests.map((test) => (
          <React.Fragment key={test.id}>
            <div
              id={test.id.toString()}
              className="flex items-center justify-between"
              data-testid={test.id.toString()}
            >
              <div>{test.name}</div>
              <TestButton
                id={test.id.toString()}
                testInput={test.input}
                testOutput={test.output}
                testSubmit={testSubmit}
              />
            </div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Testsuite;
