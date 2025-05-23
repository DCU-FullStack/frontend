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
import { SearchBar } from "@/components/search-bar";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title = "대시보드" }: LayoutProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(3);
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
    } else if (path.includes("/settings")) {
      setActiveTab("settings");
    } else if (path.includes("/help")) {
      setActiveTab("help");
    }
  }, [location]);

  useEffect(() => {
    const handlerCCTV = () => handleMenuClick('cctv');
    const handlerIncidents = () => handleMenuClick('incidents');
    const handlerTasks = () => handleMenuClick('tasks');
    window.addEventListener('go-cctv-menu', handlerCCTV);
    window.addEventListener('go-incidents-menu', handlerIncidents);
    window.addEventListener('go-tasks-menu', handlerTasks);
    return () => {
      window.removeEventListener('go-cctv-menu', handlerCCTV);
      window.removeEventListener('go-incidents-menu', handlerIncidents);
      window.removeEventListener('go-tasks-menu', handlerTasks);
    };
  }, []);

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
      case "help":
        navigate("/help");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 메인 콘텐츠 */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 헤더 */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
          <div className="container flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center">
                <button onClick={() => navigate('/animation-demo')} className="transition-transform focus:outline-none hover:scale-105">
                  <img 
                    src="/car-loading.gif"
                    alt="홈"
                    className="w-10 h-10 md:w-12 md:h-12"
                  />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text md:text-2xl">AI 도로 시스템</h2>
              </div>
            </div>

            {/* 헤더 메뉴 */}
            <div className="items-center hidden space-x-3 md:flex">
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === "overview" 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20" 
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
                onClick={() => handleMenuClick("overview")}
              >
                <span>홈</span>
              </Button>
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === "incidents" 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20" 
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
                onClick={() => handleMenuClick("incidents")}
              >
                <span>사고 관리</span>
              </Button>
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === "tasks" 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20" 
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
                onClick={() => handleMenuClick("tasks")}
              >
                <span>작업 관리</span>
              </Button>
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === "cctv" 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20" 
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
                onClick={() => handleMenuClick("cctv")}
              >
                <span>CCTV</span>
              </Button>
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === "help" 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20" 
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
                onClick={() => handleMenuClick("help")}
              >
                <span>고객센터</span>
              </Button>
              
            </div>
            

            <div className="flex items-center gap-2">
              {/* 검색 */}
              <div className="relative hidden w-64 md:block">
                <SearchBar />
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

              {/* 사용자 메뉴 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                  <DropdownMenuLabel className="bg-white dark:bg-gray-900">내 계정</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                  <DropdownMenuItem onClick={() => navigate("/settings")} className="bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800">
                    <Settings className="w-4 h-4 mr-2" />
                    마이페이지
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                  {user ? (
                    <DropdownMenuItem 
                      className="text-red-500 bg-white hover:bg-red-50 dark:bg-gray-900 dark:hover:bg-red-900/20 hover:text-red-600"
                      onClick={() => logoutMutation.mutate()}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem 
                      className="text-blue-500 bg-white hover:bg-blue-50 dark:bg-gray-900 dark:hover:bg-blue-900/20 hover:text-blue-600"
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

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 