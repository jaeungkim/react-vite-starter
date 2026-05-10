import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Props {
  isOpen: boolean;
  close: (confirmed: boolean) => void;
  unmount: () => void;
}

export default function ExampleDialog({ isOpen, close, unmount }: Props) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close(false);
      }}
    >
      <DialogContent onCloseAutoFocus={unmount}>
        <DialogHeader>
          <DialogTitle>Example dialog</DialogTitle>
          <DialogDescription>
            Opened imperatively with <code>overlay.open()</code> from{' '}
            <code>overlay-kit</code>. The promise resolves with whatever you
            pass to <code>close()</code>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => close(false)}>
            Cancel
          </Button>
          <Button onClick={() => close(true)}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
