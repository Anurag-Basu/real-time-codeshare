/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import { ACTIONS } from "../../utils/actions";
import TextArea from "antd/es/input/TextArea";

interface EditorProps {
  socketRef: React.MutableRefObject<any>;
  roomId: string;
  onCodeChange: (code: string) => void;
}

const Editor: React.FC<EditorProps> = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef<CodeMirror.EditorFromTextArea | null>(null);

  useEffect(() => {
    const init = () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realtimeEditor") as HTMLTextAreaElement,
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
      editorRef.current = editor;

      editor.setSize(null, "100%");
      editorRef.current.on(
        "change",
        (instance: { getValue: () => any }, changes: { origin: any }) => {
          const { origin } = changes;
          const code = instance.getValue(); // Get the code from editor
          onCodeChange(code);
          if (origin !== "setValue") {
            socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
          }
        }
      );
    };

    init();
  }, [onCodeChange, roomId, socketRef]);

  useEffect(() => {
    const socket = socketRef.current;
    if (socket) {
      socket.on(ACTIONS.CODE_CHANGE, ({ code }: { code: string }) => {
        if (editorRef.current && code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socketRef]);

  return (
    <div className="h-[600px]">
      <TextArea id="realtimeEditor" />
    </div>
  );
};

export default Editor;
