import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import {
  Home,
  Video,
  AlertTriangle,
  ClipboardCheck,
  BarChart3,
  Settings,
  LogOut,
  LogIn,
  Lock,
  Cog,
} from "lucide-react";
import { cn } from "@/lib/utils";

const pageTitles: { [key: string]: string } = {
  "/": "홈",
  "/cctv": "CCTV 감시",
  "/incidents": "이상 보고",
  "/tasks": "작업 현황",
  "/analytics": "데이터 분석",
  "/settings": "설정",
  "/admin": "관리자",
};

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
};

const NavItem = ({
  icon,
  label,
  to,
  isActive = false,
  onClick,
  disabled = false,
}: NavItemProps) => (
  <li>
    {disabled ? (
      <div
        className={cn(
          "flex items-center px-3 py-2 text-gray-400 cursor-not-allowed opacity-50"
        )}
        title="로그인이 필요합니다"
      >
        {icon}
        <span className="ml-2">{label}</span>
        <Lock className="w-4 h-4 ml-2" />
      </div>
    ) : (
      <Link
        to={to}
        onClick={onClick}
        className={cn(
          "flex items-center px-3 py-2 rounded hover:bg-gray-100",
          isActive && "bg-gray-200 font-semibold"
        )}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </Link>
    )}
  </li>
);

export function Header({ toggleSidebar }: { toggleSidebar?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutMutation, isAdmin } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      navigate("/auth");
    }
  };

  const handleProtectedClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate("/auth");
    }
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* 로고 & 제목 */}
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 13l1.5-4.5A2 2 0 016.4 7h11.2a2 2 0 011.9 1.5L21 13v5a1 1 0 01-1 1h-1a2 2 0 01-4 0H9a2 2 0 01-4 0H4a1 1 0 01-1-1v-5z"
            />
            <circle cx="7" cy="18" r="1" stroke="currentColor" strokeWidth="2" />
            <circle cx="17" cy="18" r="1" stroke="currentColor" strokeWidth="2" />
          </svg>
            <span className="text-lg font-bold">스마트 도로 시스템</span>
          </Link>

        {/* 네비게이션 */}
        <ul className="flex space-x-4">
          <NavItem icon={<Home className="w-4 h-4" />} label="홈" to="/" isActive={location.pathname === "/"} />
          <NavItem icon={<Video className="w-4 h-4" />} label="CCTV 감시" to="/cctv" isActive={location.pathname === "/cctv"} onClick={handleProtectedClick} disabled={!user} />
          <NavItem icon={<AlertTriangle className="w-4 h-4" />} label="이상 보고" to="/incidents" isActive={location.pathname === "/incidents"} onClick={handleProtectedClick} disabled={!user} />
          <NavItem icon={<ClipboardCheck className="w-4 h-4" />} label="작업 현황" to="/tasks" isActive={location.pathname === "/tasks"} onClick={handleProtectedClick} disabled={!user} />
          <NavItem icon={<BarChart3 className="w-4 h-4" />} label="데이터 분석" to="/analytics" isActive={location.pathname === "/analytics"} onClick={handleProtectedClick} disabled={!user} />
          {isAdmin && (
            <NavItem icon={<Cog className="w-4 h-4" />} label="관리자" to="/admin" isActive={location.pathname === "/admin"} />
          )}
        </ul>

        {/* 유저 메뉴 */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 text-white bg-black rounded-full"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <span className="text-sm font-medium">{user ? user.name?.[0] || user.username?.[0] || "U" : ""}</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 z-50 w-48 mt-2 bg-white border rounded shadow">
              {user ? (
                <>
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-semibold">{user.name || user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>마이페이지</Link>
                  <button onClick={() => { handleLogout(); setShowUserMenu(false); }} className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100">로그아웃</button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>로그인</Link>
                  <Link to="/auth?mode=register" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>회원가입</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
