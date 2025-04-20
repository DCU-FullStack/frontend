import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* 인증 페이지 */}
          <Route path="/auth" element={
            <AuthRoute>
              <AuthPage />
            </AuthRoute>
          } />
          
          {/* 보호된 라우트 */}
          <Route path="/" element={
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
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
