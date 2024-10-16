import TextArea from "antd/es/input/TextArea";
import { socket } from "../../socket.ts";
// import { useEffect } from "react";

function Home() {
  const onChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const userInput = e.target.value;
    console.log(userInput);

    socket.emit("chat", userInput);
  };

  return (
    <>
      <TextArea onChange={onChangeTextArea} />
    </>
  );
}

export default Home;
