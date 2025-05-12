import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CCTVCard } from "@/components/cctv-card";
import { TasksTable } from "@/components/tasks-table";
import { Layout } from "@/components/layout";
import { 
  AlertTriangle, 
  Activity, 
  MapPin, 
  Clock, 
  ChevronRight, 
  BarChart3, 
  Shield,
  Camera,
  Bell,
  User,
  CarFront,
  LayoutDashboard,
  Map,
  Navigation,
  Newspaper,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/theme-context";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import { useAlert } from "@/contexts/alert-context";
import { AlertOverlay } from "@/components/alert-overlay";

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

// 샘플 데이터
const trafficData = [
  { name: "20년", 차량수: 10478, 사고: 1014 },
  { name: "21년", 차량수: 10849, 사고: 1089 },
  { name: "22년", 차량수: 10728, 사고: 1055 },
  { name: "23년", 차량수: 11071, 사고: 1247 },
  { name: "24년", 차량수: 10976, 사고: 1222 },
];

const anomalyData = [
  { name: "싱크홀", value: 211, fill: "#FF6B6B", icon: "🕳" },
  { name: "타이어", value: 49, fill: "#4ECDC4", icon: "🛞" },
  { name: "바위", value: 53, fill: "#45B7D1", icon: "🪨" },
  { name: "동물", value: 1041, fill: "#96CEB4", icon: "🦌" }
];

const monthlyData = [
  { name: "20년", 사고: 1014, 이상감지: 1056 },
  { name: "21년", 사고: 1089, 이상감지: 1131 },
  { name: "22년", 사고: 1055, 이상감지: 1097 },
  { name: "23년", 사고: 1247, 이상감지: 1289 },
  { name: "24년", 사고: 1222, 이상감지: 1264 },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  const { showAlert, isAlertVisible } = useAlert();
  const [recognizedIncidentIds, setRecognizedIncidentIds] = useState<Set<number>>(new Set());
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 다크모드에 맞는 차트 스타일 설정
  const textColor = isDarkMode ? "#e5e7eb" : "#666";
  const gridColor = isDarkMode ? "#374151" : "#f0f0f0";
  const tooltipBgColor = isDarkMode ? "rgba(31, 41, 55, 0.9)" : "rgba(255, 255, 255, 0.9)";
  const tooltipTextColor = isDarkMode ? "#e5e7eb" : "#333";
  const tooltipItemColor = isDarkMode ? "#a5b4fc" : "#8884d8";

  // 로딩 효과를 위한 타이머
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('로그인이 필요합니다.');
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
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch incidents');
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }

        // 새로운 고신뢰도 사고만 필터링
        const newHighConfidenceIncidents = data.filter(
          (incident: Incident) => 
            incident.confidence >= 0.75 && 
            !recognizedIncidentIds.has(incident.id)
        );

        // 초기 로드가 아닐 때만 알림 표시
        if (newHighConfidenceIncidents.length > 0 && !isInitialLoad) {
          showAlert();
          setRecognizedIncidentIds(prev => {
            const newSet = new Set(prev);
            newHighConfidenceIncidents.forEach(incident => newSet.add(incident.id));
            return newSet;
          });
        }

        // 초기 로드 완료 표시
        if (isInitialLoad) {
          setIsInitialLoad(false);
          // 초기 데이터의 ID들을 recognizedIncidentIds에 추가
          const initialIds = new Set(data.map(incident => incident.id));
          setRecognizedIncidentIds(initialIds);
        }

        // 데이터를 최신순으로 정렬
        const sortedData = data.sort((a: Incident, b: Incident) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setIncidents(sortedData);
      } catch (err) {
        console.error('Error fetching incidents:', err);
        setError('사고 데이터를 불러오는데 실패했습니다.');
      }
    };

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 1000);
    return () => clearInterval(interval);
  }, [navigate, recognizedIncidentIds, showAlert, isInitialLoad]);

  // 수동 새로고침 함수
  const handleRefresh = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
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
    }
  };

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
          <div className="relative w-64 h-32 mx-auto mb-4">
            {/* 도로 표시 */}
            <div className="absolute inset-x-0 bottom-0 h-32 overflow-hidden">
              <div className="relative w-full h-full">
                {/* 도로 배경 */}
                <div className="absolute inset-0">
                  <motion.div
                    className="absolute inset-x-0 h-full bg-gray-900 dark:bg-gray-700"
                    style={{
                      transformOrigin: 'bottom',
                      transform: 'perspective(1000px) rotateX(75deg)',
                      clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
                    }}
                  >
                    {/* 도로 중앙선 */}
                    <motion.div
                      className="absolute h-full left-1/2"
                      style={{ 
                        transform: 'translateX(-50%)',
                        width: '8px',
                        background: 'white',
                        boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                      }}
                      initial={{ y: '-100%' }}
                      animate={{ y: '100%' }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    {/* 도로 양쪽 선 */}
                    <motion.div
                      className="absolute left-0 h-full"
                      style={{ 
                        width: '12px',
                        background: 'white',
                        boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                      }}
                      initial={{ y: '-100%' }}
                      animate={{ y: '100%' }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <motion.div
                      className="absolute right-0 h-full"
                      style={{ 
                        width: '12px',
                        background: 'white',
                        boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                      }}
                      initial={{ y: '-100%' }}
                      animate={{ y: '100%' }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    {/* 도로 양쪽 검은 영역 */}
                    <div className="absolute top-0 left-0 w-[20%] h-full bg-black dark:bg-gray-950 transform -translate-x-full" />
                    <div className="absolute top-0 right-0 w-[20%] h-full bg-black dark:bg-gray-950 transform translate-x-full" />
                  </motion.div>
                </div>
              </div>
            </div>
            {/* 차량 이미지 */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
              <motion.img 
                src="/car-loading.gif"
                alt="로딩 중" 
                className="w-32 h-32 "
                initial={{ scale: 0.1, opacity: 0, y: 60 }}
                animate={{ 
                  scale: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9],
                  opacity: [0, 0.2, 0.4, 0.6, 0.8, 1],
                  y: [60, 40, 20, 0, -20]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-300 rounded-full border-t-sky-600 dark:border-gray-600 dark:border-t-sky-400 animate-spin"></div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-sky-400">로딩 중...</h2>
          <p className="text-gray-600 dark:text-sky-300">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <Layout title="대시보드">
      <AlertOverlay isVisible={isAlertVisible} />
      <div className="flex flex-col min-h-screen bg-blue-100 dark:bg-gray-900">
        {/* Header Section with Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container px-4 py-8 mx-auto"
        >
          {/* Main Content Area */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Incidents Card */}
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl shadow-md rounded-2xl hover:scale-[1.01]">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold tracking-tight dark:text-white">실시간 사고 현황</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="px-2 py-1 text-xs">
                        실시간 업데이트
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRefresh}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-transform duration-300 hover:rotate-180"
                        >
                          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                          <path d="M3 3v5h5" />
                          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                          <path d="M16 21h5v-5" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(40vh-8rem)] rounded-lg">
                    {error ? (
                      <div className="p-4 font-medium text-center text-red-500 rounded-lg bg-red-50 dark:bg-red-900/20">{error}</div>
                    ) : incidents.length === 0 ? (
                      <div className="p-4 font-medium text-center text-gray-500 rounded-lg bg-gray-50 dark:bg-gray-800/50">사고 없음</div>
                    ) : (
                      <div className="space-y-4">
                        {incidents.map((incident) => (
                          <motion.div
                            key={incident.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 transition-all duration-300 border cursor-pointer rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:border-gray-800"
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
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Analytics Card */}
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl shadow-md rounded-2xl hover:scale-[1.01]">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl">
                  <CardTitle className="text-xl font-semibold tracking-tight dark:text-white">데이터 분석</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="traffic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-100 dark:bg-gray-800">
                      <TabsTrigger 
                        value="traffic"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                      >
                        교통 현황
                      </TabsTrigger>
                      <TabsTrigger 
                        value="anomalies"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                      >
                        이상 감지
                      </TabsTrigger>
                      <TabsTrigger 
                        value="trends"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                      >
                        년도별 추세
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="traffic">
                      <div className="h-[calc(60vh-8rem)]">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={trafficData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: textColor }} />
                            <YAxis yAxisId="left" tick={{ fill: textColor }} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fill: textColor }} />
                            <RechartsTooltip 
                              contentStyle={{
                                backgroundColor: tooltipBgColor,
                                border: 'none',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                padding: '12px',
                                color: tooltipTextColor
                              }}
                            />
                            <Legend wrapperStyle={{ color: textColor }} />
                            <Bar yAxisId="left" dataKey="차량수" fill="url(#colorTraffic)" />
                            <Line yAxisId="right" type="monotone" dataKey="사고" stroke="#ff7300" />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                    <TabsContent value="anomalies">
                      <div className="h-[calc(60vh-8rem)]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                              {anomalyData.map((entry, index) => (
                                <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={entry.fill} stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor={entry.fill} stopOpacity={0.3}/>
                                </linearGradient>
                              ))}
                            </defs>
                            <Pie
                              data={anomalyData}
                              cx="50%"
                              cy="45%"
                              labelLine={true}
                              label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                              outerRadius={130}
                              innerRadius={80}
                              dataKey="value"
                              animationBegin={0}
                              animationDuration={1500}
                              paddingAngle={2}
                            >
                              {anomalyData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={`url(#gradient-${index})`}
                                  stroke={isDarkMode ? "#1f2937" : "#ffffff"}
                                  strokeWidth={2}
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip 
                              contentStyle={{
                                backgroundColor: tooltipBgColor,
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                padding: '12px 16px',
                                color: tooltipTextColor
                              }}
                              formatter={(value, name) => [`${value}건`, name]}
                            />
                            <Legend 
                              wrapperStyle={{
                                color: textColor,
                                paddingTop: '20px',
                                fontSize: '14px'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                    <TabsContent value="trends">
                      <div className="h-[calc(60vh-8rem)]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                              <linearGradient id="colorAccident" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#ff7300" stopOpacity={0.1}/>
                              </linearGradient>
                              <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: textColor }} />
                            <YAxis tick={{ fill: textColor }} />
                            <RechartsTooltip 
                              contentStyle={{
                                backgroundColor: tooltipBgColor,
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                padding: '12px 16px',
                                color: tooltipTextColor
                              }}
                            />
                            <Legend wrapperStyle={{ color: textColor }} />
                            <Area type="monotone" dataKey="사고" stroke="url(#colorAccident)" fill="url(#colorAccident)" />
                            <Area type="monotone" dataKey="이상감지" stroke="url(#colorAnomaly)" fill="url(#colorAnomaly)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* 시간대별 사고 비율 */}
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl shadow-md rounded-2xl hover:scale-[1.01]">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl">
                  <CardTitle className="text-xl font-semibold tracking-tight dark:text-white">시간대별 사고 비율</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium dark:text-gray-300">출근/주간(06~14시)</span>
                        <span className="text-sm font-medium dark:text-white">28%</span>
                      </div>
                      <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "28%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium dark:text-gray-300">퇴근/야간(14시~22시)</span>
                        <span className="text-sm font-medium dark:text-white">50%</span>
                      </div>
                      <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "50%" }}
                          transition={{ duration: 1, delay: 0.7 }}
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium dark:text-gray-300">심야/새벽(22~06시)</span>
                        <span className="text-sm font-medium dark:text-white">22%</span>
                      </div>
                      <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "22%" }}
                          transition={{ duration: 1, delay: 0.9 }}
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CCTV Card */}
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl shadow-md rounded-2xl hover:scale-[1.01]">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold tracking-tight dark:text-white">실시간 CCTV</CardTitle>
                    <Badge variant="outline" className="px-2 py-1 text-xs">
                      라이브 스트리밍
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[calc(55vh-8rem)]">
                    <CCTVCard />
                  </div>
                </CardContent>
              </Card>

              {/* 사고 다발 구역 */}
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl shadow-md rounded-2xl hover:scale-[1.01]">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl py-3">
                  <CardTitle className="text-lg font-semibold tracking-tight dark:text-white">사고 다발 구역</CardTitle>
                </CardHeader>
                <CardContent className="py-3">
                  <ul className="space-y-2">
                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center justify-between p-2 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div>
                        <p className="text-sm font-medium dark:text-white">경부선 서울방향 364.6km 지점</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">최근 30일간 15건 발생</p>
                      </div>
                      <span className="px-2 py-0.5 text-xs text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">싱크홀🕳</span>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center justify-between p-2 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div>
                        <p className="text-sm font-medium dark:text-white">중부내륙선 양평방향 28.9km 지점</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">최근 30일간 12건 발생</p>
                      </div>
                      <span className="px-2 py-0.5 text-xs text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-200">로드킬🦌</span>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center justify-between p-2 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div>
                        <p className="text-sm font-medium dark:text-white">중앙선 부산방향 7.4km 지점</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">최근 30일간 8건 발생</p>
                      </div>
                      <span className="px-2 py-0.5 text-xs text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-200">바위🪨</span>
                    </motion.li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
} 