import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import AuthPage from "./pages/auth-page";
import DashboardPage from "./pages/dashboard-page";
import CctvPage from "./pages/cctv-page";
import IncidentsPage from "./pages/incidents-page";
import TasksPage from "./pages/tasks-page";
import AnalyticsPage from "./pages/analytics-page";
import SettingsPage from "./pages/settings-page";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import { AdminPage } from "./pages/admin-page";
import { AdminRoute } from "./components/protected-route";
import { ThemeProvider } from "@/contexts/theme-context";
import { HelpPage } from "./pages/help-page";
import { AnimatePresence, motion } from "framer-motion";
import AnimationDemo from "./pages/AnimationDemo";

// 보호된 라우트 컴포넌트
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>;
  }
  
  // 로그인하지 않은 사용자도 페이지를 볼 수 있도록 수정
  return <>{children}</>;
}

// 인증 라우트 컴포넌트 (로그인된 사용자는 접근 불가)
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.08, opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        style={{ height: "100%" }}
      >
        <Routes location={location}>
          {/* 인증 페이지 */}
          <Route path="/auth" element={
            <AuthRoute>
              <AuthPage />
            </AuthRoute>
          } />
          {/* 애니메이션 데모 페이지를 루트 경로로 설정 */}
          <Route path="/" element={
            <ProtectedRoute>
              <AnimationDemo />
            </ProtectedRoute>
          } />
          {/* 대시보드 페이지 경로 변경 */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/cctv" element={
            <ProtectedRoute>
              <CctvPage />
            </ProtectedRoute>
          } />
          <Route path="/incidents" element={
            <ProtectedRoute>
              <IncidentsPage />
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/help" element={
            <ProtectedRoute>
              <HelpPage />
            </ProtectedRoute>
          } />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          {/* 알 수 없는 경로는 대시보드로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AnimatedRoutes />
          <Toaster position="top-right" />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
