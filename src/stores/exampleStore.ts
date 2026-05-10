import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ExampleState {
  count: number;
  increment: () => void;
  reset: () => void;
}

export const useExampleStore = create<ExampleState>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((s) => ({ count: s.count + 1 })),
      reset: () => set({ count: 0 }),
    }),
    { name: 'example' },
  ),
);
