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
import { motion } from "framer-motion";

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
    name: "서울영업소 - 광장",
    location: "경부선",
    url: "http://cctvsec.ktict.co.kr/319/7m/cpZDnRk2hf/id/i7gk9T6DaucMvgEeHchDpSA7kM99Vxu2/Mi9m3LasfH9VB2uFUSdHf2U37r7LljfC62otwKg+QngoLQRWi0RsqQwdU",
    status: "실시간"
  },
  {
    id: 2,
    name: "장수",
    location: "외곽순환선",
    url: "http://cctvsec.ktict.co.kr/66/2Q/POO4ScfURXfNkfqKKwLDb3B/94LtGnMiDOJqyUSV1YXEIMka2ZvnnvpmtPShOP7Cqwj4AWs+uNQoEeOPyEmYNLp3sVVbiuTpYE2kVueA=",
    status: "실시간"
  },
  {
    id: 3,
    name: "둔내터널",
    location: "영동선",
    url: "http://cctvsec.ktict.co.kr/8289/QlVNaMyMmzwR1wXsbVfxxcpKCMUD5ZJWlZ00UxXfRjcO8d1b5VJsQvea8J5UP+e0E4UHg9sq1Q3oTRe/f9q3vU4gqUZbvEIV4FmF6wFqI7I=",
    status: "실시간"
  },
  {
    id: 4,
    name: "서창JC",
    location: "제2경인고속도로",
    url: "http://cctvsec.ktict.co.kr/50/F5HUdiT8UcO9oXEUCEYdKc+gmkmWEuhsCPcx6/GkQyqB0AYmnErPDc5hoMj8ACnLH/JqgCa+1rB8PQjQnDyvrGjnHk765+/7StY/pS5Xr0k=",
    status: "실시간"
  },
  {
    id: 5,
    name: "회덕JC",
    location: "경부선",
    url: "http://cctvsec.ktict.co.kr/125//FQri/uczRIMKT5wT+VbNOsaGmtCcp3L3j4EXuKji6VOIAppMXEn8HfgRlC7kj9MYIgaqukb/5YoaixXSj2KBwULtg+yno2TBnISF3cZhw4=",
    status: "실시간"
  },
  {
    id: 6,
    name: "오창",
    location: "중부선",
    url: "http://cctvsec.ktict.co.kr/2304/U6x4VPL35kHEoRs02H9kwBuebYtCADoHIJNu9i3K6MU8yINXrZtdB1PLLFfMJDkid8dn0kNDN0LmKkJat/ljzG2+5ex7ig8Jt57UtI05cKg=",
    status: "실시간"
  },
  {
    id: 7,
    name: "창원분기점",
    location: "남해선",
    url: "http://cctvsec.ktict.co.kr/2070/Rr4UBrIkvcNJITn0S7NlQq4HonTkAzIe4a6Vvlx3vpjDZb1y/rgqEzFDg3h+xCOH9W3pdWus/R5UXZX7S9uZyDDLOgXl9HnLFVbFXeK57/E=",
    status: "실시간"
  },
  {
    id: 8,
    name: "천상천교",
    location: "울산",
    url: "http://cctvsec.ktict.co.kr/94917/cLOEASuoI20Llsc1rUBMitpAmBNVs+6XLENhMRkDq8PsPAx1ARNleDviuS0K3OmWLsrUPPfgIc2Rw+H9QwLBwCan0d8r90hYhcMNMra+Qno=",
    status: "실시간"
  },
  {
    id: 9,
    name: "포항",
    location: "대구포항선",
    url: "http://cctvsec.ktict.co.kr/94855/GK9TPb8bTOfz4pLS7VSe4Ce6FevrtjMtzrJ1Q/JXzOAsL8e1WtLb4y5euKuD8tw7SG9HDPK2xukDn8Qu5tYzQs1arpBxt8XoqTqe/BAiDbI=",
    status: "실시간"
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
                <Card key={camera.id} className="overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl rounded-2xl">
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
