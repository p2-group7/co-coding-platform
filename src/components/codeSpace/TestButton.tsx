"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useState } from "react";

type TestButtonProps = {
  id: string;
  testInput: string;
  testOutput: string;
  testSubmit: (
    testInput: string,
    testOutput: string,
  ) => Promise<boolean | undefined>;
};

const testButtonErrorStyle = cn("bg-red-500 font-bold", "hover:bg-red-500/70");

const testButtonSuccessStyle = cn(
  "bg-green-500 font-bold",
  "hover:bg-green-500/70",
);

const testButtonLoadingStyle = cn(
  "bg-gray-500 font-bold",
  "hover:bg-gray-500/70",
  "animate-pulse",
);

const testButtonNotrunStyle = cn("bg-black font-bold", "hover:bg-primary/70");

const testButtonStyle = (state: TestButtonState) => {
  switch (state) {
    case "loading":
      return testButtonLoadingStyle;
    case "error":
      return testButtonErrorStyle;
    case "success":
      return testButtonSuccessStyle;
    case "notrun":
      return testButtonNotrunStyle;
    default:
      return testButtonNotrunStyle;
  }
};

type TestButtonState = "loading" | "error" | "success" | "notrun";

const TestButton = ({
  id,
  testInput,
  testOutput,
  testSubmit,
}: TestButtonProps) => {
  const [buttonState, setButtonState] = useState<TestButtonState>("notrun");
  const handleButtonClick = () => {
    setButtonState("loading");

    testSubmit(testInput, testOutput)
      .then((result) => {
        //const result = true;
        if (result === true) {
          setButtonState("success");
          console.log("Test passed", id);
        } else {
          setButtonState("error");
          console.log("Test failed", id);
        }
      })
      .catch((err) => {
        console.log("Error in test", err);
      });
  };

  return (
    <Button
      id={id}
      className={testButtonStyle(buttonState)}
      onClick={handleButtonClick}
    >
      <PlayIcon className="text-white" />
    </Button>
  );
};

export default TestButton;
