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
  CarFront
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

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // 로딩 효과를 위한 타이머
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // 통계 데이터 (실제로는 API에서 가져올 것)
  const stats = {
    incidents: { total: 24, critical: 5, resolved: 18 },
    tasks: { total: 42, completed: 28, pending: 14 },
    cctv: { total: 12, active: 10, offline: 2 },
    alerts: { total: 8, unread: 3, high: 2 }
  };

  // 최근 사고 데이터 (실제로는 API에서 가져올 것)
  const recentIncidents = [
    { id: 1, title: "도로 파손", location: "서울시 강남구", severity: "high", status: "진행중", time: "10분 전" },
    { id: 2, title: "신호등 고장", location: "서울시 서초구", severity: "medium", status: "해결됨", time: "1시간 전" },
    { id: 3, title: "가로등 불량", location: "서울시 송파구", severity: "low", status: "대기중", time: "3시간 전" },
    { id: 4, title: "도로 침수", location: "서울시 강동구", severity: "high", status: "진행중", time: "5시간 전" }
  ];

  // 최근 작업 데이터 (실제로는 API에서 가져올 것)
  const recentTasks = [
    { id: 1, title: "도로 파손 수리", assignedTo: "김철수", dueDate: "오늘", status: "진행중" },
    { id: 2, title: "신호등 점검", assignedTo: "이영희", dueDate: "내일", status: "대기중" },
    { id: 3, title: "가로등 교체", assignedTo: "박지성", dueDate: "3일 후", status: "완료됨" },
    { id: 4, title: "도로 침수 대응", assignedTo: "최영수", dueDate: "오늘", status: "진행중" }
  ];

  // 알림 데이터 (실제로는 API에서 가져올 것)
  const alertData = [
    { id: 1, title: "새로운 사고 발생", message: "서울시 강남구에서 도로 파손이 발생했습니다.", time: "5분 전", read: false },
    { id: 2, title: "작업 할당", message: "신호등 점검 작업이 할당되었습니다.", time: "1시간 전", read: false },
    { id: 3, title: "시스템 업데이트", message: "시스템이 성공적으로 업데이트되었습니다.", time: "3시간 전", read: true }
  ];

  // 심각도에 따른 배지 색상
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  // 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'in progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  // 로딩 애니메이션
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="relative w-64 h-32 mx-auto mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.img 
                src="../public/car-loading.png" 
                alt="로딩 중" 
                className="w-32 h-32 dark:invert dark:brightness-0 dark:contrast-100"
                initial={{ scale: 0.1, opacity: 0, y: 60 }}
                animate={{ 
                  scale: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
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
            {/* 도로 표시 */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-300 dark:bg-gray-600">
              {/* 도로 중앙선 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="h-0.5 w-full bg-white dark:bg-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
              </div>
              {/* 도로 표시선 */}
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <motion.div
                  className="w-8 h-1 bg-white dark:bg-gray-400"
                  initial={{ x: -100 }}
                  animate={{ x: 100 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="w-8 h-1 bg-white dark:bg-gray-400"
                  initial={{ x: -100 }}
                  animate={{ x: 100 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
              </div>
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container px-4 py-8 mx-auto"
      >
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/30">
              <Activity className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">대시보드</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">시스템 현황 및 주요 지표</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden transition-shadow shadow-sm rounded-2xl hover:shadow-md">
            <CardHeader>
              <CardTitle className="dark:text-white">총 사고</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-full dark:bg-red-900/30">
                  <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.incidents.total}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">전체 사고 수</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>해결됨: {stats.incidents.resolved}</span>
                  <span>진행중: {stats.incidents.total - stats.incidents.resolved}</span>
                </div>
                <Progress value={(stats.incidents.resolved / stats.incidents.total) * 100} className="h-2 bg-gray-200 dark:bg-dark-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden transition-shadow shadow-sm rounded-2xl hover:shadow-md">
            <CardHeader>
              <CardTitle className="dark:text-white">총 작업</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/30">
                  <Activity className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.tasks.total}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">전체 작업 수</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>완료됨: {stats.tasks.completed}</span>
                  <span>대기중: {stats.tasks.pending}</span>
                </div>
                <Progress value={(stats.tasks.completed / stats.tasks.total) * 100} className="h-2 bg-gray-200 dark:bg-dark-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden transition-shadow shadow-sm rounded-2xl hover:shadow-md">
            <CardHeader>
              <CardTitle className="dark:text-white">CCTV 상태</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full dark:bg-green-900/30">
                  <Camera className="w-6 h-6 text-green-500 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.cctv.active}/{stats.cctv.total}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">활성/전체 CCTV</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>활성: {stats.cctv.active}</span>
                  <span>오프라인: {stats.cctv.offline}</span>
                </div>
                <Progress value={(stats.cctv.active / stats.cctv.total) * 100} className="h-2 bg-gray-200 dark:bg-dark-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden transition-shadow shadow-sm rounded-2xl hover:shadow-md">
            <CardHeader>
              <CardTitle className="dark:text-white">알림</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-full dark:bg-yellow-900/30">
                  <Bell className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.alerts.unread}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">읽지 않은 알림</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>읽지 않음: {stats.alerts.unread}</span>
                  <span>높은 우선순위: {stats.alerts.high}</span>
                </div>
                <Progress value={(stats.alerts.unread / stats.alerts.total) * 100} className="h-2 bg-gray-200 dark:bg-dark-700" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-1">         
          {/* 오른쪽 영역: CCTV */}
          <div className="space-y-6">
            {/* CCTV 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <CCTVCard />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
} 