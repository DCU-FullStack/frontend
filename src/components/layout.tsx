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

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title = "대시보드" }: LayoutProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
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
    } else if (path.includes("/help")) {
      setActiveTab("help");
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
      case "help":
        navigate("/help");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      // 사고 데이터 검색
      const incidentsResponse = await fetch('/api/incidents');
      const incidentsData = await incidentsResponse.json();
      const filteredIncidents = incidentsData.filter((incident: any) => 
        incident.title?.toLowerCase().includes(query.toLowerCase()) ||
        incident.location?.toLowerCase().includes(query.toLowerCase())
      ).map((incident: any) => ({
        type: 'incident',
        id: incident.id,
        title: incident.title,
        location: incident.location
      }));

      // 작업 데이터 검색
      const tasksResponse = await fetch('/api/tasks');
      const tasksData = await tasksResponse.json();
      const filteredTasks = tasksData.filter((task: any) => 
        task.title?.toLowerCase().includes(query.toLowerCase()) ||
        task.location?.toLowerCase().includes(query.toLowerCase())
      ).map((task: any) => ({
        type: 'task',
        id: task.id,
        title: task.title,
        location: task.location
      }));

      // CCTV 데이터 검색
      const cctvResponse = await fetch('/api/cameras');
      const cctvData = await cctvResponse.json();
      const filteredCCTV = cctvData.filter((camera: any) => 
        camera.name?.toLowerCase().includes(query.toLowerCase()) ||
        camera.location?.toLowerCase().includes(query.toLowerCase())
      ).map((camera: any) => ({
        type: 'camera',
        id: camera.id,
        title: camera.name,
        location: camera.location
      }));

      // 모든 검색 결과 합치기
      const allResults = [...filteredIncidents, ...filteredTasks, ...filteredCCTV];
      setSearchResults(allResults);
      setIsSearching(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const handleResultClick = (type: string, id: number) => {
    setIsSearching(false);
    setSearchQuery("");
    switch (type) {
      case "incident":
        navigate(`/incidents?id=${id}`);
        break;
      case "task":
        navigate(`/tasks?id=${id}`);
        break;
      case "camera":
        navigate(`/cctv?id=${id}`);
        break;
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
                    className="w-10 h-7 md:w-12 md:h-8"
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
              <div className="relative hidden md:block">
                <div className="flex items-center w-64 px-3 py-1 text-sm border border-gray-200 rounded-full h-9 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400">
                  <input
                    type="text"
                    placeholder="검색..."
                    className="w-full bg-transparent border-none focus:outline-none dark:text-white"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <Search className="w-4 h-4 text-gray-400" />
                </div>

                {/* 검색 결과 드롭다운 */}
                {isSearching && searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 overflow-y-auto bg-white rounded-md shadow-lg max-h-80 dark:bg-gray-800">
                    {searchResults.map((result) => (
                      <div
                        key={`${result.type}-${result.id}`}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => handleResultClick(result.type, result.id)}
                      >
                        <div className="flex items-center space-x-2">
                          {result.type === 'incident' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          {result.type === 'task' && <Calendar className="w-4 h-4 text-blue-500" />}
                          {result.type === 'camera' && <Camera className="w-4 h-4 text-green-500" />}
                          <div>
                            <p className="text-sm font-medium dark:text-white">{result.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{result.location}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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