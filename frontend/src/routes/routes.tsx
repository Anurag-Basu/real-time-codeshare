import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Editor, Home } from '../pages';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/editor/:roomId" element={<Editor />} />
    </Routes>
  );
};

export default AppRoutes;
