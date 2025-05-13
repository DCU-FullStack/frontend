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
import api from "@/utils/apiRequest";

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
  { name: "포트홀", value: 211, fill: "#0ea5e9"},
  { name: "타이어", value: 49, fill: "#38bdf8"},
  { name: "바위", value: 53, fill: "#7dd3fc"},
  { name: "동물", value: 1041, fill: "#bae6fd"}
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

  // 사고 감지 데이터 저장 함수
  const saveIncident = async (data: any) => {
    try {
      const incidentData = {
        title: data.title || '포트홀 감지',
        detectionType: data.detectionType || 'Pothole',
        confidence: data.confidence || 0.8,
        location: data.location || '위치 정보 없음',
        timestamp: data.timestamp || new Date().toISOString()
      };

      const response = await api.post('/incidents', incidentData);
      console.log('사고 감지 데이터 저장 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('사고 감지 데이터 저장 실패:', error);
      throw error;
    }
  };

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
        const response = await api.get<Incident[]>('/incidents');
        setIncidents(response.data);
      } catch (error) {
        console.error('사고 현황 조회 실패:', error);
        setIncidents([]); // 에러 발생 시 빈 배열로 설정
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
              {/* Real-time Incidents Card */}
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl shadow-md rounded-2xl hover:scale-[1.01]">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold tracking-tight dark:text-white">실시간 사고 현황</CardTitle>
                    <Badge variant="outline" className="px-2 py-1 text-xs">
                      실시간 업데이트
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(55vh-8rem)] rounded-lg">
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

              {/* Real-time CCTV Card */}
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
                  <div className="h-[calc(75vh-8rem)]">
                    <CCTVCard />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
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
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                              </linearGradient>
                              <linearGradient id="colorAccident" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fill: textColor, fontSize: 12 }}
                              axisLine={{ stroke: gridColor }}
                              tickLine={{ stroke: gridColor }}
                            />
                            <YAxis 
                              yAxisId="left" 
                              tick={{ fill: textColor, fontSize: 12 }}
                              axisLine={{ stroke: gridColor }}
                              tickLine={{ stroke: gridColor }}
                              label={{ 
                                value: '차량 수', 
                                angle: -90, 
                                position: 'insideLeft',
                                fill: textColor,
                                fontSize: 12,
                                offset: 10
                              }}
                            />
                            <YAxis 
                              yAxisId="right" 
                              orientation="right" 
                              tick={{ fill: textColor, fontSize: 12 }}
                              axisLine={{ stroke: gridColor }}
                              tickLine={{ stroke: gridColor }}
                              label={{ 
                                value: '사고 건수', 
                                angle: 90, 
                                position: 'insideRight',
                                fill: textColor,
                                fontSize: 12,
                                offset: 10
                              }}
                            />
                            <RechartsTooltip 
                              contentStyle={{
                                backgroundColor: tooltipBgColor,
                                border: 'none',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                padding: '12px',
                                color: tooltipTextColor
                              }}
                              formatter={(value, name) => {
                                if (name === '차량수') return [`${value.toLocaleString()}대`, '차량 수'];
                                if (name === '사고') return [`${value.toLocaleString()}건`, '사고 건수'];
                                return [value, name];
                              }}
                            />
                            <Legend 
                              wrapperStyle={{
                                color: textColor,
                                paddingTop: '20px',
                                fontSize: '12px'
                              }}
                            />
                            <Bar 
                              yAxisId="left" 
                              dataKey="차량수" 
                              fill="url(#colorTraffic)"
                              radius={[4, 4, 0, 0]}
                              barSize={40}
                            />
                            <Line 
                              yAxisId="right" 
                              type="monotone" 
                              dataKey="사고" 
                              stroke="url(#colorAccident)"
                              strokeWidth={3}
                              dot={{ 
                                r: 6, 
                                fill: '#ef4444',
                                stroke: isDarkMode ? '#1f2937' : '#ffffff',
                                strokeWidth: 2
                              }}
                              activeDot={{ 
                                r: 8, 
                                fill: '#ef4444',
                                stroke: isDarkMode ? '#1f2937' : '#ffffff',
                                strokeWidth: 2
                              }}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                    <TabsContent value="anomalies">
                      <div className="h-[calc(60vh-8rem)]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={anomalyData} 
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                          >
                            <defs>
                              {anomalyData.map((entry, index) => (
                                <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                                  <stop offset="0%" stopColor={entry.fill} stopOpacity={0.9}/>
                                  <stop offset="100%" stopColor={entry.fill} stopOpacity={0.6}/>
                                </linearGradient>
                              ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} horizontal={false} />
                            <XAxis 
                              type="number"
                              tick={{ fill: textColor, fontSize: 12 }}
                              axisLine={{ stroke: gridColor }}
                              tickLine={{ stroke: gridColor }}
                              label={{ 
                                value: '건수', 
                                position: 'insideBottom',
                                fill: textColor,
                                fontSize: 12,
                                offset: -5
                              }}
                            />
                            <YAxis 
                              type="category"
                              dataKey="name"
                              tick={{ fill: textColor, fontSize: 12 }}
                              axisLine={{ stroke: gridColor }}
                              tickLine={{ stroke: gridColor }}
                            />
                           
                            <Bar
                              dataKey="value"
                              barSize={30}
                              radius={[0, 4, 4, 0]}
                            >
                              {anomalyData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={`url(#gradient-${index})`}
                                  stroke={isDarkMode ? "#1f2937" : "#ffffff"}
                                  strokeWidth={2}
                                  style={{
                                    filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))"
                                  }}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                    <TabsContent value="trends">
                      <div className="h-[calc(60vh-8rem)]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                              <linearGradient id="colorAccident" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                              </linearGradient>
                              <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fill: textColor, fontSize: 12 }}
                              axisLine={{ stroke: gridColor }}
                              tickLine={{ stroke: gridColor }}
                            />
                            <YAxis 
                              tick={{ fill: textColor, fontSize: 12 }}
                              axisLine={{ stroke: gridColor }}
                              tickLine={{ stroke: gridColor }}
                              label={{ 
                                value: '건수', 
                                angle: -90, 
                                position: 'insideLeft',
                                fill: textColor,
                                fontSize: 12,
                                offset: 10
                              }}
                            />
                            <RechartsTooltip 
                              contentStyle={{
                                backgroundColor: tooltipBgColor,
                                border: 'none',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                padding: '12px',
                                color: tooltipTextColor
                              }}
                              formatter={(value, name) => {
                                if (name === '사고') return [`${value.toLocaleString()}건`, '사고 건수'];
                                if (name === '이상감지') return [`${value.toLocaleString()}건`, '이상 감지 건수'];
                                return [value, name];
                              }}
                            />
                            <Legend 
                              wrapperStyle={{
                                color: textColor,
                                paddingTop: '20px',
                                fontSize: '12px'
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="사고" 
                              stroke="#0ea5e9" 
                              fill="url(#colorAccident)"
                              strokeWidth={2}
                              dot={{ 
                                r: 4, 
                                fill: '#0ea5e9',
                                stroke: isDarkMode ? '#1f2937' : '#ffffff',
                                strokeWidth: 2
                              }}
                              activeDot={{ 
                                r: 6, 
                                fill: '#0ea5e9',
                                stroke: isDarkMode ? '#1f2937' : '#ffffff',
                                strokeWidth: 2
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="이상감지" 
                              stroke="#38bdf8" 
                              fill="url(#colorAnomaly)"
                              strokeWidth={2}
                              dot={{ 
                                r: 4, 
                                fill: '#38bdf8',
                                stroke: isDarkMode ? '#1f2937' : '#ffffff',
                                strokeWidth: 2
                              }}
                              activeDot={{ 
                                r: 6, 
                                fill: '#38bdf8',
                                stroke: isDarkMode ? '#1f2937' : '#ffffff',
                                strokeWidth: 2
                              }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Time-based Accident Rate Card */}
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl shadow-md rounded-2xl hover:scale-[1.01]">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl">
                  <CardTitle className="text-xl font-semibold tracking-tight dark:text-white">시간대별 사고 비율</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 transition-all duration-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-900/30">
                            <Clock className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                          </div>
                          <span className="text-sm font-medium dark:text-gray-300">출근/주간(06~14시)</span>
                        </div>
                        <span className="px-2.5 py-0.5 text-sm font-semibold text-sky-600 bg-sky-100 rounded-full dark:bg-sky-900/30 dark:text-sky-400">32%</span>
                      </div>
                      <div className="w-full h-2.5 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-700">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "32%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-500"
                          style={{ boxShadow: '0 2px 4px rgba(14, 165, 233, 0.2)' }}
                        />
                      </div>
                    </div>

                    <div className="p-3 transition-all duration-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Clock className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                          </div>
                          <span className="text-sm font-medium dark:text-gray-300">퇴근/야간(14시~22시)</span>
                        </div>
                        <span className="px-2.5 py-0.5 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400">54%</span>
                      </div>
                      <div className="w-full h-2.5 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-700">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "54%" }}
                          transition={{ duration: 1, delay: 0.7 }}
                          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500"
                          style={{ boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)' }}
                        />
                      </div>
                    </div>

                    <div className="p-3 transition-all duration-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                            <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                          </div>
                          <span className="text-sm font-medium dark:text-gray-300">심야/새벽(22~06시)</span>
                        </div>
                        <span className="px-2.5 py-0.5 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full dark:bg-indigo-900/30 dark:text-indigo-400">14%</span>
                      </div>
                      <div className="w-full h-2.5 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-700">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "14%" }}
                          transition={{ duration: 1, delay: 0.9 }}
                          className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500"
                          style={{ boxShadow: '0 2px 4px rgba(99, 102, 241, 0.2)' }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Accident Hotspots Card */}
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl shadow-md rounded-2xl hover:scale-[1.01]">
                <CardHeader className="py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl">
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
                      <span className="px-2 py-0.5 text-xs text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">포트홀</span>
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
                      <span className="px-2 py-0.5 text-xs text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">로드킬</span>
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
                      <span className="px-2 py-0.5 text-xs text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">바위</span>
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