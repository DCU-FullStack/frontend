import React, { useEffect, useState } from 'react';
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import { apiRequest } from "@/lib/apiRequest";
import { useNavigate, useLocation } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  detectionType: string;
  location: string;
  timestamp: string;
}

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const incidentData = location.state?.incident;

  useEffect(() => {
    if (incidentData) {
      const newTask: Task = {
        id: Date.now(), // 임시 ID
        title: `사건 처리 - ${incidentData.id}`,
        status: 'IN_PROGRESS',
        detectionType: incidentData.detectionType,
        location: incidentData.location,
        timestamp: incidentData.timestamp
      };
      setTasks(prevTasks => [newTask, ...prevTasks]);
    }
  }, [incidentData]);

  const fetchTasks = async () => {
    try {
      const response = await apiRequest('GET', '/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: 'IN_PROGRESS' | 'COMPLETED') => {
    try {
      const response = await apiRequest('PUT', `/api/tasks/${taskId}/status`, { status: newStatus });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  useEffect(() => {
    if (location.state?.message) {
      alert(location.state.message);
      // 상태 초기화
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <Layout title="작업 관리">
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
            <div className="p-3 rounded-full shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50">
              <CheckCircle2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">작업 관리</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">작업 현황을 모니터링하고 관리합니다</p>
            </div>
          </motion.div>
        </div>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle>작업 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl">
              <Table>
                <TableHeader className="bg-gray-100 dark:bg-gray-800">
                  <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <TableHead className="pl-6 text-gray-900 border-b-2 border-gray-300 dark:text-gray-100 dark:border-gray-600">ID</TableHead>
                    <TableHead className="pl-6 text-gray-900 border-b-2 border-gray-300 dark:text-gray-100 dark:border-gray-600">제목</TableHead>
                    <TableHead className="pl-6 text-gray-900 border-b-2 border-gray-300 dark:text-gray-100 dark:border-gray-600">사건 유형</TableHead>
                    <TableHead className="pl-6 text-gray-900 border-b-2 border-gray-300 dark:text-gray-100 dark:border-gray-600">위치</TableHead>
                    <TableHead className="pl-6 text-gray-900 border-b-2 border-gray-300 dark:text-gray-100 dark:border-gray-600">발생 시간</TableHead>
                    <TableHead className="pl-6 text-gray-900 border-b-2 border-gray-300 dark:text-gray-100 dark:border-gray-600">상태</TableHead>
                    <TableHead className="pl-6 text-gray-900 border-b-2 border-gray-300 dark:text-gray-100 dark:border-gray-600">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="pl-6 text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700">{task.id}</TableCell>
                      <TableCell className="pl-6 text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700">{task.title || 'N/A'}</TableCell>
                      <TableCell className="pl-6 text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700">{task.detectionType || 'N/A'}</TableCell>
                      <TableCell className="pl-6 text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700">{task.location || 'N/A'}</TableCell>
                      <TableCell className="pl-6 text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700">
                        {task.timestamp ? new Date(task.timestamp).toLocaleString() : 'N/A'}
                      </TableCell>
                      <TableCell className="pl-6 border-b border-gray-200 dark:border-gray-700">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          task.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {task.status === 'COMPLETED' ? '완료' : '진행중'}
                        </span>
                      </TableCell>
                      <TableCell className="pl-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                            className={`flex items-center space-x-1 text-white rounded-xl ${
                              task.status === 'IN_PROGRESS' 
                                ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' 
                                : 'bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700'
                            }`}
                            disabled={task.status === 'IN_PROGRESS'}
                          >
                            <Clock className="w-4 h-4" />
                            <span>진행중</span>
                          </Button>
                          <Button
                            onClick={() => handleStatusChange(task.id, 'COMPLETED')}
                            className={`flex items-center space-x-1 text-white rounded-xl ${
                              task.status === 'COMPLETED' 
                                ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' 
                                : 'bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700'
                            }`}
                            disabled={task.status === 'COMPLETED'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>완료</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default TasksPage;
