import React, { useEffect, useState } from 'react';
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/apiRequest";
import { useNavigate } from 'react-router-dom';

interface Incident {
  id: number;
  title: string;
  detectionType: string;
  confidence: number;
  location: string;
  timestamp: string;
  camera: {
    id: number;
    name: string;
    location: string;
  status: string;
    imageUrl: string;
  };
}

const fetchIncidents = async (setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>) => {
  try {
    const response = await apiRequest('GET', '/api/incidents');
    console.log('API Response:', response);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Parsed Data:', data);
    
    if (Array.isArray(data)) {
      const sortedData = [...data].sort((a, b) => b.id - a.id);
      setIncidents(sortedData);
    } else {
      console.error('Expected array but got:', data);
      setIncidents([]);
    }
  } catch (error: any) {
    console.error('Error fetching incidents:', error);
    setIncidents([]);
  }
};

const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleAssignToTask = async (incidentId: number) => {
    try {
      console.log('Assigning incident to task:', incidentId);
      const response = await apiRequest('POST', '/api/tasks/from-incident', { incidentId });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Task assignment failed:', errorText);
        throw new Error('Task assignment failed: ' + errorText);
      }

      alert('사건 접수 완료!');
      // 사건 목록에서 해당 사건 제거
      setIncidents(prevIncidents => prevIncidents.filter(inc => inc.id !== incidentId));
    } catch (error: any) {
      console.error('Error assigning task:', error);
      alert('할당 실패: ' + error.message);
    }
  };

  const handleReport = async (incidentId: number) => {
    try {
      const incident = incidents.find(inc => inc.id === incidentId);
      if (!incident) {
        console.error('Incident not found:', incidentId);
        return;
      }

      // task 생성
      const taskData = {
        incident: {
          id: incident.id
        },
        title: `사건 처리 - ${incidentId}`,
        status: 'IN_PROGRESS'
      };

      console.log('Creating task with data:', taskData);
      const taskResponse = await apiRequest('POST', '/api/tasks', taskData);
      
      if (!taskResponse.ok) {
        const errorText = await taskResponse.text();
        console.error('Task creation failed:', errorText);
        throw new Error('Task creation failed: ' + errorText);
      }

      // task 생성 성공 시 해당 사건 삭제
      console.log('Deleting incident:', incidentId);
      const deleteResponse = await apiRequest('DELETE', `/api/incidents/${incidentId}`);
      
      if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text();
        console.error('Incident deletion failed:', errorText);
        throw new Error('Incident deletion failed: ' + errorText);
      }

      // 사건 목록에서 해당 사건 제거
      setIncidents(prevIncidents => prevIncidents.filter(inc => inc.id !== incidentId));
      
      // tasks 페이지로 이동
      navigate('/tasks', { 
        state: { 
          incident: {
            id: incident.id,
            title: incident.title,
            detectionType: incident.detectionType,
            location: incident.location,
            timestamp: incident.timestamp
          }
        } 
      });
    } catch (error: any) {
      console.error('Error processing incident:', error);
      alert('사건 처리 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleDelete = async (incidentId: number) => {
    if (window.confirm('정말 이 사건을 삭제하시겠습니까?')) {
      try {
        const response = await apiRequest('DELETE', `/api/incidents/${incidentId}`);
        if (response.ok) {
          alert('사건이 삭제되었습니다.');
          fetchIncidents(setIncidents);
        }
      } catch (error) {
        console.error('Error deleting incident:', error);
        alert('사건 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  useEffect(() => {
    fetchIncidents(setIncidents);
    const interval = setInterval(() => fetchIncidents(setIncidents), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout title="사고 관리">
      <div className="min-h-screen bg-blue-100 dark:bg-gray-900">
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
                <AlertTriangle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">사고 관리</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">감지된 사고 정보를 확인합니다</p>
              </div>
            </motion.div>
          </div>

          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>사고 목록</CardTitle>
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
                      <TableHead className="pl-6 text-gray-900 border-b-2 border-gray-300 dark:text-gray-100 dark:border-gray-600">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incidents.map((incident) => (
                      <TableRow key={incident.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="pl-6 text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700">{incident.id}</TableCell>
                        <TableCell className="pl-6 text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700">{incident.title || 'N/A'}</TableCell>
                        <TableCell className="pl-6 text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700">{incident.detectionType || 'N/A'}</TableCell>
                        <TableCell className="pl-6 text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700">{incident.location || 'N/A'}</TableCell>
                        <TableCell className="pl-6 text-gray-900 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700">
                          {incident.timestamp ? new Date(incident.timestamp).toLocaleString() : 'N/A'}
                        </TableCell>
                        <TableCell className="pl-6 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="default"
                              onClick={() => handleAssignToTask(incident.id)}
                              className="text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl"
                            >
                              작업 할당
                            </Button>
                            <Button 
                              onClick={() => handleDelete(incident.id)}
                              className="flex items-center space-x-1 text-white bg-red-600 rounded-xl hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>삭제</span>
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

export default IncidentsPage;
