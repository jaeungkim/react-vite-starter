import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export function MotionDemo() {
  const [show, setShow] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <motion.button
        type="button"
        className="bg-primary text-primary-foreground self-start rounded-lg px-4 py-2 text-sm font-medium shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Hover or tap me
      </motion.button>

      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline" onClick={() => setShow((v) => !v)}>
          Toggle card
        </Button>
        <AnimatePresence initial={false}>
          {show && (
            <motion.div
              key="card"
              className="bg-card rounded-lg border px-3 py-2 text-sm"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              Hello from Motion
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
