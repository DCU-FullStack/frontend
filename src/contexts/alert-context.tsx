import { createContext, useContext, useState, ReactNode } from "react";

interface AlertContextType {
  showAlert: () => void;
  isAlertVisible: boolean;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const showAlert = () => {
    setIsAlertVisible(true);
    setTimeout(() => {
      setIsAlertVisible(false);
    }, 2000); // 2초 후 알림 숨김
  };

  return (
    <AlertContext.Provider value={{ showAlert, isAlertVisible }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
} 