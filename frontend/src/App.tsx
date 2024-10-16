import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <>
      <div>
        <Toaster position="top-center"></Toaster>
      </div>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
};

export default App;

