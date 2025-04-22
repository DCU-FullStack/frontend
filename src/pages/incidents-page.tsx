import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
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
import { Search, Plus, Filter, AlertTriangle } from "lucide-react";
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

interface Incident {
  id: number;
  title: string;
  description: string;
  location: string;
  severity: "정보" | "경고" | "긴급";
  status: "접수" | "처리중" | "해결됨";
  createdAt: Date;
}

type SeverityBadgeProps = {
  severity: string;
};

const SeverityBadge = ({ severity }: SeverityBadgeProps) => {
  let variant: "outline" | "secondary" | "destructive" | "default" = "outline";
  
  switch (severity) {
    case "긴급":
      variant = "destructive";
      break;
    case "경고":
      variant = "default";
      break;
    case "정보":
      variant = "secondary";
      break;
  }
  
  return <Badge variant={variant}>{severity}</Badge>;
};

export default function IncidentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state for creating a new incident
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    location: "",
    severity: "정보",
    status: "접수"
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { data: incidents, isLoading, error } = useQuery<Incident[]>({
    queryKey: ["/api/incidents"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/incidents");
      return await res.json();
    }
  });

  // Mutation for creating a new incident
  const createIncidentMutation = useMutation({
    mutationFn: async (incident: typeof newIncident) => {
      try {
        const res = await apiRequest("POST", "/api/incidents", incident);
        return await res.json();
      } catch (error) {
        console.error("이상 보고 생성 오류:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/incidents"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "이상 보고 생성 완료",
        description: "새로운 이상 보고가 생성되었습니다.",
      });

      queryClient.setQueryData<Incident[]>(["/api/incidents"], (oldData) => {
        if (!oldData) return [data];
        return [...oldData, data];
      });
    },
    onError: (error: Error) => {
      toast({
        title: "이상 보고 생성 실패",
        description: error.message || "서버 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  // Filter incidents based on search query and filter option
  const filteredIncidents = incidents?.filter(incident => {
    const matchesSearch = 
      searchQuery === "" || 
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && incident.severity === filter;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewIncident(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewIncident(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setNewIncident({
      title: "",
      description: "",
      location: "",
      severity: "정보",
      status: "접수"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createIncidentMutation.mutate(newIncident);
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
                <AlertTriangle className="w-6 h-6 mr-2 text-amber-500" />
                이상 보고
              </h1>
              <p className="text-gray-600">도로 상의 이상 상황을 관리하세요.</p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  새 보고 작성
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px] py-8">
                <DialogHeader>
                  <DialogTitle>새로운 이상 보고 작성</DialogTitle>
                  <DialogDescription>
                    도로 상의 이상 상황에 대한 정보를 입력하세요.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">제목</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        placeholder="이상 상황 제목"
                        value={newIncident.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">설명</Label>
                      <Textarea 
                        id="description" 
                        name="description"
                        placeholder="이상 상황에 대한 자세한 설명"
                        value={newIncident.description}
                        onChange={handleInputChange}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">위치</Label>
                      <Input 
                        id="location" 
                        name="location"
                        placeholder="도로 구간 위치 (예: 서울외곽순환고속도로 23KM)"
                        value={newIncident.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="severity">심각도</Label>
                        <Select
                          value={newIncident.severity}
                          onValueChange={(value) => handleSelectChange("severity", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="심각도 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="정보">정보</SelectItem>
                            <SelectItem value="경고">경고</SelectItem>
                            <SelectItem value="긴급">긴급</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status">상태</Label>
                        <Select
                          value={newIncident.status}
                          onValueChange={(value) => handleSelectChange("status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="상태 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="접수">접수</SelectItem>
                            <SelectItem value="처리중">처리중</SelectItem>
                            <SelectItem value="해결됨">해결됨</SelectItem>
                          </SelectContent>
                        </Select>
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
                      disabled={createIncidentMutation.isPending}
                    >
                      {createIncidentMutation.isPending ? "제출 중..." : "제출"}
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
                    <TabsTrigger value="긴급">긴급</TabsTrigger>
                    <TabsTrigger value="경고">경고</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>이상 보고 리스트</CardTitle>
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
              ) : filteredIncidents?.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  검색 결과가 없습니다.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>제목</TableHead>
                      <TableHead>위치</TableHead>
                      <TableHead>심각도</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>보고일</TableHead>
                      <TableHead>조치</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncidents
                      ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map(incident => (
                        <TableRow key={incident.id}>
                          <TableCell>
                            <div className="font-medium">{incident.title}</div>
                            <div className="text-sm text-muted-foreground">{incident.description}</div>
                          </TableCell>
                          <TableCell>{incident.location}</TableCell>
                          <TableCell>
                            <SeverityBadge severity={incident.severity} />
                          </TableCell>
                          <TableCell>{incident.status}</TableCell>
                          <TableCell>{format(new Date(incident.createdAt), 'yyyy-MM-dd HH:mm')}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">상세보기</Button>
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
