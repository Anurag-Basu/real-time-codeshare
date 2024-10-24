// import { io } from "socket.io-client";

// export const initSocket = async () => {
//   const options = {
//     "force new connection": true,
//     reconnectionAttempts: Infinity,
//     timeout: 100000,
//     transports: ["websocket"],
//   };
//   console.log(import.meta.env.REACT_APP_BACKEND_URL)
//   return io(import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:8000/", options);
// };

import { io } from "socket.io-client";

// const URL = 'http://localhost:8000/';
const URL = "https://real-time-codeshare.vercel.app/";

export const SocketIo = io(URL);
