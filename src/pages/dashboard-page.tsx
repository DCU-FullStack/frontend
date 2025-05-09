import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CCTVCard } from "@/components/cctv-card";
import { Layout } from "@/components/layout";
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  ChevronRight,
  Newspaper,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/contexts/theme-context";

interface Incident {
  id: number;
  title: string;
  detection_type: string;
  confidence: number;
  location: string;
  timestamp: string;
  assigned_to?: string;
  status?: string;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('로그인이 필요합니다.');
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3000/api/incidents', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('인증이 만료되었습니다. 다시 로그인해주세요.');
            // 로그인 페이지로 리다이렉트
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch incidents');
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }

        // 데이터를 최신순으로 정렬
        const sortedData = data.sort((a: Incident, b: Incident) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setIncidents(sortedData);
      } catch (err) {
        console.error('Error fetching incidents:', err);
        setError('사고 데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncidents();
    // 30초마다 데이터 갱신
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  // 심각도에 따른 배지 색상 (confidence 기반)
  const getSeverityBadge = (confidence: number) => {
    if (confidence >= 0.8) {
      return <Badge variant="destructive" className="rounded-lg">심각</Badge>;
    }
    return null;
  };

  // 상태에 따른 배지 색상 (detection_type 기반)
  const getStatusBadge = (detectionType: string | undefined) => {
    if (!detectionType) return null;

    switch (detectionType.toLowerCase()) {
      case 'accident':
        return <Badge variant="destructive" className="rounded-lg">사고</Badge>;
      case 'congestion':
        return <Badge variant="secondary" className="rounded-lg">정체</Badge>;
      case 'construction':
        return <Badge variant="outline" className="rounded-lg">공사</Badge>;
      case 'weather':
        return <Badge variant="default" className="rounded-lg">기상</Badge>;
      case 'obstacle':
        return <Badge variant="default" className="rounded-lg">장애물</Badge>;
      default:
        return null;
    }
  };

  // 로딩 애니메이션
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-300 rounded-full border-t-sky-600 dark:border-gray-600 dark:border-t-sky-400 animate-spin"></div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-sky-400">로딩 중...</h2>
          <p className="text-gray-600 dark:text-sky-300">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <Layout title="대시보드">
      <div className="flex flex-col h-[calc(100vh-4rem)] font-pretendard">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container px-4 py-8 mx-auto"
        >
          <div className="mt-10 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              <div className="p-3 rounded-full shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50">
                <Newspaper className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">홈</h1>
                <p className="mt-1 font-medium text-gray-600 dark:text-gray-400">시스템 현황 및 주요 지표</p>
              </div>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Incident Management Card */}
            <div className="w-full lg:w-1/3">
              <Card className="h-full shadow-lg rounded-xl">
                <CardHeader className="rounded-t-xl bg-gray-50 dark:bg-gray-800/50">
                  <CardTitle className="text-xl font-semibold tracking-tight dark:text-white">사고 관리</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-16rem)] md:h-[calc(100vh-20rem)] lg:h-[calc(100vh-16rem)] rounded-lg">
                    {error ? (
                      <div className="p-4 font-medium text-center text-red-500 rounded-lg bg-red-50 dark:bg-red-900/20">{error}</div>
                    ) : incidents.length === 0 ? (
                      <div className="p-4 font-medium text-center text-gray-500 rounded-lg bg-gray-50 dark:bg-gray-800/50">사고 없음</div>
                    ) : (
                      <div className="space-y-4">
                        {incidents.map((incident) => (
                          <div
                            key={incident.id}
                            className="p-4 transition-colors border cursor-pointer rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:border-gray-800"
                            onClick={() => navigate(`/incidents/${incident.id}`)}
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div className="space-y-1">
                                <h3 className="font-semibold tracking-tight text-gray-900 dark:text-white">
                                  {incident.title}
                                </h3>
                                <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                  <MapPin className="w-4 h-4" />
                                  <span>{incident.location}</span>
                                </div>
                              </div>
                              <div className="flex flex-row items-start gap-2 sm:flex-col sm:items-end">
                                {getSeverityBadge(incident.confidence)}
                                {getStatusBadge(incident.detection_type)}
                              </div>
                            </div>
                            <div className="flex items-center mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{new Date(incident.timestamp).toLocaleString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                            
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Map Section */}
            <div className="w-full lg:w-2/3">
              <div className="w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)] overflow-hidden shadow-lg rounded-xl">
                <CCTVCard />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
} 