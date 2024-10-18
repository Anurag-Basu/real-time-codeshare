/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";

// import { ACTIONS } from "../../utils/actions";
import TextArea from "antd/es/input/TextArea";
import { SocketIo } from "../../socket";
import { ACTIONS } from "../../utils/actions";

interface EditorProps {
  // socketRef: React.MutableRefObject<any>;
  roomId: string;
  // onCodeChange: (code: string) => void;
}

const EditorComponent: React.FC<EditorProps> = ({ roomId }) => {
  const editorRef = useRef<CodeMirror.EditorFromTextArea | null>(null);
  const [code, setCode] = useState<string>("");
  console.log({ roomId });

  console.log(editorRef.current);

  const onChangeCode = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const code = e.target.value;
    setCode(code);
    SocketIo.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code,
    });
  };

  useEffect(() => {
    SocketIo.on(ACTIONS.CODE_CHANGE, ({ code }: { code: string }) => {
      setCode(code);
    });

    return () => {
      SocketIo.off(ACTIONS.CODE_CHANGE);
    };
  }, []);

  // useEffect(() => {
  //   // Listen for code sync when a new user joins
  //   SocketIo.on(ACTIONS.SYNC_CODE, ({ code }: { code: string }) => {
  //     setCode(code); // Set the code to the one from the server
  //   });

  //   return () => {
  //     SocketIo.off(ACTIONS.SYNC_CODE); 
  //   };
  // }, []);

  return (
    <div className="h-[600px]">
      <TextArea
        value={code}
        onChange={onChangeCode}
        id="realtimeEditor"
        rows={10}
      />
    </div>
  );
};

export default EditorComponent;
