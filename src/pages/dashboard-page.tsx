import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { RoadStatusCard } from "@/components/road-status-card";
import { IncidentsCard } from "@/components/incidents-card";
import { CCTVCard } from "@/components/cctv-card";
import { TasksTable } from "@/components/tasks-table";
import { TrafficChart } from "@/components/traffic-chart";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {sidebarOpen && <Sidebar />}
      
      <main className="flex-1 overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />
        
        <div className="px-4 py-6">
          {/* Hero Banner */}
          <div className="relative flex items-center justify-center w-full h-64 mb-6 overflow-hidden md:h-96 rounded-xl">
            <img 
              src="https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="도시 야경 고속도로" 
              className="absolute object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            {/* Search Overlay */}
            <div className="z-10 w-full max-w-2xl px-4">
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute w-5 h-5 text-gray-400 left-3" />
                  <input 
                    type="search" 
                    className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="검색을 원하시나요?"
                  />
                </div>
              </div>
              
              {/* Quick Action Buttons */}
              <div className="flex gap-4 mt-4 justify-center">
                <Button 
                  className="bg-white rounded-full hover:bg-gray-500"
                  onClick={() => navigate('/cctv')}
                >
                  CCTV 감시
                </Button>
                <Button 
                  className="bg-white rounded-full hover:bg-gray-500"
                  onClick={() => navigate('/incidents')}
                >
                  이상 보고
                </Button>
                <Button 
                  className="bg-white rounded-full hover:bg-gray-500"
                  onClick={() => navigate('/tasks')}
                >
                  작업 현황
                </Button>
                <Button 
                  className="bg-white rounded-full hover:bg-gray-500"
                  onClick={() => navigate('/analytics')}
                >
                  데이터 분석
                </Button>
              </div>
            </div>
          </div>
          
          {/* Dashboard Content */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <RoadStatusCard />
            <IncidentsCard />
            <div className="col-span-1 md:col-span-1">
              <CCTVCard />
            </div>
            <div className="col-span-1 md:col-span-1">
              <TasksTable />
            </div>
            <div className="col-span-1 md:col-span-2">
              <TrafficChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 