import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import PhraseList from './PhraseList';
import PhrasePractice from './PhrasePractice';

const root = ReactDOM.createRoot(document.getElementById('root'));
// Define our routes using the Data Router API and opt into v7 behavior early
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<LandingPage />} />
      <Route path="phrases" element={<PhraseList />} />
      <Route path="phrases/:id" element={<PhrasePractice />} />
    </Route>
  ),
  // {
  //   future: {
  //     v7_startTransition: true,
  //     v7_relativeSplatPath: true,
  //   },
  // }
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
