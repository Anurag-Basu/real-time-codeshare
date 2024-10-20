/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
// import { initSocket } from "../Socket";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { toast } from "react-hot-toast";
import { ACTIONS } from "../../utils/actions";
import { ClientAvatar, EditorComponent } from "../../component";
import { SocketIo } from "../../socket.ts";

const LANGUAGES = [
  "python3",
  "java",
  "cpp",
  "nodejs",
  "c",
  "ruby",
  "go",
  "scala",
  "bash",
  "sql",
  "pascal",
  "csharp",
  "php",
  "swift",
  "rust",
  "r",
];

interface Client {
  socketId: string;
  username: string;
}

function EditorPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python3");

  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();

  useEffect(() => {
    // socketRef.current = await initSocket();
    // socketRef.current.on("connect_error", handleError);
    // socketRef.current.on("connect_failed", handleError);

    // console.log("ACTION.JOIN");
    SocketIo.emit(ACTIONS.JOIN, {
      roomId,
      username: location.state?.username,
    });

    SocketIo.on(
      ACTIONS.JOINED,
      ({
        clients,
        username,
        socketId,
      }: {
        clients: Client[];
        username: string;
        socketId: string;
      }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
        }
        console.log(socketId);
        setClients(clients);
        // if (codeRef.current) {
        SocketIo.emit(ACTIONS.SYNC_CODE, {
          socketId,
          roomId,
        });
        // }
      }
    );

    SocketIo.on(
      ACTIONS.DISCONNECTED,
      ({ socketId, username }: { socketId: string; username: string }) => {
        toast.success(`${username} left the room`);
        setClients((prev) =>
          prev.filter((client) => client.socketId !== socketId)
        );
      }
    );

    // const handleError = (err: Error) => {
    //   console.log("Error", err);
    //   toast.error("Socket connection failed, Try again later");
    //   navigate("/");
    // };

    return () => {
      SocketIo.disconnect();
      SocketIo.off(ACTIONS.JOINED);
      SocketIo.off(ACTIONS.DISCONNECTED);
    };
  }, [location.state, navigate, roomId]);

  useEffect(() => {
    SocketIo.emit(ACTIONS.SYNC_CODE, {
      socketId: "",
      roomId,
    });
  }, []);

  // if (!location.state) {
  //   return <Navigate to="/" />;
  // }
  console.log({ clients }, location.state);
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId || "");
      toast.success("Room ID is copied");
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy the room ID");
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };

  useEffect(() => {
    if (!roomId || !location.state) return;

    SocketIo.emit(ACTIONS.JOIN, {
      roomId,
      username: location.state?.username,
    });
  }, [roomId, location]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        {/* Client panel */}
        <div className="flex flex-col w-1/5 p-4 text-white bg-gray-900">
          <img
            src="/images/codecast.png"
            alt="Logo"
            className="max-w-xs mx-auto mb-6"
            style={{ maxWidth: "150px" }}
          />
          <hr className="mb-4" />

          {/* Client list */}
          <div className="flex-grow overflow-y-auto">
            <span className="mb-2 text-sm">Members</span>
            {clients.map((client) => (
              <ClientAvatar key={client.socketId} username={client.username} />
            ))}
          </div>

          <hr className="my-4" />
          {/* Action buttons */}
          <div className="mt-auto space-y-2">
            <button
              className="w-full py-2 text-white bg-green-600 rounded hover:bg-green-700"
              onClick={copyRoomId}
            >
              Copy Room ID
            </button>
            <button
              className="w-full py-2 text-white bg-red-600 rounded hover:bg-red-700"
              onClick={leaveRoom}
            >
              Leave Room
            </button>
          </div>
        </div>

        {/* Editor panel */}
        <div className="flex flex-col w-4/5">
          {/* Language selector */}
          <div className="flex justify-end p-4 bg-gray-800">
            <select
              className="px-4 py-2 text-white bg-gray-700 rounded"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <EditorComponent key={uuid()} roomId={roomId || ""} />
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
