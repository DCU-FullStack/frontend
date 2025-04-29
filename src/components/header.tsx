import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/contexts/theme-context";
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
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  User,
  HelpCircle,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
          "flex items-center px-3 py-2 text-gray-400 cursor-not-allowed opacity-50 transition-all duration-200"
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
          "flex items-center px-3 py-2 rounded-md transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20",
          isActive && "bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-800/30 dark:to-purple-800/30 font-semibold text-indigo-700 dark:text-indigo-300"
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
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

  // 로딩 효과를 위한 상태
  const [isLoading, setIsLoading] = useState(true);

  // 로딩 효과를 위한 타이머
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  // 알림 데이터 (실제로는 API에서 가져올 것)
  const notificationData = [
    { id: 1, title: "새로운 사고 발생", message: "서울시 강남구에서 도로 파손이 발생했습니다.", time: "5분 전", read: false },
    { id: 2, title: "작업 할당", message: "신호등 점검 작업이 할당되었습니다.", time: "1시간 전", read: false },
    { id: 3, title: "시스템 업데이트", message: "시스템이 성공적으로 업데이트되었습니다.", time: "3시간 전", read: true }
  ];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-gray-200 shadow-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-md dark:border-gray-800"
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* 로고 & 제목 */}
        <div className="flex items-center space-x-4">
          {toggleSidebar && (
            <button 
              onClick={toggleSidebar}
              className="p-1 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <Link to="/" className="flex items-center space-x-3 transition-opacity hover:opacity-80">
            <div className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">스마트 도로 시스템</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">실시간 도로 모니터링</p>
            </div>
          </Link>
        </div>

        {/* 검색 */}
        <div className="items-center hidden w-full max-w-md mx-4 md:flex">
          <div className="relative w-full">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="검색........"
              className="w-full py-2 pl-10 pr-4 transition-all bg-gray-100 border border-gray-200 rounded-full dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 네비게이션 */}
        <ul className="hidden space-x-1 md:flex">
          <NavItem icon={<Home className="w-4 h-4" />} label="홈" to="/" isActive={location.pathname === "/"} />
          <NavItem icon={<Video className="w-4 h-4" />} label="CCTV 감시" to="/cctv" isActive={location.pathname === "/cctv"} onClick={handleProtectedClick} disabled={!user} />
          <NavItem icon={<AlertTriangle className="w-4 h-4" />} label="이상 보고" to="/incidents" isActive={location.pathname === "/incidents"} onClick={handleProtectedClick} disabled={!user} />
          <NavItem icon={<ClipboardCheck className="w-4 h-4" />} label="작업 현황" to="/tasks" isActive={location.pathname === "/tasks"} onClick={handleProtectedClick} disabled={!user} />
          <NavItem icon={<BarChart3 className="w-4 h-4" />} label="데이터 분석" to="/analytics" isActive={location.pathname === "/analytics"} onClick={handleProtectedClick} disabled={!user} />
          {isAdmin && (
            <NavItem icon={<Cog className="w-4 h-4" />} label="관리자" to="/admin" isActive={location.pathname === "/admin"} />
          )}
        </ul>

        {/* 우측 메뉴 */}
        <div className="flex items-center space-x-3">
          {/* 다크모드 토글 */}
          <button
            onClick={toggleTheme}
            className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="다크모드 전환"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* 알림 */}
          <div className="relative">
            <button
              type="button"
              className="relative p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  {notifications}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 z-50 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg w-80 dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold">알림</h3>
                    <button 
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      onClick={() => setShowNotifications(false)}
                    >
                      모두 보기
                    </button>
                  </div>
                  <div className="overflow-y-auto max-h-80">
                    {notificationData.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-3 border-b border-gray-100 dark:border-gray-700 ${!notification.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                      >
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 유저 메뉴 */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 text-white transition-all rounded-full shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 hover:shadow-lg"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="text-sm font-medium">{user ? user.name?.[0] || user.username?.[0] || "U" : ""}</span>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 z-50 w-56 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  {user ? (
                    <>
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
                        <p className="text-sm font-semibold">{user.name || user.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link 
                          to="/settings" 
                          className="flex items-center px-4 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700" 
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          마이페이지
                        </Link>
                        <Link 
                          to="/help" 
                          className="flex items-center px-4 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700" 
                          onClick={() => setShowUserMenu(false)}
                        >
                          <HelpCircle className="w-4 h-4 mr-2" />
                          도움말
                        </Link>
                        <button 
                          onClick={() => { handleLogout(); setShowUserMenu(false); }} 
                          className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          로그아웃
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
                        <p className="text-sm font-semibold">로그인이 필요합니다</p>
                      </div>
                      <div className="py-1">
                        <Link 
                          to="/auth" 
                          className="flex items-center px-4 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700" 
                          onClick={() => setShowUserMenu(false)}
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          로그인
                        </Link>
                        <Link 
                          to="/auth?mode=register" 
                          className="flex items-center px-4 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700" 
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          회원가입
                        </Link>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
