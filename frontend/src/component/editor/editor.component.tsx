/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";

// import { ACTIONS } from "../../utils/actions";
import TextArea from "antd/es/input/TextArea";
import { SocketIo } from "../../socket";
import { ACTIONS } from "../../utils/actions";
import "./editor.component.css";
interface EditorProps {
  // socketRef: React.MutableRefObject<any>;
  roomId: string;
  // onCodeChange: (code: string) => void;
}

const EditorComponent: React.FC<EditorProps> = ({ roomId }) => {
  const [code, setCode] = useState<string>("");
  console.log({ roomId });

  const onChangeCode = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const code = e.target.value;
    setCode(code);
    SocketIo.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code,
    });
  };

  useEffect(() => {
    console.log("entered codeChange", { code });
    SocketIo.on(ACTIONS.CODE_CHANGE, ({ code }: { code: string }) => {
      console.log("useEffect codeChange", { code });
      setCode(code);
    });

    return () => {
      SocketIo.off(ACTIONS.CODE_CHANGE);
    };
  }, []);

  console.log({ code });

  return (
    <div className="h-[600px]">
      <TextArea
        placeholder="type here..."
        value={code}
        onChange={onChangeCode}
        id="realtimeEditor"
        rows={10}
      />
    </div>
  );
};

export default EditorComponent;
