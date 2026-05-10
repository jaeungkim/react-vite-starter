import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import RootLayout from '@/components/RootLayout';
import HomePage from '@/pages/HomePage/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);

export default function Router() {
  return <RouterProvider router={router} />;
}
