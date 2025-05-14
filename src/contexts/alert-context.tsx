import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface AlertContextType {
  showAlert: (duration?: number) => void;
  hideAlert: () => void;
  isAlertVisible: boolean;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertTimeout, setAlertTimeout] = useState<number | null>(null);

  const hideAlert = useCallback(() => {
    setIsAlertVisible(false);
    
    if (alertTimeout) {
      clearTimeout(alertTimeout);
      setAlertTimeout(null);
    }
  }, [alertTimeout]);

  const showAlert = useCallback((duration = 3000) => {
    // 이미 실행 중인 타이머가 있다면 제거
    if (alertTimeout) {
      clearTimeout(alertTimeout);
    }
    
    // 알림 표시
    setIsAlertVisible(true);
    
    // 지정된 시간 후 알림 숨김
    const timeoutId = window.setTimeout(() => {
      setIsAlertVisible(false);
      setAlertTimeout(null);
    }, duration);
    
    setAlertTimeout(timeoutId);
  }, [alertTimeout]);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, isAlertVisible }}>
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