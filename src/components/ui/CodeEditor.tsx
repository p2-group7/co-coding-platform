/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
// @ts-expect-error decleration file for this is wrong, but works
import { yCollab } from "y-codemirror.next";
import { WebsocketProvider } from "y-websocket";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import RandomColor from "randomcolor";
import { oneDark } from "@codemirror/theme-one-dark";

interface CodeEditorProps {
  roomId: string;
}

export default function CodeEditor({ roomId }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doc = new Y.Doc(); // a collection of shared objects -> Text
    let provider: WebsocketProvider | null = null;
    // Connect to peers (or start connection) with websocket
    provider = new WebsocketProvider(
      "wss://y-websocket-xwh3.onrender.com",
      roomId,
      doc,
    );

    // Listen to sync events and only update the editor when the sync is complete
    provider.on("sync", (event: boolean) => {
      console.log(event);
      setLoading(false);
    });

    const yText = doc.getText("codemirror");

    const yUndoManager = new Y.UndoManager(yText);

    const color = RandomColor();

    // TODO fix to be current user and a random color
    provider.awareness.setLocalState({
      name: "Emanuel",
      color: color,
    });

    const state = EditorState.create({
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      doc: yText.toString(),
      extensions: [
        basicSetup,
        javascript(),
        oneDark,
        yCollab(yText, provider.awareness, {
          yUndoManager,
        }),
      ],
    });

    const editorRefEelement: Element = editorRef.current as Element;
    const view = new EditorView({
      state,
      parent: editorRefEelement,
    });
    return () => {
      view.destroy();
      if (provider) {
        provider.disconnect();
        doc.destroy();
      }
    };
  }, [roomId]);

  return (
    <div>
      <div className="flex justify-center" hidden={!loading}>
        <p hidden={!loading}>Loading...</p>
      </div>
      <div ref={editorRef} id="editor" hidden={loading}></div>
    </div>
  );
}
