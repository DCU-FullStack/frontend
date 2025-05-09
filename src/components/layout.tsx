import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/contexts/theme-context";
import { 
  Home, 
  AlertTriangle, 
  Calendar, 
  Camera, 
  Settings, 
  LogOut, 
  LogIn,
  Search,
  Bell,
  Moon,
  Sun,
  User,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title = "대시보드" }: LayoutProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutMutation } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/dashboard")) {
      setActiveTab("overview");
    } else if (path.includes("/incidents")) {
      setActiveTab("incidents");
    } else if (path.includes("/tasks")) {
      setActiveTab("tasks");
    } else if (path.includes("/cctv")) {
      setActiveTab("cctv");
    } else if (path.includes("/analytics")) {
      setActiveTab("analytics");
    } else if (path.includes("/settings")) {
      setActiveTab("settings");
    }
  }, [location]);

  const handleMenuClick = (tab: string) => {
    if (tab !== "overview" && !user) {
      navigate("/auth");
      return;
    }

    setActiveTab(tab);
    
    switch (tab) {
      case "overview":
        navigate("/dashboard");
        break;
      case "incidents":
        navigate("/incidents");
        break;
      case "tasks":
        navigate("/tasks");
        break;
      case "cctv":
        navigate("/cctv");
        break;
      case "analytics":
        navigate("/analytics");
        break;
      case "settings":
        navigate("/settings");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* 메인 콘텐츠 */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 헤더 */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
          <div className="container flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center">
                <button onClick={() => navigate('/animation-demo')} className="transition-transform focus:outline-none hover:scale-105">
                  <img 
                    src="/hoom.png"
                    alt="홈"
                    className="w-10 h-7 md:w-12 md:h-8"
                  />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text md:text-2xl">AI 도로 시스템</h2>
              </div>
            </div>

            {/* 헤더 메뉴 */}
            <div className="items-center hidden space-x-1 md:flex">
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === "overview" 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleMenuClick("overview")}
              >
                <img 
                  src="/home.gif"
                  alt="홈"
                  className="w-5 h-5"
                />
                <span>홈</span>
              </Button>
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === "incidents" 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleMenuClick("incidents")}
              >
                <img 
                  src="/incident.gif"
                  alt="사고 관리"
                  className="w-5 h-5"
                />
                <span>사고 관리</span>
              </Button>
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === "tasks" 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleMenuClick("tasks")}
              >
                <img 
                  src="/list.gif"
                  alt="작업 관리"
                  className="w-5 h-5"
                />
                <span>작업 관리</span>
              </Button>
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === "cctv" 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleMenuClick("cctv")}
              >
                <img 
                  src="/cctv.gif"
                  alt="CCTV"
                  className="w-5 h-5"
                />
                <span>CCTV</span>
              </Button>
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === "analytics" 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleMenuClick("analytics")}
              >
                <img 
                  src="/data.gif"
                  alt="데이터 분석"
                  className="w-5 h-5"
                />
                <span>데이터 분석</span>
              </Button>
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === "settings" 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleMenuClick("settings")}
              >
                <img 
                  src="/mypage.gif"
                  alt="설정"
                  className="w-5 h-5"
                />
                <span>설정</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* 검색 */}
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="검색..."
                  className="w-48 px-3 py-1 text-sm border border-gray-200 rounded-lg h-9 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-2 top-1/2" />
              </div>

              {/* 다크모드 토글 */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={toggleTheme}
                      className="p-2 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label="다크모드 전환"
                    >
                      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>다크모드 {theme === "dark" ? "끄기" : "켜기"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* 알림 */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="relative p-2 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                          <Bell className="w-5 h-5" />
                          {notifications > 0 && (
                            <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-blue-500 rounded-full -top-1 -right-1">
                              {notifications}
                            </span>
                          )}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel className="flex items-center justify-between">
                          <span>알림</span>
                          {notifications > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setNotifications(0)}
                            >
                              모두 읽음
                            </Button>
                          )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <ScrollArea className="h-80">
                          {notifications > 0 ? (
                            <>
                              <DropdownMenuItem>
                                <div className="flex items-start space-x-3">
                                  <AlertTriangle className="w-5 h-5 text-red-500" />
                                  <div>
                                    <p className="font-medium">새로운 사고 발생</p>
                                    <p className="text-sm text-gray-500">서울시 강남구에서 도로 파손이 발생했습니다.</p>
                                    <p className="text-xs text-gray-400">5분 전</p>
                                  </div>
                                </div>
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              새로운 알림이 없습니다
                            </div>
                          )}
                        </ScrollArea>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>알림</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* 사용자 메뉴 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="w-4 h-4 mr-2" />
                    마이페이지
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user ? (
                    <DropdownMenuItem 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => logoutMutation.mutate()}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem 
                      className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => navigate("/auth")}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      로그인
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
} 