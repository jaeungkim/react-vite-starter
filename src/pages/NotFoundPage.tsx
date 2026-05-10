import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="text-5xl font-bold">404</div>
      <p className="text-muted-foreground">Page not found</p>
      <Button onClick={() => navigate('/')}>Go home</Button>
    </div>
  );
}
