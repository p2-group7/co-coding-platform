/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useRef } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import * as monaco from "monaco-editor";
import Editor, { Monaco } from "@monaco-editor/react";

interface CodeEditorProps {
  roomId: string;
}

// https://github.com/yjs/y-webrtc?tab=readme-ov-file
export default function CodeEditor({ roomId }: CodeEditorProps) {
  const editorRef: React.MutableRefObject<
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    monaco.editor.IStandaloneCodeEditor | undefined
  > = useRef<monaco.editor.IStandaloneCodeEditor>();

  // Editor value -> YJS Text value (A text value shared by multiple people)
  // One person deletes text -> Deletes from the overall shared text value
  // Handled by YJS

  // Initialize YJS, tell it to listen to our Monaco instance for changes.

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    editorRef.current = editor;
    // Initialize YJS
    const doc = new Y.Doc(); // a collection of shared objects -> Text
    // Connect to peers (or start connection) with WebRTC
    const provider = new WebrtcProvider(roomId, doc, {
      signaling: ["wss://y-webrtc-ckynwnzncc.now.sh", "ws://localhost:4444"],
    }); // room1, room2
    const type = doc.getText("monaco"); // doc { "monaco": "what our IDE is showing" }
    // Bind YJS to Monaco
    const editorModel = editorRef.current.getModel();

    if (editorModel !== null) {
      const binding = new MonacoBinding(
        type,
        editorModel,
        new Set([editorRef.current]),
        provider.awareness,
      );
    }
    console.log(provider.awareness);
  }
  // TODO DO PROPER ERROR HANDLING
  if (roomId === undefined) {
    return <div>Loading...</div>;
  } else {
    return (
      <div style={{ left: "85px", top: "0px", position: "absolute" }}>
        <Editor
          height="100vh"
          width="90vw"
          theme="vs-dark"
          defaultLanguage="c"
          onMount={handleEditorDidMount}
        />
      </div>
    );
  }
}
