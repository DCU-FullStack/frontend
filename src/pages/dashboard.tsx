import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { RoadStatusCard } from "@/components/road-status-card";
import { IncidentsCard } from "@/components/incidents-card";
import { CCTVCard } from "@/components/cctv-card";
import { TasksTable } from "@/components/tasks-table";
import { TrafficChart } from "@/components/traffic-chart";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [_, navigate] = useLocation();

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
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
          <img 
  src="https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  alt="도시 야경 고속도로" 
  className="absolute w-full h-full object-cover"
/>
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            {/* Search Overlay */}
            <div className="z-10 w-full max-w-2xl px-4">
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-5 w-5 text-gray-400" />
                  <input 
                    type="search" 
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg"
                    placeholder="검색을 원하시나요?"
                  />
                </div>
              </div>
              
              {/* Quick Action Buttons */}
              <div className="flex mt-4 justify-center space-x-10">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 rounded-full"
                  onClick={() => navigate('/cctv')}
                >
                  CCTV 검색
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 rounded-full"
                  onClick={() => navigate('/incidents')}
                >
                  이상 보고
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 rounded-full"
                  onClick={() => navigate('/tasks')}
                >
                  작업 목록
                </Button>
              </div>
            </div>
          </div>
          
          {/* Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RoadStatusCard />
            <IncidentsCard />
            <CCTVCard />
            <TasksTable />
            <TrafficChart />
          </div>
        </div>
      </main>
    </div>
  );
}
