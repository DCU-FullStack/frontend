import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 샘플 데이터 - 일반적으로 API에서 가져올 데이터
const trafficData = [
  { name: "월요일", 차량수: 4000, 사고: 24 },
  { name: "화요일", 차량수: 3000, 사고: 13 },
  { name: "수요일", 차량수: 2000, 사고: 18 },
  { name: "목요일", 차량수: 2780, 사고: 22 },
  { name: "금요일", 차량수: 4890, 사고: 35 },
  { name: "토요일", 차량수: 3390, 사고: 30 },
  { name: "일요일", 차량수: 2490, 사고: 21 },
];

const anomalyData = [
  { name: "포트홀", value: 35 },
  { name: "균열", value: 28 },
  { name: "파손", value: 17 },
  { name: "수해", value: 8 },
  { name: "낙하물", value: 12 },
];

const monthlyData = [
  { name: "1월", 차량수: 4000, 사고: 24, 이상감지: 40 },
  { name: "2월", 차량수: 3500, 사고: 20, 이상감지: 35 },
  { name: "3월", 차량수: 4500, 사고: 26, 이상감지: 45 },
  { name: "4월", 차량수: 5000, 사고: 30, 이상감지: 50 },
  { name: "5월", 차량수: 4800, 사고: 27, 이상감지: 48 },
  { name: "6월", 차량수: 4300, 사고: 25, 이상감지: 43 },
  { name: "7월", 차량수: 4200, 사고: 24, 이상감지: 42 },
  { name: "8월", 차량수: 4600, 사고: 28, 이상감지: 46 },
  { name: "9월", 차량수: 5200, 사고: 32, 이상감지: 52 },
  { name: "10월", 차량수: 5100, 사고: 31, 이상감지: 51 },
  { name: "11월", 차량수: 4700, 사고: 29, 이상감지: 47 },
  { name: "12월", 차량수: 4900, 사고: 30, 이상감지: 49 },
];

const timeOfDayData = [
  { name: "00-03", 차량수: 500, 사고: 5 },
  { name: "03-06", 차량수: 300, 사고: 3 },
  { name: "06-09", 차량수: 2000, 사고: 18 },
  { name: "09-12", 차량수: 2500, 사고: 12 },
  { name: "12-15", 차량수: 2300, 사고: 10 },
  { name: "15-18", 차량수: 3000, 사고: 25 },
  { name: "18-21", 차량수: 2200, 사고: 20 },
  { name: "21-24", 차량수: 1000, 사고: 8 },
];

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {sidebarOpen && <Sidebar />}
      
      <main className="flex-1 overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />
        
        <div className="px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">데이터 분석</h1>
            <p className="text-gray-600">도로 상황 및 이상 감지에 대한 상세 분석</p>
          </div>
          
          <Tabs defaultValue="traffic" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="traffic">교통 현황</TabsTrigger>
              <TabsTrigger value="anomalies">이상 감지</TabsTrigger>
              <TabsTrigger value="trends">월별 추세</TabsTrigger>
              <TabsTrigger value="time">시간대별 분석</TabsTrigger>
            </TabsList>
            
            <TabsContent value="traffic">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>일별 교통량</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trafficData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="차량수" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>일별 사고 발생</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trafficData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="사고" stroke="#ff7300" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="anomalies">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>이상 유형 분포</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={anomalyData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          />
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>이상 감지 통계</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">총 감지 이상</h3>
                        <div className="text-3xl font-bold">127건</div>
                        <p className="text-sm text-gray-500">전월 대비 +12%</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">심각도 분포</h3>
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between items-center">
                            <span>긴급</span>
                            <span className="text-red-500 font-medium">23건</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "18%" }}></div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span>경고</span>
                            <span className="text-amber-500 font-medium">47건</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "37%" }}></div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span>정보</span>
                            <span className="text-blue-500 font-medium">57건</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "45%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>월별 추세 분석</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="차량수" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="사고" stroke="#ff7300" />
                        <Line type="monotone" dataKey="이상감지" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="time">
              <Card>
                <CardHeader>
                  <CardTitle>시간대별 교통 분석</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timeOfDayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="차량수" stroke="#8884d8" fill="#8884d8" />
                        <Area type="monotone" dataKey="사고" stroke="#ff7300" fill="#ff7300" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>위험도 높은 구간</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">서울외곽순환고속도로 23KM</p>
                      <p className="text-sm text-gray-500">포트홀, 균열 다수</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">위험</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">경부고속도로 127KM</p>
                      <p className="text-sm text-gray-500">노면 파손</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">주의</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">영동고속도로 56KM</p>
                      <p className="text-sm text-gray-500">도로 균열</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">주의</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>필요 보수 작업</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">포트홀 보수 작업</p>
                      <p className="text-sm text-gray-500">17건 대기중</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">진행중</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">도로 표면 재포장</p>
                      <p className="text-sm text-gray-500">8건 대기중</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">예정</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">배수로 정비</p>
                      <p className="text-sm text-gray-500">12건 대기중</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">완료</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>이상 감지 추이</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>전체 감지 대비 조치율</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>전월 대비 이상 감소율</span>
                      <span>12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "12%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>CCTV 이상 감지 정확도</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}