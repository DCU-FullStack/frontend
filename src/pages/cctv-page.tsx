import { useState, useEffect, useRef } from "react";
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
import { motion } from "framer-motion";
import { useAlert } from "@/contexts/alert-context";
import { useLocation } from "wouter";

interface Camera {
  id: number;
  name: string;
  location: string;
  url: string;
  status: string;
}

// 샘플 CCTV 데이터
export const sampleCameras: Camera[] = [
  {
    id: 1,
    name: "서울영업소 - 광장",
    location: "경부선",
    url: "http://cctvsec.ktict.co.kr/78/1U3JfL5GQRK6OzU0i/vkX4JYR8hK3Ri9db5PrmQAom88OjYezT6Y/iEcvudSy17xiAAvvTgR1InnuGRRYK1LvCsHhq68mI0RpbekIMjmKwU=",
    status: "실시간"
  },
  {
    id: 2,
    name: "장수",
    location: "외곽순환선",
    url: "http://cctvsec.ktict.co.kr/3177/AMok3VxvXEk+PB3C2ftK+zzahaiLBQ9WOSyaDv2Z1RteTM2/AWL4M+nXYzxqx9IifQFhgBv8disKEcMm9GGFoa+n1BXPtVZQk6xEjtDJj9I=",
    status: "실시간"
  },
  {
    id: 3,
    name: "둔내터널",
    location: "영동선",
    url: "http://cctvsec.ktict.co.kr/3233/FKYnQmgYKrVBSedPxcu+9I1AAm2FZ66GpRauWCJIeUFOMzjjO+rdcUDdvtzS/NuENCrAE4HBJWoGketflSRNHHHtrwztgJh7s+k91z6isCw=",
    status: "실시간"
  },
  {
    id: 4,
    name: "서창JC",
    location: "제2경인고속도로",
    url: "http://cctvsec.ktict.co.kr/3707/Y1lpu4M2XCs1y+AwNyVpInt7XteDaby4FNsCIUNMdlUIHLHzuq71JrDlZRsJCXk3U6r3xPh29/ttD4nePEoMuwKOWy+mO5C0itObmkBu7jE=",
    status: "실시간"
  },
  {
    id: 5,
    name: "회덕JC",
    location: "경부선",
    url: "http://cctvsec.ktict.co.kr/2742/t9D5x82pbHEWImn231OahF2/fy68koGLkZT8r/FAgRYqncNZhIu/mEnFQuuUt3jKJ0scQ1qlWiaBK5yGuWjxIYaRDLk6q6W0af84TqOAg6U=",
    status: "실시간"
  },
  {
    id: 6,
    name: "오창",
    location: "중부선",
    url: "http://cctvsec.ktict.co.kr/2304/Bx97fzux2JES3iJwhOE+QhCaTSs1RMMsY1oX632D58xJiXjOhWhZVRgUgw1pkzkOPuXm9xYwE7wpj+BLOlk7ZDNJX2tp2kxJKAzj8nOmbpc=",
    status: "실시간"
  },
  {
    id: 7,
    name: "창원분기점",
    location: "남해선",
    url: "http://cctvsec.ktict.co.kr/2070/PW3NMe4EYTrwH/xR8M3GWbxdyVFcF97eDJ8Xu1gG7tenvwQcIqNgu3RunQxJfIYXIYuuT3yZ3LUx1TN69YsgiKeHwGMx5bzWme1povSMyFQ=",
    status: "실시간"
  },
  {
    id: 8,
    name: "천상천교",
    location: "울산",
    url: "http://cctvsec.ktict.co.kr/94917/vtgmBSzm2+nOSGkHcXwfiK1lh8hL3b26JoUMNAjDdwpxE9zkzMrNbq92GxX10Pz919UFPyqGis2mNNvvxNsaEDHObgtum2AjE8so3jh35Fo=",
    status: "실시간"
  },
  {
    id: 9,
    name: "포항",
    location: "대구포항선",
    url: "http://cctvsec.ktict.co.kr/2223/Qj3QOX1jUo7FO242dOdluYomUPSSEida6Vx+YI/ZbPYQhbY2slobiDhjQxVFsW8g/LD0Xom42Fei+239O7NqGr+srFlip1qzD5hcNTbZDj8=",
    status: "실시간"
  }
];

export default function CCTVPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const { user } = useAuth();
  const { toast } = useToast();
  const { showAlert } = useAlert();
  const [location] = useLocation();

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

  // 스크롤 이동용 ref
  const cameraRefs = cameras.reduce((acc, camera) => {
    acc[camera.id] = acc[camera.id] || (null as null | HTMLDivElement);
    return acc;
  }, {} as Record<number, HTMLDivElement | null>);

  // 상세 버튼 ref
  const detailButtonRefs = cameras.reduce((acc, camera) => {
    acc[camera.id] = acc[camera.id] || (null as null | HTMLButtonElement);
    return acc;
  }, {} as Record<number, HTMLButtonElement | null>);

  // 마운트 시 location.state.cameraId가 있으면 해당 카드로 스크롤
  const locationRef = useRef(location);
  useEffect(() => {
    // @ts-ignore
    const state = locationRef.current && (locationRef.current as any).state;
    if (state && state.cameraId && cameraRefs[state.cameraId]) {
      cameraRefs[state.cameraId]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <Layout title="CCTV">
      <div className="min-h-screen bg-blue-100 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container px-4 py-8 mx-auto"
        >
          
          
          <div className="mb-6">
            <div className="flex items-center w-full max-w-2xl gap-2 mx-auto">
              <div className="relative flex-1">
                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <Input
                  className="w-full bg-gray-100 border-gray-200 shadow-inner rounded-xl dark:bg-dark-700 dark:border-dark-600 pl-9 h-9 focus:shadow-none"
                  placeholder="카메라 이름 또는 위치로 검색"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white shadow-lg rounded-2xl dark:bg-dark-700">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCameras?.map(camera => (
                <Card key={camera.id} ref={el => (cameraRefs[camera.id] = el)} className="overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl rounded-2xl">
                  <CardContent className="p-0">
                    <div className="relative">
                      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-t-2xl">
                        <CCTVVideoPlayer url={camera.url} />
                      </AspectRatio>
                      <div className="absolute top-2 left-2">
                        <Badge variant={camera.status === "온라인" ? "default" : "destructive"} className="rounded-full">
                          {camera.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 rounded-b-2xl">
                      <h3 className="text-lg font-bold dark:text-white">{camera.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{camera.location}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
