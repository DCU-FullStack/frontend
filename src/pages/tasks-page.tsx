//task-page
import React, { useEffect, useState } from 'react';
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, MonitorCheck } from "lucide-react";
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
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
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
      console.log('API Response:', response);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Parsed Data:', data);
      
      if (Array.isArray(data)) {
        // 완료된 작업을 맨 아래로 정렬
        const sortedData = data.sort((a: Task, b: Task) => {
          if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
          if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
          return 0;
        });
        setTasks(sortedData);
      } else {
        console.error('Expected array but got:', data);
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: 'IN_PROGRESS' | 'COMPLETED') => {
    try {
      const response = await apiRequest('PUT', `/api/tasks/${taskId}/status?status=${newStatus}`);
      if (response.ok) {
        if (newStatus === 'IN_PROGRESS') {
          setEditingTaskId(taskId);
        } else {
          setEditingTaskId(null);
        }
        // 작업 상태 업데이트 후 목록 재정렬
        setTasks(prevTasks => {
          const updatedTasks = prevTasks.map(task => 
            task.id === taskId ? { ...task, status: newStatus } : task
          );
          // 완료된 작업을 맨 아래로 이동
          return updatedTasks.sort((a, b) => {
            if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
            if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
            return 0;
          });
        });
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
      <div className="min-h-screen bg-blue-100 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container px-4 py-8 mx-auto"
        >
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
                      <TableRow 
                        key={task.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <TableCell className={`pl-6 text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700 ${
                          task.status === 'COMPLETED' && task.id !== editingTaskId ? 'line-through text-gray-500 dark:text-gray-400' : ''
                        }`}>{task.id}</TableCell>
                        <TableCell className={`pl-6 text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700 ${
                          task.status === 'COMPLETED' && task.id !== editingTaskId ? 'line-through text-gray-500 dark:text-gray-400' : ''
                        }`}>{task.title || 'N/A'}</TableCell>
                        <TableCell className={`pl-6 text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700 ${
                          task.status === 'COMPLETED' && task.id !== editingTaskId ? 'line-through text-gray-500 dark:text-gray-400' : ''
                        }`}>{task.detectionType || 'N/A'}</TableCell>
                        <TableCell className={`pl-6 text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700 ${
                          task.status === 'COMPLETED' && task.id !== editingTaskId ? 'line-through text-gray-500 dark:text-gray-400' : ''
                        }`}>{task.location || 'N/A'}</TableCell>
                        <TableCell className={`pl-6 text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700 ${
                          task.status === 'COMPLETED' && task.id !== editingTaskId ? 'line-through text-gray-500 dark:text-gray-400' : ''
                        }`}>
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
                                  : task.status === 'COMPLETED'
                                  ? 'bg-blue-400 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                                  : 'bg-gray-200 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700'
                              }`}
                              disabled={task.status === 'IN_PROGRESS'}
                            >
                              <Clock className="w-4 h-4" />
                              <span>{task.status === 'COMPLETED' ? '수정' : '진행중'}</span>
                            </Button>
                            <Button
                              onClick={() => handleStatusChange(task.id, 'COMPLETED')}
                              className={`flex items-center space-x-1 text-white rounded-xl ${
                                task.status === 'COMPLETED' 
                                  ? 'bg-green-500 hover:bg-green-400 dark:bg-emerald-500 dark:hover:bg-emerald-300' 
                                  : 'bg-green-500 hover:bg-green-400 dark:bg-emerald-500 dark:hover:bg-emerald-300'
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
      </div>
    </Layout>
  );
};

export default TasksPage;
