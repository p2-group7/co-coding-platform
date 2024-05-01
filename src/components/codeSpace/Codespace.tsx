"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeEditor from "../ui/CodeEditor";
import TestSuite from "./Testsuite";
import { useEffect, useState } from "react";
import { env } from "@/env";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

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

function Codespace(props: CodespaceProps) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = () => {
    // if text contains //run
    if (code.includes("//run")) {
      console.log("run");

      // send code to judge0 api
      const data = {
        language_id: 50, // id for C with gcc 9.2.0
        source_code: btoa(code), // base64 encoded code
      };
      const url =
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*";
      fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Content-Type": "application/json",
          "X-RapidAPI-Key": env.NEXT_PUBLIC_RAPID_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data: postSubmissionResponse) => {
          console.log(data);
          const token = data.token;
          console.log(token);
          checkStatus(token).catch((err) => {
            console.log("err in checkstatus", err);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const checkStatus = async (token: string) => {
    const url =
      "https://judge0-ce.p.rapidapi.com/submissions" +
      "/" +
      token +
      "?base64_encoded=true&fields=*";
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": env.NEXT_PUBLIC_RAPID_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
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
        setOutput(atob(responseData.compile_output));
        return [statusId, atob(responseData.compile_output)];
      }

      setOutput(responseData.status.description);
      return [statusId, responseData.status.description];
    } catch (err) {
      console.log("err in checkstatus try", err);
      return [0, "error"];
    }
  };

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
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": env.NEXT_PUBLIC_RAPID_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify(data),
    });
    const responseData = (await res.json()) as postSubmissionResponse;
    const token = responseData.token;
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const [status, result] = await checkStatus(token);
      if (status === 3) {
        console.log("test completed");
        console.log(result);
        return testOutput === result;
      }
      if (status === 1 || status === 2) {
        break;
      } else {
        console.log("test failed");
        console.log(result);
        return false;
      }
    }
  };

  // When the code changes, run the handleSubmit function
  useEffect(() => {
    //console.log("code", code);
    handleSubmit();
  }, [code]);
  return (
    <ResizablePanelGroup direction="vertical" className="h-full w-full">
      <ResizablePanel defaultSize={50}>
        <div className="m-1">
          <CodeEditor
            roomId={props.groupRoomId}
            username={props.usernameString}
            onCodeChange={(code) => setCode(code)} // function to update code in state
          />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={50}>
            <div className="m-1 flex h-full items-stretch justify-center">
              <TestSuite
                testSubmit={handleTestSubmit}
                tests={props.tests}
                setOutput={setOutput}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-6">
              <p className="text-wrap font-semibold">{output}</p>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
export default Codespace;
