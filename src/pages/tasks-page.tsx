import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Task } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

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

function formatDateDisplay(date: Date | undefined) {
  if (!date) return "";
  return format(date, 'PPP', { locale: ko });
}

export default function TasksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Form state for creating a new task
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    location: "",
    status: "계획됨",
    assignedTo: 1,
    dueDate: undefined as Date | undefined
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { data: tasks, isLoading, error } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/tasks");
      return await res.json();
    }
  });

  // Mutation for creating a new task
  const createTaskMutation = useMutation({
    mutationFn: async (task: typeof newTask) => {
      const res = await apiRequest("POST", "/api/tasks", task);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "작업 생성 완료",
        description: "새로운 작업이 생성되었습니다.",
      });
      navigate(`/tasks/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "작업 생성 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter tasks based on search query and filter option
  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = 
      searchQuery === "" || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      task.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "completed") return matchesSearch && task.status === "완료됨";
    if (filter === "urgent") return matchesSearch && task.status === "긴급";
    if (filter === "in-progress") return matchesSearch && task.status === "진행 중";
    if (filter === "planned") return matchesSearch && task.status === "계획됨";
    return true;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setNewTask(prev => ({ ...prev, dueDate: date }));
  };

  const resetForm = () => {
    setNewTask({
      title: "",
      description: "",
      location: "",
      status: "계획됨",
      assignedTo: 1,
      dueDate: undefined
    });
    setSelectedDate(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate(newTask);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {sidebarOpen && <Sidebar />}
      
      <main className="flex-1 overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />
        
        <div className="px-4 py-6">
          <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
            <div>
              <h1 className="flex items-center text-2xl font-bold text-gray-800">
                <ClipboardList className="w-6 h-6 mr-2 text-primary" />
                작업 목록
              </h1>
              <p className="text-gray-600">도로 유지보수 및 관리 작업을 확인하세요.</p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  새 작업 생성
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>새 작업 생성</DialogTitle>
                  <DialogDescription>
                    도로 유지보수 및 관리 작업 정보를 입력하세요.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">제목</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        placeholder="작업 제목"
                        value={newTask.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">설명</Label>
                      <Textarea 
                        id="description" 
                        name="description"
                        placeholder="작업에 대한 자세한 설명"
                        value={newTask.description || ""}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">위치</Label>
                      <Input 
                        id="location" 
                        name="location"
                        placeholder="작업 위치 (예: 서울외곽순환고속도로 23KM)"
                        value={newTask.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="status">상태</Label>
                        <Select
                          value={newTask.status}
                          onValueChange={(value) => handleSelectChange("status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="상태 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="계획됨">계획됨</SelectItem>
                            <SelectItem value="진행 중">진행 중</SelectItem>
                            <SelectItem value="완료됨">완료됨</SelectItem>
                            <SelectItem value="긴급">긴급</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>마감일</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="justify-start font-normal text-left"
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {selectedDate ? formatDateDisplay(selectedDate) : "날짜 선택"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={handleDateChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      취소
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createTaskMutation.isPending}
                    >
                      {createTaskMutation.isPending ? "생성 중..." : "생성"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <Input
                    className="pl-10"
                    placeholder="제목, 설명 또는 위치로 검색"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilter}>
                  <TabsList>
                    <TabsTrigger value="all">전체</TabsTrigger>
                    <TabsTrigger value="urgent">긴급</TabsTrigger>
                    <TabsTrigger value="in-progress">진행 중</TabsTrigger>
                    <TabsTrigger value="planned">계획됨</TabsTrigger>
                    <TabsTrigger value="completed">완료됨</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>작업 목록</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                </div>
              ) : error ? (
                <div className="py-8 text-center text-red-500">
                  데이터를 불러오는 중 오류가 발생했습니다.
                </div>
              ) : filteredTasks?.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  검색 결과가 없습니다.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>업무 설명</TableHead>
                      <TableHead>위치</TableHead>
                      <TableHead>담당자</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>마감일</TableHead>
                      <TableHead>조치</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks?.map(task => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground">{task.description}</div>
                        </TableCell>
                        <TableCell>{task.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center w-8 h-8 text-indigo-800 bg-indigo-100 rounded-full">
                            <span className="text-xs font-medium">
                              {task.assignedTo ? `ID: ${task.assignedTo}` : "미배정"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={task.status} />
                        </TableCell>
                        <TableCell>
                          {task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : "기한 없음"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">상세</Button>
                            <Button variant="outline" size="sm">수정</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
