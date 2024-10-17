import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const navigate = useNavigate();

  const generateRoomId = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success("Room ID is generated");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Both fields are required");
      return;
    }

    // Redirecting to the editor with the room ID and username in state
    navigate(`/editor/${roomId}`, {
      state: { username },
    });
    toast.success("Room is created");
  };

  const handleInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="p-5 mb-6 rounded shadow-lg bg-secondary">
          <div className="p-6 text-center rounded bg-dark">
            <img
              src="../../assets/react.svg"
              alt="Logo"
              className="max-w-xs mx-auto mb-4"
              style={{ maxWidth: "150px" }}
            />
            <h4 className="mb-4 text-2xl font-semibold text-light">
              Enter the ROOM ID
            </h4>

            <div className="mb-4">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-2 mb-2 text-white placeholder-gray-400 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ROOM ID"
                onKeyUp={handleInputEnter}
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 mb-2 text-white placeholder-gray-400 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="USERNAME"
                onKeyUp={handleInputEnter}
              />
            </div>

            <button
              onClick={joinRoom}
              className="w-full py-3 text-lg font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              JOIN
            </button>

            <p className="mt-4 text-light">
              Don't have a room ID? Create{" "}
              <span
                onClick={generateRoomId}
                className="text-green-400 underline cursor-pointer hover:text-green-500"
              >
                New Room
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
