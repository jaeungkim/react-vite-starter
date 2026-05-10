import { Outlet } from 'react-router';
import { Toaster } from 'sonner';

export default function RootLayout() {
  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <Outlet />
      <Toaster position="top-center" />
    </div>
  );
}
