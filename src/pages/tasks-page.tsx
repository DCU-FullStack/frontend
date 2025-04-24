import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Task } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, Filter, ClipboardList } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StatusBadgeProps = {
  status: string;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let variant: "outline" | "secondary" | "destructive" | "default" = "outline";
  
  switch (status) {
    case "계획됨":
      variant = "secondary";
      break;
    case "진행 중":
      variant = "default";
      break;
    case "완료됨":
      variant = "outline";
      break;
    case "긴급":
      variant = "destructive";
      break;
  }
  
  return <Badge variant={variant}>{status}</Badge>;
};

export default function TasksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { data: tasks, isLoading, error } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    queryFn: async () => {
      // Return empty array for now
      return [];
    }
  });

  // Filter tasks based on search query and status
  const filteredTasks = tasks?.filter((task: Task) => {
    const matchesSearch = 
      searchQuery === "" || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      task.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === null || task.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      
      <main className="flex-1 overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />
        
        <div className="px-4 py-8">
          <div className="mb-8">
            <h1 className="flex items-center text-2xl font-bold text-gray-800">
              <ClipboardList className="w-6 h-6 mr-2 text-primary" />
              작업 현황
            </h1>
            <p className="text-gray-600">도로 작업 현황 관리</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center w-full max-w-2xl gap-2 mx-auto">
              <div className="relative flex-1">
                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <Input
                  className="w-full bg-gray-100 border-gray-200 rounded-full shadow-inner pl-9 h-9 focus:shadow-none"
                  placeholder="제목, 설명 또는 위치로 검색"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={selectedStatus || undefined}
                onValueChange={(value: "접수" | "처리중" | "해결됨" | "all") => 
                  setSelectedStatus(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-[140px] rounded-full bg-gray-100/100 border-gray-200 shadow-inner focus:shadow-none h-9 px-4">
                  <div className="flex items-center gap-2">
                    <Filter className="flex-shrink-0 w-4 h-4 text-gray-400" />
                    <SelectValue className="text-sm" placeholder="전체" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-gray-100 border-gray-200 rounded-lg">
                  <SelectItem value="all" className="text-sm rounded-md focus:bg-gray-200">전체</SelectItem>
                  <SelectItem value="진행 전" className="text-sm rounded-md focus:bg-gray-200">진행 전</SelectItem>
                  <SelectItem value="진행 중" className="text-sm rounded-md focus:bg-gray-200">진행 중</SelectItem>
                  <SelectItem value="완료 됨" className="text-sm rounded-md focus:bg-gray-200">완료 됨</SelectItem>
                </SelectContent>
              </Select>
              
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="py-8 text-center">로딩 중...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">
                데이터를 불러오는 중 오류가 발생했습니다.
              </div>
            ) : filteredTasks?.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                검색 결과가 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks?.map(task => (
                  <div
                    key={task.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">{task.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{task.location}</p>
                      </div>
                      <StatusBadge status={task.status} />
                    </div>
                    {task.description && (
                      <p className="mt-2 text-sm text-gray-600">{task.description}</p>
                    )}
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        자세히 보기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
