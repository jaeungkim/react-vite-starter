---
description: Dialog / overlay patterns — overlay-kit + shadcn Dialog.
---

# Dialogs & Overlays

Open dialogs imperatively with [`overlay-kit`](https://overlay-kit.slash.page/)
(Toss). Render shadcn's `Dialog` inside the callback. Don't manage open/close
state in the parent.

## 1. Setup (already done)

`OverlayProvider` wraps the app in `src/main.tsx`. Don't add a second one.

## 2. Open a dialog

```tsx
import { overlay } from 'overlay-kit';

import ConfirmDialog from '@/pages/Foo/components/ConfirmDialog';

function onDelete() {
  overlay.open(({ isOpen, close, unmount }) => (
    <ConfirmDialog isOpen={isOpen} close={close} unmount={unmount} />
  ));
}
```

For dialogs that return a value, use `overlay.openAsync<T>` and resolve
through `close(value)`:

```tsx
const confirmed = await overlay.openAsync<boolean>(
  ({ isOpen, close, unmount }) => (
    <ConfirmDialog isOpen={isOpen} close={close} unmount={unmount} />
  ),
);

if (confirmed) {
  await deleteThing();
}
```

## 3. Dialog component shape

Every dialog component takes the same three props from `overlay-kit`:

```ts
interface OverlayProps<T = void> {
  isOpen: boolean;
  close: (value: T) => void;
  unmount: () => void;
}
```

Wrap shadcn's `Dialog` with `open={isOpen}` and forward `unmount` to
`onCloseAutoFocus` so the overlay is removed from the tree after the exit
transition:

```tsx
<Dialog
  open={isOpen}
  onOpenChange={(open) => {
    if (!open) close(false);
  }}
>
  <DialogContent onCloseAutoFocus={unmount}>...</DialogContent>
</Dialog>
```

See `src/pages/HomePage/components/ExampleDialog.tsx` for the canonical
template.

## 4. File placement

- Page-owned dialogs: `src/pages/<PageName>/components/<DialogName>Dialog.tsx`.
- Shared / cross-page dialogs: `src/components/dialogs/<DialogName>Dialog.tsx`
  (create the folder when the second cross-page dialog appears, not before).

## 5. Rules

- Never hold dialog open/close state in `useState`. Use `overlay.open(Async)`.
- One file per dialog. Suffix the file and component with `Dialog`.
- Dialog components only know about their own props — they do not import
  page state. Pass everything they need through arguments captured in the
  `overlay.open` callback closure.
- Don't reach for `overlay-kit` for popovers, tooltips, or dropdowns —
  those use shadcn primitives directly. Overlays are for modal flows
  (confirm, form, picker).
