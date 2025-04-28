import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/contexts/theme-context";
import { 
  Menu, 
  X, 
  Home, 
  AlertTriangle, 
  Calendar, 
  Camera, 
  PieChart, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut, 
  LogIn,
  Search,
  Bell,
  Moon,
  Sun,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title = "대시보드" }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutMutation } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // 현재 경로에 따라 활성 탭 설정
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/dashboard")) {
      setActiveTab("overview");
      // 대시보드 페이지에서는 사이드바를 열어둠
      setSidebarOpen(true);
    } else if (path.includes("/incidents")) {
      setActiveTab("incidents");
      setSidebarOpen(false);
    } else if (path.includes("/tasks")) {
      setActiveTab("tasks");
      setSidebarOpen(false);
    } else if (path.includes("/cctv")) {
      setActiveTab("cctv");
      setSidebarOpen(false);
    } else if (path.includes("/analytics")) {
      setActiveTab("analytics");
      setSidebarOpen(false);
    } else if (path.includes("/users")) {
      setActiveTab("users");
      setSidebarOpen(false);
    } else if (path.includes("/settings")) {
      setActiveTab("settings");
      setSidebarOpen(false);
    } else if (path.includes("/help")) {
      setActiveTab("help");
      setSidebarOpen(false);
    }
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 메뉴 클릭 핸들러
  const handleMenuClick = (tab: string) => {
    // 대시보드가 아닌 다른 페이지로 이동할 때 로그인 상태 확인
    if (tab !== "overview" && !user) {
      navigate("/auth");
      return;
    }

    setActiveTab(tab);
    
    // 대시보드를 제외한 나머지 페이지로 이동할 때 사이드바를 닫음
    if (tab !== "overview") {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
    
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
      case "users":
        navigate("/users");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "help":
        navigate("/help");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-900">
      {/* 사이드바 */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="z-10 border-r border-gray-200 shadow-xl w-72 bg-white/80 dark:bg-dark-800 backdrop-blur-md dark:border-dark-700"
          >
            <div className="flex flex-col h-full">
              {/* 로고 및 사용자 정보 */}
              <div className="p-6 border-b border-gray-200 dark:border-dark-700">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 shadow-lg rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                    <Home className="text-white w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">스마트 도로</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">이상감지 시스템</p>
                  </div>
                </div>
              </div>

              {/* 사용자 프로필 */}
              <div className="p-4 border-b border-gray-200 dark:border-dark-700">
                <div className="flex items-center p-3 space-x-4 rounded-xl bg-gray-50 dark:bg-dark-800/50">
                  <Avatar className="w-12 h-12 border-2 border-indigo-500">
                    <AvatarImage src="https://github.com/shadcn.png" alt={user?.name || "사용자"} />
                    <AvatarFallback className="text-white bg-gradient-to-br from-indigo-500 to-purple-600">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white">{user?.name || "사용자"}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || "user@example.com"}</p>
                  </div>
                </div>
              </div>

              {/* 검색 */}
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <Input 
                    placeholder="검색..." 
                    className="pl-10 border-gray-200 bg-gray-50 dark:bg-dark-700 dark:border-dark-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
             
              {/* 메뉴 */}
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={activeTab === "overview" ? "default" : "ghost"} 
                          className={`w-full justify-start mb-1 ${activeTab === "overview" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : ""}`}
                          onClick={() => handleMenuClick("overview")}
                        >
                          <Home className="w-4 h-4 mr-3" />
                          대시보드
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>대시보드 개요</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={activeTab === "incidents" ? "default" : "ghost"} 
                          className={`w-full justify-start mb-1 ${activeTab === "incidents" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : ""}`}
                          onClick={() => handleMenuClick("incidents")}
                        >
                          <AlertTriangle className="w-4 h-4 mr-3" />
                          사고 관리
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>사고 관리 및 모니터링</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={activeTab === "tasks" ? "default" : "ghost"} 
                          className={`w-full justify-start mb-1 ${activeTab === "tasks" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : ""}`}
                          onClick={() => handleMenuClick("tasks")}
                        >
                          <Calendar className="w-4 h-4 mr-3" />
                          작업 관리
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>작업 일정 및 할당</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={activeTab === "cctv" ? "default" : "ghost"} 
                          className={`w-full justify-start mb-1 ${activeTab === "cctv" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : ""}`}
                          onClick={() => handleMenuClick("cctv")}
                        >
                          <Camera className="w-4 h-4 mr-3" />
                          CCTV 모니터링
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>CCTV 실시간 모니터링</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={activeTab === "analytics" ? "default" : "ghost"} 
                          className={`w-full justify-start mb-1 ${activeTab === "analytics" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : ""}`}
                          onClick={() => handleMenuClick("analytics")}
                        >
                          <PieChart className="w-4 h-4 mr-3" />
                          데이터 분석
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>데이터 분석 및 보고서</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipContent side="right">
                        <p>사용자 계정 관리</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={activeTab === "settings" ? "default" : "ghost"} 
                          className={`w-full justify-start mb-1 ${activeTab === "settings" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : ""}`}
                          onClick={() => handleMenuClick("settings")}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          마이페이지
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>시스템 설정</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={activeTab === "help" ? "default" : "ghost"} 
                          className={`w-full justify-start mb-1 ${activeTab === "help" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : ""}`}
                          onClick={() => handleMenuClick("help")}
                        >
                          <HelpCircle className="w-4 h-4 mr-3" />
                          도움말
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>도움말 및 지원</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </ScrollArea>

              {/* 로그아웃 버튼 */}
              <div className="p-4 border-t border-gray-200 dark:border-dark-700">
                {user ? (
                  <Button 
                    variant="ghost" 
                    className="justify-start w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    로그아웃
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    className="justify-start w-full text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    onClick={() => navigate("/auth")}
                  >
                    <LogIn className="w-4 h-4 mr-3" />
                    로그인
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 상단 헤더 */}
        <div className="bg-white border-b border-gray-200 shadow-sm dark:bg-dark-800 dark:border-dark-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleSidebar}
                className="p-1 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 검색 */}
              <div className="relative hidden md:block">
                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="검색..."
                  className="w-64 py-2 pl-10 pr-4 transition-all bg-gray-100 border border-gray-200 rounded-full dark:bg-dark-700 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* 다크모드 토글 */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={toggleTheme}
                      className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
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
              <div className="relative">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="relative p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
                          >
                            <Bell className="w-5 h-5" />
                            {notifications > 0 && (
                              <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                                {notifications}
                              </span>
                            )}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg w-80 dark:bg-dark-800 dark:border-dark-700">
                          <DropdownMenuLabel className="flex items-center justify-between">
                            <span>알림</span>
                            {notifications > 0 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-xs text-primary-500 hover:text-primary-600"
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
                                <DropdownMenuItem className="flex flex-col items-start py-3 cursor-default">
                                  <div className="flex items-center w-full">
                                    <div className="flex items-center justify-center w-8 h-8 mr-3 bg-red-100 rounded-full dark:bg-red-900/30">
                                      <AlertTriangle className="w-4 h-4 text-red-500" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">새로운 사고 발생</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">서울시 강남구에서 도로 파손이 발생했습니다.</p>
                                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">5분 전</p>
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex flex-col items-start py-3 cursor-default">
                                  <div className="flex items-center w-full">
                                    <div className="flex items-center justify-center w-8 h-8 mr-3 bg-blue-100 rounded-full dark:bg-blue-900/30">
                                      <Calendar className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">작업 할당</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">신호등 점검 작업이 할당되었습니다.</p>
                                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">1시간 전</p>
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex flex-col items-start py-3 cursor-default">
                                  <div className="flex items-center w-full">
                                    <div className="flex items-center justify-center w-8 h-8 mr-3 bg-green-100 rounded-full dark:bg-green-900/30">
                                      <Camera className="w-4 h-4 text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">CCTV 오프라인</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">강남구 CCTV #3이 오프라인 상태입니다.</p>
                                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">3시간 전</p>
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Bell className="w-12 h-12 mb-2 text-gray-300 dark:text-gray-600" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">새로운 알림이 없습니다</p>
                              </div>
                            )}
                          </ScrollArea>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-center text-primary-500 hover:text-primary-600"
                            onClick={() => navigate("/notifications")}
                          >
                            모든 알림 보기
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>알림</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg dark:bg-dark-800 dark:border-dark-700">
                  <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="w-4 h-4 mr-2" />
                    마이페이지
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user ? (
                    <DropdownMenuItem 
                      className="text-red-500 focus:text-red-500"
                      onClick={() => logoutMutation.mutate()}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem 
                      className="text-green-500 focus:text-green-500"
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
        </div>
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-dark-900">
          {children}
        </main>
      </div>
    </div>
  );
} 