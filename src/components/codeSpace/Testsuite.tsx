"use client";
import * as React from "react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "@radix-ui/react-icons";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;

type getAllTestsOutput = RouterOutput["test"]["getAllTestForExercise"];

export function Testsuite({
  testSubmit,
  tests,
  setOutput,
}: {
  testSubmit: (testInput: string, testOutput: string) => Promise<boolean>;
  tests: getAllTestsOutput;
  setOutput: (output: string) => void;
}) {
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Get the parent element
    const parent = event.currentTarget.parentElement;

    // Get the ID of the parent element
    const parentId = parent?.id;
    const buttonElement = parent?.querySelector("#test-button");
    if (!parentId || !buttonElement) {
      return;
    }

    const test = tests.find((test) => test.id.toString() === parentId);
    if (!test) {
      setOutput("Test not found");
      return;
    }
    if (test.input === undefined || test.output === undefined) {
      setOutput("Test input or output not found");
      return;
    }
    testSubmit(test.input, test.output)
      .then((result) => {
        //const result = true;
        if (result === true) {
          buttonElement.classList.replace("bg-black", "bg-green-500");
          buttonElement.classList.replace(
            "hover:bg-primary/90",
            "hover:bg-green-500/70",
          );
          console.log("Test passed", parentId);
          setOutput("Test passed");
        } else {
          buttonElement.classList.replace("bg-black", "bg-red-500");
          buttonElement.classList.replace(
            "hover:bg-primary/90",
            "hover:bg-red-500/70",
          );
          console.log("Test failed", parentId);
          setOutput("Test failed");
        }
      })
      .catch((err) => {
        setOutput("Error in test");
        console.log("Error in test", err);
      });

    // Log the ID of the parent element
    console.log("Parent ID:", parentId);

    // You can now use the parent ID as needed
  };

  return (
    <div className=" h-full w-full overflow-auto rounded-md border bg-secondary ">
      <div className="p-4 pb-2 ">
        {tests.map((test) => (
          <React.Fragment key={test.id}>
            <div
              id={test.id.toString()}
              className="flex items-center justify-between"
            >
              <div>{test.name}</div>
              <Button
                id="test-button"
                className="bg-black font-bold"
                onClick={handleButtonClick}
              >
                <PlayIcon />
              </Button>
            </div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Testsuite;
