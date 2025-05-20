import { motion, AnimatePresence } from "framer-motion";

interface AlertOverlayProps {
  isVisible: boolean;
  currentPath: string;
}

export function AlertOverlay({ isVisible, currentPath }: AlertOverlayProps) {
  const sensitivePaths = ["/dashboard", "/incidents", "/tasks"];
  
  const shouldShowOverlay = isVisible && sensitivePaths.includes(currentPath);

  return (
    <AnimatePresence>
      {shouldShowOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{
            background: "rgba(255, 80, 80, 0.6)",
            animation: "flash 1.2s ease-in-out infinite",
            boxShadow: "inset 0 0 40px rgba(255, 180, 180, 0.3)"
          }}
        />
      )}
    </AnimatePresence>
  );
} 