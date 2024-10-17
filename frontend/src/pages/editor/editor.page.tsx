/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
// import { initSocket } from "../Socket";
import {
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { ACTIONS } from "../../utils/actions";
import { ClientAvatar, EditorComponent } from "../../component";
import { initSocket } from "../../socket";

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
  const [output, setOutput] = useState<string>("");
  const [isCompileWindowOpen, setIsCompileWindowOpen] =
    useState<boolean>(false);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python3");

  const codeRef = useRef<string | null>(null);
  const socketRef = useRef<any>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", handleError);
      socketRef.current.on("connect_failed", handleError);

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
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
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      socketRef.current.on(
        ACTIONS.DISCONNECTED,
        ({ socketId, username }: { socketId: string; username: string }) => {
          toast.success(`${username} left the room`);
          setClients((prev) =>
            prev.filter((client) => client.socketId !== socketId)
          );
        }
      );
    };

    const handleError = (err: Error) => {
      console.log("Error", err);
      toast.error("Socket connection failed, Try again later");
      navigate("/");
    };

    init();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    };
  }, [location.state, navigate, roomId]);

  if (!location.state) {
    return <Navigate to="/" />;
  }

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

  const runCode = async () => {
    setIsCompiling(true);
    try {
      const response = await axios.post("http://localhost:8000/compile", {
        code: codeRef.current,
        language: selectedLanguage,
      });
      setOutput(response.data.output || JSON.stringify(response.data));
    } catch (error: any) {
      console.error("Error compiling code:", error);
      setOutput(error.response?.data?.error || "An error occurred");
    } finally {
      setIsCompiling(false);
    }
  };

  const toggleCompileWindow = () => {
    setIsCompileWindowOpen(!isCompileWindowOpen);
  };

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

          <EditorComponent
            socketRef={socketRef}
            roomId={roomId || ""}
            onCodeChange={(code: string) => {
              codeRef.current = code;
            }}
          />
        </div>
      </div>

      {/* Compiler toggle button */}
      <button
        className="fixed px-4 py-2 text-white bg-blue-600 rounded bottom-4 right-4 hover:bg-blue-700"
        onClick={toggleCompileWindow}
      >
        {isCompileWindowOpen ? "Close Compiler" : "Open Compiler"}
      </button>

      {/* Compiler section */}
      <div
        className={`bg-gray-900 text-white p-4 transition-all ${
          isCompileWindowOpen ? "block" : "hidden"
        }`}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30vh",
          zIndex: 1040,
          overflowY: "auto",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <h5 className="m-0 text-lg">Compiler Output ({selectedLanguage})</h5>
          <div>
            <button
              className="px-4 py-2 mr-2 text-white bg-green-600 rounded hover:bg-green-700"
              onClick={runCode}
              disabled={isCompiling}
            >
              {isCompiling ? "Compiling..." : "Run Code"}
            </button>
            <button
              className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
              onClick={toggleCompileWindow}
            >
              Close
            </button>
          </div>
        </div>
        <pre className="p-4 bg-gray-800 rounded">
          {output || "Output will appear here after compilation"}
        </pre>
      </div>
    </div>
  );
}

export default EditorPage;
