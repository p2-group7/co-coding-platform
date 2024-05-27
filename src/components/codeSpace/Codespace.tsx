"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeEditor from "../ui/CodeEditor";
import TestSuite from "./Testsuite";
import React, { useState } from "react";
import { env } from "@/env";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import { Button } from "../ui/button";
import { PlayIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type RouterOutput = inferRouterOutputs<AppRouter>;

type getAllTestsOutput = RouterOutput["test"]["getAllTestForExercise"];

interface CodespaceProps {
  groupRoomId: string;
  usernameString: string;
  tests: getAllTestsOutput;
}

// interface for response data from judge0 api
interface getSubmissionResponse extends JSON {
  status: {
    id: number;
    description: string;
  };
  stdout: string;
  compile_output: string;
}

interface postSubmissionResponse extends JSON {
  token: string;
}

type buttonState = "loading" | "default";

const runButtonStyle = cn("bg-green-500 font-bold", "hover:bg-green-500/70");

const runButtonLoadingStyle = cn(
  "bg-gray-500 font-bold",
  "hover:bg-gray-500/70",
  "animate-pulse",
);

const buttonStyle = (state: buttonState) => {
  switch (state) {
    case "loading":
      return runButtonLoadingStyle;
    case "default":
      return runButtonStyle;
    default:
      return runButtonStyle;
  }
};

function Codespace(props: CodespaceProps) {
  const [code, setCode] = useState(""); // code from the editor
  const [output, setOutput] = useState(""); // output value from the judge0 api (or error message)
  const [buttonState, setButtonState] = useState<buttonState>("default");

  // headers for the judge0 api
  const XRapidAPIHeaders = {
    "X-RapidAPI-Key": env.NEXT_PUBLIC_RAPID_API_KEY,
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  };

  // handle submitting code to judge0 api -> used from the button in the code editor
  const handleSubmit = async () => {
    // send code to judge0 api
    const data = {
      language_id: 50, // id for C with gcc 9.2.0
      source_code: btoa(code), // base64 encoded code
    };
    const url =
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // this is the default header
        ...XRapidAPIHeaders, // This is the header with the api key and host
      },
      body: JSON.stringify(data),
    })
      // Check the response status code
      .then((res) => {
        if (res.status === 200 || res.status === 201 || res.status === 202) {
          return res;
        } else {
          setOutput(
            "Some error occured with the judge0 api request. Please try again. Status code was:" +
              res.status,
          );
          throw new Error("Error with judge0 api");
        }
      })
      // If status code is as expected, then parse the response as JSON
      .then((res) => res.json())
      // The data is now the response body, which fits postSubmissionResponse interface
      .then(async (data: postSubmissionResponse) => {
        console.log(data);
        const token = data.token; // get submission token
        await checkStatus(token).catch((err) => {
          console.log("err in checkstatus", err);
        }); // start checking status -> await is not needed here, since it prints the result to the console
      })
      .catch((err) => {
        console.log(err); // if there is an error, print it to the console
      });
  };

  // handle submitting test to judge0 api -> used from the test suite.
  // Has added functionality to check the status of the test and print the result to the console
  const handleTestSubmit = async (testInput: string, testOutput: string) => {
    const data = {
      language_id: 50, // id for C with gcc 9.2.0
      source_code: btoa(code), // base64 encoded code
      stdin: btoa(testInput), // base64 encoded test input
    };
    const url =
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // this is the default header
        ...XRapidAPIHeaders, // This is the header with the api key and host
      },
      body: JSON.stringify(data), // body of the request
    });
    const responseData = (await res.json()) as postSubmissionResponse; // parse the response as JSON
    const token = responseData.token; // get submission token
    // Check status of submission, purposely awaited here to get the result
    const [status, result] = await checkStatus(token);
    if (status === 3) {
      return testOutput === result; // return true if test output is equal to result
    } else {
      return false; // Test failed on judge0, since status is not completed.
      //Status should already be printed to the console in the checkstatus function, so no need to print it here
    }
  };

  // Function to get the status of the submission once
  const getStatus = async (token: string) => {
    const url =
      "https://judge0-ce.p.rapidapi.com/submissions" +
      "/" +
      token +
      "?base64_encoded=true&fields=*";
    const options = {
      method: "GET",
      headers: XRapidAPIHeaders,
    };
    try {
      const response = await fetch(url, options);
      const responseData = (await response.json()) as getSubmissionResponse;
      const statusId = responseData.status.id;

      // Check if processing is complete
      if (statusId === 1 || statusId === 2) {
        return [statusId, responseData.status.description];
      }

      if (statusId === 3) {
        // accepted status
        setOutput(atob(responseData.stdout));
        return [statusId, atob(responseData.stdout)];
      }
      if (statusId === 6) {
        // Compile error
        setOutput(atob(responseData.compile_output));
        return [statusId, atob(responseData.compile_output)];
      }

      setOutput(responseData.status.description);
      return [statusId, responseData.status.description];
    } catch (err) {
      console.log("err in getstatus try", err);
      return [0, "error"];
    }
  };

  // Function to get status and await completion of the submission
  const checkStatus = async (token: string) => {
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Sleep for 2 seconds
      const [status, result] = await getStatus(token); // Get status of submission
      if (status === 3) {
        // If status is completed, return result
        return [status, result as string];
      }
      if (status === 1 || status === 2) {
        // If status is not completed, continue
        continue;
      } else {
        // If status code is something else, return error
        return [0, result as string];
      }
    }
  };

  const handleRun = async () => {
    setButtonState("loading");
    await handleSubmit();
    setButtonState("default");
  };

  return (
    <ResizablePanelGroup direction="vertical" className="h-full w-full">
      {/* Code Editor */}
      <ResizablePanel defaultSize={50}>
        <div className="relative m-1">
          <Button
            onClick={() => handleRun()}
            className={cn(
              "absolute right-3 top-3 z-10",
              buttonStyle(buttonState),
            )}
          >
            <PlayIcon />
          </Button>
          <CodeEditor
            className="-z-0"
            roomId={props.groupRoomId}
            username={props.usernameString}
            onCodeChange={(code) => setCode(code)} // function to update code in state
          />
        </div>
      </ResizablePanel>
      {/* End of Code Editor */}
      <ResizableHandle />

      {/* Test Suite and Output */}
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          {/* Test Suite */}
          <ResizablePanel defaultSize={50}>
            <div className="m-1 flex h-full items-stretch justify-center">
              <TestSuite
                testSubmit={handleTestSubmit}
                tests={props.tests}
                setOutput={setOutput}
              />
            </div>
          </ResizablePanel>
          {/* End of Test Suite */}
          <ResizableHandle />
          {/* Output */}
          <ResizablePanel defaultSize={50}>
            <div className="whitespace-pre-wrap" data-testid="test">
              {output}
            </div>
          </ResizablePanel>
          {/* End of Output */}
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
export default Codespace;
