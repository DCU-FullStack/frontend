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
  User,
  LayoutGrid,
  ExternalLink,
  BarChart3,
  Video,
  Activity,
  CheckCircle2,
  MonitorCheck,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/dashboard")) {
      setActiveTab("overview");
      setSidebarOpen(false);
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

  const handleMenuClick = (tab: string) => {
    if (tab !== "overview" && !user) {
      navigate("/auth");
      return;
    }

    setActiveTab(tab);
    
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
      case "related":
        navigate("/related-sites");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-blue-100 dark:bg-gray-900">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ y: -1000, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -1000, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 w-full h-full bg-blue-100 dark:bg-gray-900 backdrop-blur-md"
          >
            <div className="flex flex-col h-full max-w-screen-xl mx-auto">
              {/* 상단 영역 */}
              <br></br><br></br>
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center justify-center w-16 h-16">
                    <button onClick={() => navigate('/animation-demo')} className="focus:outline-none">
                      <img 
                        src="/hoom.png"
                        alt="홈"
                        style={{ width: '60px', height: '42px' }}
                      />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-sky-400">AI 도로 시스템</h2>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* 검색 */}
                  <div className="flex justify-end w-full max-w-xl">
                    <div className="relative w-full">
                      <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        placeholder="검색..."
                        className="sm:w-64 w-64 py-2 pl-10 pr-4 transition-all bg-gray-100 border border-gray-200 rounded-full dark:bg-dark-700 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 shadow-md hover:shadow-lg focus:shadow-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* 다크모드 토글 */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={toggleTheme}
                          className="p-2 transition-all duration-300 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:scale-110"
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
                            <button className="relative p-2 transition-all duration-300 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:scale-105">
                              <Bell className="w-5 h-5" />
                              {notifications > 0 && (
                                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-purple-500 rounded-full -top-1 -right-1">
                                  {notifications}
                                </span>
                              )}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white w-80 dark:bg-gray-800">
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
                      <Button variant="ghost" size="icon" className="transition-all duration-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:scale-105">
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
                          className="text-red-500 hover:text-red-600 transition-all duration-300 hover:scale-105 hover:bg-red-500/10 dark:hover:bg-red-500/20"
                          onClick={() => logoutMutation.mutate()}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          로그아웃
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          className="text-green-500 hover:text-green-600 transition-all duration-300 hover:scale-105 hover:bg-green-500/10 dark:hover:bg-green-500/20"
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

              {/* 메뉴 그리드 */}
              <br></br>
              <br></br>
              <br></br>
              <div className="flex-1 p-8">
                <div className="grid max-w-6xl gap-8 mx-auto">
                  <div className="grid grid-cols-4 gap-8 mt-4">
                    <div>
                      <Button 
                        variant="ghost" 
                        className={`w-full h-48 flex flex-col items-center justify-center space-y-6 rounded-3xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md hover:bg-gradient-to-br hover:from-white/90 hover:to-indigo-50/90 dark:hover:from-gray-800/90 dark:hover:to-indigo-900/40 group ${
                          activeTab === "overview" 
                          ? "border-purple-500 bg-gradient-to-br from-white to-purple-50 dark:from-purple-900/20 dark:to-purple-900/40 shadow-lg" 
                          : "border-gray-300 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 bg-white dark:bg-gray-800"
                        }`}
                        onClick={() => handleMenuClick("overview")}
                      >
                        <img 
                          src="/home.gif"
                          alt="홈"
                          style={{ width: '40px', height: '40px' }}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                        <span className="text-2xl font-medium">홈</span>
                      </Button>
                    </div>

                    <div>
                      <Button 
                        variant="ghost" 
                        className={`w-full h-48 flex flex-col items-center justify-center space-y-6 rounded-3xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md hover:bg-gradient-to-br hover:from-white/90 hover:to-indigo-50/90 dark:hover:from-gray-800/90 dark:hover:to-indigo-900/40 group ${
                          activeTab === "incidents" 
                          ? "border-purple-500 bg-gradient-to-br from-white to-purple-50 dark:from-purple-900/20 dark:to-purple-900/40 shadow-lg" 
                          : "border-gray-300 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 bg-white dark:bg-gray-800"
                        }`}
                        onClick={() => handleMenuClick("incidents")}
                      >
                        <AlertTriangle 
                          style={{ width: '40px', height: '40px' }}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                        <span className="text-2xl font-medium">사고 관리</span>
                      </Button>
                    </div>
                        
                    <div>
                      <Button 
                        variant="ghost" 
                        className={`w-full h-48 flex flex-col items-center justify-center space-y-6 rounded-3xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md hover:bg-gradient-to-br hover:from-white/90 hover:to-indigo-50/90 dark:hover:from-gray-800/90 dark:hover:to-indigo-900/40 group ${
                          activeTab === "tasks" 
                          ? "border-purple-500 bg-gradient-to-br from-white to-purple-50 dark:from-purple-900/20 dark:to-purple-900/40 shadow-lg" 
                          : "border-gray-300 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 bg-white dark:bg-gray-800"
                        }`}
                        onClick={() => handleMenuClick("tasks")}
                      >
                        
                        <img 
                          src="/list.gif"
                          alt="작업 관리"
                          style={{ width: '40px', height: '40px' }}
                        />
                        <span className="text-2xl font-medium">작업 관리</span>
                      </Button>
                    </div>

                    <div>
                      <Button 
                        variant="ghost" 
                        className={`w-full h-48 flex flex-col items-center justify-center space-y-6 rounded-3xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md hover:bg-gradient-to-br hover:from-white/90 hover:to-indigo-50/90 dark:hover:from-gray-800/90 dark:hover:to-indigo-900/40 group ${
                          activeTab === "cctv" 
                          ? "border-purple-500 bg-gradient-to-br from-white to-purple-50 dark:from-purple-900/20 dark:to-purple-900/40 shadow-lg" 
                          : "border-gray-300 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 bg-white dark:bg-gray-800"
                        }`}
                        onClick={() => handleMenuClick("cctv")}
                      >
                        <div className="relative">
                          <img 
                            src="/cctv.png"
                            alt="마이페이지"
                            style={{ width: '70px', height: '70px' }}
                            className="transition-all duration-300 group-hover:opacity-0 [animation-play-state:paused]"
                          />
                          <img 
                            src="/cctv.gif"
                            alt="마이페이지"
                            style={{ width: '70px', height: '70px' }}
                            className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                        </div>
                        <span className="text-2xl font-medium">CCTV 모니터링</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-8 mt-4">
                    <div>
                      <Button 
                        variant="ghost" 
                        className={`w-full h-48 flex flex-col items-center justify-center space-y-6 rounded-3xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md hover:bg-gradient-to-br hover:from-white/90 hover:to-indigo-50/90 dark:hover:from-gray-800/90 dark:hover:to-indigo-900/40 group ${
                          activeTab === "analytics" 
                          ? "border-purple-500 bg-gradient-to-br from-white to-purple-50 dark:from-purple-900/20 dark:to-purple-900/40 shadow-lg" 
                          : "border-gray-300 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 bg-white dark:bg-gray-800"
                        }`}
                        onClick={() => handleMenuClick("analytics")}
                      >
                        <img 
                          src="/data.gif"
                          alt="데이터 분석"
                          style={{ width: '70px', height: '70px' }}
                        />
                        <span className="text-2xl font-medium">데이터 분석</span>
                      </Button>
                    </div>

                    <div>
                      <Button 
                        variant="ghost" 
                        className={`w-full h-48 flex flex-col items-center justify-center space-y-6 rounded-3xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md hover:bg-gradient-to-br hover:from-white/90 hover:to-indigo-50/90 dark:hover:from-gray-800/90 dark:hover:to-indigo-900/40 group ${
                          activeTab === "settings" 
                          ? "border-purple-500 bg-gradient-to-br from-white to-purple-50 dark:from-purple-900/20 dark:to-purple-900/40 shadow-lg" 
                          : "border-gray-300 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 bg-white dark:bg-gray-800"
                        }`}
                        onClick={() => handleMenuClick("settings")}
                      >
                        <div className="relative">
                          <img 
                            src="/mypage.png"
                            alt="마이페이지"
                            style={{ width: '70px', height: '70px' }}
                            className="transition-all duration-300 group-hover:opacity-0 [animation-play-state:paused]"
                          />
                          <img 
                            src="/mypage.gif"
                            alt="마이페이지"
                            style={{ width: '70px', height: '70px' }}
                            className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                        </div>
                        <span className="text-2xl font-medium">마이페이지</span>
                      </Button>
                    </div>

                    <div>
                      <Button 
                        variant="ghost" 
                        className={`w-full h-48 flex flex-col items-center justify-center space-y-6 rounded-3xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md hover:bg-gradient-to-br hover:from-white/90 hover:to-indigo-50/90 dark:hover:from-gray-800/90 dark:hover:to-indigo-900/40 group ${
                          activeTab === "help" 
                          ? "border-purple-500 bg-gradient-to-br from-white to-purple-50 dark:from-purple-900/20 dark:to-purple-900/40 shadow-lg" 
                          : "border-gray-300 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 bg-white dark:bg-gray-800"
                        }`}
                        onClick={() => handleMenuClick("help")}
                      >
                        <div className="relative">
                          <img 
                            src="/help.png"
                            alt="도움말"
                            style={{ width: '70px', height: '70px' }}
                            className="transition-all duration-300 group-hover:opacity-0"
                          />
                          <img 
                            src="/help.gif"
                            alt="도움말"
                            style={{ width: '70px', height: '70px' }}
                            className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                        </div>
                        <span className="text-2xl font-medium">도움말</span>
                      </Button>
                    </div>

                    <div>
                      <Button 
                        variant="ghost" 
                        className={`w-full h-48 flex flex-col items-center justify-center space-y-6 rounded-3xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md hover:bg-gradient-to-br hover:from-white/90 hover:to-indigo-50/90 dark:hover:from-gray-800/90 dark:hover:to-indigo-900/40 group ${
                          activeTab === "related" 
                          ? "border-purple-500 bg-gradient-to-br from-white to-purple-50 dark:from-purple-900/20 dark:to-purple-900/40 shadow-lg" 
                          : "border-gray-300 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 bg-white dark:bg-gray-800"
                        }`}
                        onClick={() => handleMenuClick("related")}
                      >
                        <div className="relative">
                                                <img 
                            src="/site.png"
                            alt="연관사이트"
                            style={{ width: '70px', height: '70px' }}
                            className="transition-all duration-300 group-hover:opacity-0 "
                          />
                          <img 
                            src="/site.gif"
                            alt="연관사이트"
                            style={{ width: '70px', height: '70px' }}
                            className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300 "
                          />
                        </div>
                        <span className="text-2xl font-medium">연관사이트</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>{/* 메뉴 그리드 */}

              {/* 하단 유저 정보 */}
              <div className="absolute bottom-0 left-0 w-full p-3 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8 border-2 border-indigo-500">
                    <AvatarImage src="https://github.com/shadcn.png" alt={user?.name || "사용자"} />
                    <AvatarFallback className="text-white bg-gradient-to-br from-indigo-500 to-purple-600">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate dark:text-sky-400">{user?.name || "로그인이 필요합니다"}</div>
                    <div className="text-xs text-gray-500 truncate dark:text-sky-300">{user?.email || ""}</div>
                  </div>
                  {user ? (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 hover:text-red-600 transition-all duration-300 hover:scale-105 hover:bg-red-500/10 dark:hover:bg-red-500/20"
                      onClick={e => { e.stopPropagation(); logoutMutation.mutate(); }}
                      title="로그아웃"
                    >
                      <LogOut  style={{ width: '30px', height: '30px' }}
                      className="text-red-400 dark:text-indigo-400"/>
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-green-500 hover:text-green-600 transition-all duration-300 hover:scale-105 hover:bg-green-500/10 dark:hover:bg-green-500/20"
                      onClick={e => { e.stopPropagation(); navigate("/auth"); }}
                      title="로그인"
                    >
                      <LogIn 
                      style={{ width: '30px', height: '30px' }}
                      className="text-indigo-600 dark:text-indigo-400"
                      />
                    </Button>
                  )}
                </div>
              </div>{/* 하단 유저 정보 */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col flex-1 overflow-hidden bg-blue-100 bg-gradient-to-br dark:bg-gray-900 dark:to-neutral-900">
        {/* 메뉴 버튼 */}
        <button 
          onClick={toggleSidebar}
          className="fixed z-50 p-0 m-0 bg-transparent border-none outline-none top-4 left-4"
          style={{ width: 40, height: 40 }}
          aria-label="메뉴 열기/닫기"
        >
          <div className="relative flex flex-col items-center justify-center w-8 h-8">
            <span className={`block absolute h-0.5 w-8 bg-black dark:bg-white transition-all duration-300 ${sidebarOpen ? 'rotate-45 top-4' : 'top-2'}`}></span>
            <span className={`block absolute h-0.5 w-8 bg-black dark:bg-white transition-all duration-300 ${sidebarOpen ? 'opacity-0' : 'top-4'}`}></span>
            <span className={`block absolute h-0.5 w-8 bg-black dark:bg-white transition-all duration-300 ${sidebarOpen ? '-rotate-45 top-4' : 'top-6'}`}></span>
          </div>
        </button>

        <main className="flex-1 overflow-y-auto bg-blue-100 bg-gradient-to-br dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
} 