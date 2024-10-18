/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror, {
  Editor as CodeMirrorEditor,
  EditorChange,
} from "codemirror";
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
        (instance: CodeMirrorEditor, changes: EditorChange) => {
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

  // useEffect(() => {
  //   const socket = socketRef.current;
  //   if (socket) {
  //     // Listen for code change events and update the editor
  //     socket.on(ACTIONS.CODE_CHANGE, ({ code }: { code: string }) => {
  //       if (
  //         editorRef.current &&
  //         code !== null &&
  //         editorRef.current.getValue() !== code
  //       ) {
  //         // Set the code in the editor if it's different from the current value
  //         editorRef.current.setValue(code);
  //       }
  //     });

  //     // Listen for sync code events when a new member joins
  //     socket.on(ACTIONS.SYNC_CODE, ({ code }: { code: string }) => {
  //       if (
  //         editorRef.current &&
  //         code !== null &&
  //         editorRef.current.getValue() !== code
  //       ) {
  //         editorRef.current.setValue(code); // Set the current code for the new member
  //       }
  //     });
  //   }
  //   return () => {
  //     if (socket) {
  //       socket.off(ACTIONS.CODE_CHANGE);
  //       socket.off(ACTIONS.SYNC_CODE);
  //     }
  //   };
  // }, [socketRef]);


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
      editorRef.current.on("change", (instance: CodeMirrorEditor, changes: EditorChange) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
        }
      });
    };
  
    init();
  }, [onCodeChange, roomId, socketRef]);
  
  useEffect(() => {
    const socket = socketRef.current;
  
    if (socket) {
      // When receiving code change, update the editor's content without triggering the 'change' event
      socket.on(ACTIONS.CODE_CHANGE, ({ code }: { code: string }) => {
        if (editorRef.current && code !== null) {
          const currentCode = editorRef.current.getValue();
          
          // Update the editor only if the incoming code is different
          if (currentCode !== code) {
            editorRef.current.setValue(code);
          }
        }
      });
  
      // Handle syncing the current code when a new user joins
      socket.on(ACTIONS.SYNC_CODE, ({ code }: { code: string }) => {
        if (editorRef.current && code !== null) {
          const currentCode = editorRef.current.getValue();
          
          // Avoid resetting the code for the current user unless it's different
          if (currentCode !== code) {
            editorRef.current.setValue(code);
          }
        }
      });
    }
  
    return () => {
      if (socket) {
        socket.off(ACTIONS.CODE_CHANGE);
        socket.off(ACTIONS.SYNC_CODE);
      }
    };
  }, [socketRef.current]);
  
  

  console.log(editorRef.current);
  return (
    <div className="h-[600px]">
      <TextArea id="realtimeEditor" />
    </div>
  );
};

export default Editor;
