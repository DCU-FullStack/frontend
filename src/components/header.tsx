import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./search-bar";
import { useAuth } from "@/hooks/use-auth";

type PageTitles = {
  [key: string]: string;
};

const pageTitles: PageTitles = {
  "/cctv": "CCTV 감시",
  "/incidents": "이상 보고",
  "/tasks": "작업 현황",
  "/analytics": "데이터 분석",
  "/settings": "설정",
};

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutMutation } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pageTitle = pageTitles[location.pathname] || "";

  const handleLogout = async () => {
    try {
      // 로그아웃 시도
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // 성공 여부와 관계없이 로그인 페이지로 이동
      navigate("/auth");
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="text-gray-600 focus:outline-none mr-2 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative max-w-xl w-full mx-4 hidden md:block">
          <SearchBar />
        </div>
        
        {/* User Menu */}
        <div className="flex items-center">
          
          {user && (
            <div className="ml-3 relative">
              <div>
                <button 
                  type="button" 
                  className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white border border-gray-300"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="sr-only">사용자 메뉴 열기</span>
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="font-medium text-sm">
                      {user?.name?.[0] || user?.username?.[0] || "U"}
                    </span>
                  </div>
                </button>
              </div>
              
              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{user?.name || user?.username}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
