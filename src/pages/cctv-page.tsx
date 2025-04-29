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
import { CCTVVideoPlayer } from "@/components/CCTVVideoPlayer";

interface Camera {
  id: number;
  name: string;
  location: string;
  url: string;
  status: string;
}

// 샘플 CCTV 데이터
const sampleCameras: Camera[] = [
  {
    id: 1,
    name: "판교분기점",
    location: "수도권제1순환선",
    url: "http://cctvsec.ktict.co.kr/1/YSAWT+Et3EUFCGNlki9QLNQUSZ4ytH4wY7KdMIuTmRcL77ywqLzlsZHrqr7vRv/EMHQAvyOmjtvpsohk5ZN2oQ==",
    status: "실시간"
  },
  {
    id: 2,
    name: "성남",
    location: "수도권제1순환선",
    url: "http://cctvsec.ktict.co.kr/2/7qZabOhWqOugzM02i27Hv2PJZ/Nmnqem4lv4mTe5xAOkxp3F0Ri1e1FkxreduJh+US0kZKxcLVty2ETLWVOd/A==",
    status: "온라인"
  },
  {
    id: 3,
    name: "서초",
    location: "경부선",
    url: "http://cctvsec.ktict.co.kr/99/udHJ/JiVQEjQlNCivyP8ruueDbV5mGFoarTlt/N+yQjdq1DigS8WPbnVh5O+AUptOrLxW1sDnuSe9kSov1X1ydITK/D54U+SNoVmLYFAJKY=",
    status: "온라인"
  },
  {
    id: 4,
    name: "강남",
    location: "경부선",
    url: "http://cctvsec.ktict.co.kr/99/udHJ/JiVQEjQlNCivyP8ruueDbV5mGFoarTlt/N+yQjdq1DigS8WPbnVh5O+AUptOrLxW1sDnuSe9kSov1X1ydITK/D54U+SNoVmLYFAJKY=",
    status: "온라인"
  },
  {
    id: 5,
    name: "수서",
    location: "경부선",
    url: "http://cctvsec.ktict.co.kr/99/udHJ/JiVQEjQlNCivyP8ruueDbV5mGFoarTlt/N+yQjdq1DigS8WPbnVh5O+AUptOrLxW1sDnuSe9kSov1X1ydITK/D54U+SNoVmLYFAJKY=",
    status: "온라인"
  },
  {
    id: 6,
    name: "대치",
    location: "경부선",
    url: "http://cctvsec.ktict.co.kr/99/udHJ/JiVQEjQlNCivyP8ruueDbV5mGFoarTlt/N+yQjdq1DigS8WPbnVh5O+AUptOrLxW1sDnuSe9kSov1X1ydITK/D54U+SNoVmLYFAJKY=",
    status: "온라인"
  },
  {
    id: 7,
    name: "도곡",
    location: "경부선",
    url: "http://cctvsec.ktict.co.kr/99/udHJ/JiVQEjQlNCivyP8ruueDbV5mGFoarTlt/N+yQjdq1DigS8WPbnVh5O+AUptOrLxW1sDnuSe9kSov1X1ydITK/D54U+SNoVmLYFAJKY=",
    status: "온라인"
  },
  {
    id: 8,
    name: "개포",
    location: "경부선",
    url: "http://cctvsec.ktict.co.kr/99/udHJ/JiVQEjQlNCivyP8ruueDbV5mGFoarTlt/N+yQjdq1DigS8WPbnVh5O+AUptOrLxW1sDnuSe9kSov1X1ydITK/D54U+SNoVmLYFAJKY=",
    status: "온라인"
  },
  {
    id: 9,
    name: "대모산",
    location: "경부선",
    url: "http://cctvsec.ktict.co.kr/99/udHJ/JiVQEjQlNCivyP8ruueDbV5mGFoarTlt/N+yQjdq1DigS8WPbnVh5O+AUptOrLxW1sDnuSe9kSov1X1ydITK/D54U+SNoVmLYFAJKY=",
    status: "온라인"
  }
];

export default function CCTVPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const { user } = useAuth();
  const { toast } = useToast();

  // 실제 API 대신 샘플 데이터 사용
  const cameras = sampleCameras;

  // Filter cameras based on search query and filter option
  const filteredCameras = cameras?.filter(camera => {
    const matchesSearch = 
      searchQuery === "" || 
      camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && camera.status === filter;
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCameras?.map(camera => (
            <Card key={camera.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <AspectRatio ratio={16 / 9}>
                    <CCTVVideoPlayer url={camera.url} />
                  </AspectRatio>
                  <div className="absolute top-2 left-2">
                    <Badge variant={camera.status === "온라인" ? "default" : "destructive"}>
                      {camera.status}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold dark:text-white">{camera.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{camera.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
