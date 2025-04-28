import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Video } from "lucide-react";
import { apiRequest } from "@/lib/apiRequest";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface Camera {
  id: number;
  name: string;
  location: string;
  imageUrl: string;
  status: string;
}

export default function CCTVPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: cameras, isLoading, error } = useQuery<Camera[]>({
    queryKey: ["/api/cameras"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/cameras");
      return await res.json();
    }
  });

  // Filter cameras based on search query and filter option
  const filteredCameras = cameras?.filter(camera => {
    const matchesSearch = 
      searchQuery === "" || 
      camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && camera.status === filter;
  });

  // Mutation for creating a new camera
  const createCameraMutation = useMutation({
    mutationFn: async (camera: Omit<Camera, 'id'>) => {
      const res = await apiRequest("POST", "/api/cameras", camera);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cameras"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "카메라 추가 완료",
        description: "새로운 카메라가 추가되었습니다.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "카메라 추가 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Layout title="CCTV 감시">
      <div className="px-4 py-6">
        <div className="mb-6">
          <h1 className="flex items-center text-2xl font-bold text-gray-800 dark:text-white">
            <Video className="w-6 h-6 mr-2 text-primary" />
            CCTV 감시
          </h1>
          <p className="text-gray-600 dark:text-gray-400">실시간 도로 상황을 모니터링하세요.</p>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center w-full max-w-2xl gap-2 mx-auto">
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                className="w-full bg-gray-100 border-gray-200 rounded-full shadow-inner dark:bg-dark-700 dark:border-dark-600 pl-9 h-9 focus:shadow-none"
                placeholder="카메라 이름 또는 위치로 검색"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                    <div className="flex justify-between mt-2">
                      <Skeleton className="h-6 w-[80px] rounded-full" />
                      <Skeleton className="h-6 w-[60px]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">
            카메라 데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        ) : filteredCameras?.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            검색 결과가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCameras?.map(camera => (
              <Card key={camera.id} className="overflow-hidden">
                <AspectRatio ratio={16 / 9}>
                  <img 
                    src={camera.imageUrl} 
                    alt={`CCTV 피드 - ${camera.name}`} 
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                <CardContent className="p-4">
                  <div>
                    <h3 className="text-lg font-bold dark:text-white">{camera.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{camera.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant={camera.status === "온라인" ? "default" : camera.status === "오프라인" ? "destructive" : "outline"}>
                        {camera.status}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">ID: {camera.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
