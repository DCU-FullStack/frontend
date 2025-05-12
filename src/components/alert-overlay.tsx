import { motion, AnimatePresence } from "framer-motion";

interface AlertOverlayProps {
  isVisible: boolean;
}

export function AlertOverlay({ isVisible }: AlertOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 pointer-events-none"
          style={{
            background: "red",
            animation: "flash 1s ease-in-out 2",
          }}
        />
      )}
    </AnimatePresence>
  );
} 