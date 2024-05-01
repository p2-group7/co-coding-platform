/* eslint-disable @typescript-eslint/no-base-to-string */
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
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { clike } from "@codemirror/legacy-modes/mode/clike";
import RandomColor from "randomcolor";
import { oneDark } from "@codemirror/theme-one-dark";
import { StreamLanguage } from "@codemirror/language";

interface CodeEditorProps {
  roomId: string;
  username: string;
  onCodeChange: (code: string) => void;
  className?: string;
}

export default function CodeEditor({
  roomId,
  username,
  onCodeChange,
  className,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [ydoc, setYDoc] = useState<Y.Doc>();

  useEffect(() => {
    const doc = new Y.Doc(); // a collection of shared objects -> Text
    setYDoc(doc);

    let webrtcprovider: WebsocketProvider | null = null;
    // Connect to peers (or start connection) with websocket
    webrtcprovider = new WebsocketProvider(
      "wss://y-websocket-xwh3.onrender.com",
      roomId,
      doc,
    );

    // Listen to sync events and only update the editor when the sync is complete
    webrtcprovider.on("sync", (event: boolean) => {
      console.log(event);
      setLoading(false);
    });

    const yText = doc.getText("codemirror");

    const yUndoManager = new Y.UndoManager(yText);

    // TODO fix to be current user and a random color
    webrtcprovider.awareness.setLocalStateField("user", {
      name: username,
      color: RandomColor(),
    });

    const state = EditorState.create({
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      doc: yText.toString(),
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        StreamLanguage.define(clike({ name: "C" })),
        oneDark,
        yCollab(yText, webrtcprovider.awareness, {
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
      if (webrtcprovider) {
        webrtcprovider.disconnect();
        doc.destroy();
      }
    };
  }, [roomId, username]);

  useEffect(() => {
    if (ydoc) {
      ydoc.on("update", () => {
        // log current ytext
        const yText = ydoc.getText("codemirror");
        const text = yText.toString();
        onCodeChange(text); // update codespace state for text in code editor
      });
    }
  }, [ydoc]);

  return (
    <div className={className}>
      <div
        className="flex items-center justify-center text-center"
        hidden={!loading}
      >
        <p className="animate-pulse" hidden={!loading}>
          Loading code editor...
        </p>
      </div>
      <div ref={editorRef} id="editor" hidden={loading}></div>
    </div>
  );
}
