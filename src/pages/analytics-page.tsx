import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
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
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// 샘플 데이터 - 일반적으로 API에서 가져올 데이터
const trafficData = [
  { name: "20년", 차량수: 10478, 사고: 1014 },
  { name: "21년", 차량수: 10849, 사고: 1089 },
  { name: "22년", 차량수: 10728, 사고: 1055 },
  { name: "23년", 차량수: 11071, 사고: 1247 },
  { name: "24년", 차량수: 10976, 사고: 1222 },
];
const ANOMALY_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4"
];

const anomalyData = [
  { name: "바위", value: 6, fill: "#FF6B6B" },
  { name: "타이어", value: 6, fill: "#4ECDC4" },
  { name: "싱크홀", value: 12, fill: "#45B7D1" },
  { name: "동물", value: 76, fill: "#96CEB4" }
];

const monthlyData = [
  { name: "20년", 사고: 1014, 이상감지: 1056 },
  { name: "21년", 사고: 1089, 이상감지: 1131 },
  { name: "22년", 사고: 1055, 이상감지: 1097 },
  { name: "23년", 사고: 1247, 이상감지: 1289 },
  { name: "24년", 사고: 1222, 이상감지: 1264 },
];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // 다크모드에 맞는 차트 스타일 설정
  const textColor = isDarkMode ? "#e5e7eb" : "#666";
  const gridColor = isDarkMode ? "#374151" : "#f0f0f0";
  const tooltipBgColor = isDarkMode ? "rgba(31, 41, 55, 0.9)" : "rgba(255, 255, 255, 0.9)";
  const tooltipTextColor = isDarkMode ? "#e5e7eb" : "#333";
  const tooltipItemColor = isDarkMode ? "#a5b4fc" : "#8884d8";

  return (
    <Layout title="데이터 분석">
      <div className="px-4 py-6">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">데이터 분석</h1>
          <p className="text-gray-600 dark:text-gray-400">도로 상황 및 이상 감지에 대한 상세 분석</p>
        </div>
        
        <Tabs defaultValue="traffic" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="traffic">교통 현황</TabsTrigger>
            <TabsTrigger value="anomalies">이상 감지</TabsTrigger>
            <TabsTrigger value="trends">년도별 추세</TabsTrigger>
          </TabsList>
          
          <TabsContent value="traffic">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">년도별 교통량</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trafficData}>
                        <defs>
                          <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: textColor }}
                          axisLine={{ stroke: isDarkMode ? '#4b5563' : '#ccc' }}
                        />
                        <YAxis 
                          domain={[10000, 12000]} 
                          tick={{ fill: textColor }}
                          axisLine={{ stroke: isDarkMode ? '#4b5563' : '#ccc' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: tooltipBgColor,
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            padding: '12px',
                            color: tooltipTextColor
                          }}
                          labelStyle={{ color: tooltipTextColor, fontWeight: 'bold' }}
                          itemStyle={{ color: tooltipItemColor }}
                        />
                        <Legend 
                          wrapperStyle={{
                            paddingTop: '20px',
                            color: textColor
                          }}
                        />
                        <Bar 
                          dataKey="차량수" 
                          fill="url(#colorTraffic)"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                          animationBegin={0}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">년도별 사고 발생</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trafficData}>
                        <defs>
                          <linearGradient id="colorAccident" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ff7300" stopOpacity={0.2}/>
                          </linearGradient>
                          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                            <feOffset dx="2" dy="2" result="offsetblur" />
                            <feComponentTransfer>
                              <feFuncA type="linear" slope="0.3"/>
                            </feComponentTransfer>
                            <feMerge>
                              <feMergeNode/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={gridColor} 
                          vertical={false}
                        />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: textColor, fontSize: 12 }}
                          axisLine={{ stroke: isDarkMode ? '#4b5563' : '#ccc' }}
                          tickLine={false}
                          padding={{ left: 20, right: 20 }}
                        />
                        <YAxis 
                          domain={[1000, 1300]} 
                          tick={{ fill: textColor, fontSize: 12 }}
                          axisLine={{ stroke: isDarkMode ? '#4b5563' : '#ccc' }}
                          tickLine={false}
                          tickFormatter={(value) => `${value.toLocaleString()}건`}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: tooltipBgColor,
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            padding: '12px 16px',
                            color: tooltipTextColor
                          }}
                          labelStyle={{ 
                            color: tooltipTextColor, 
                            fontWeight: 'bold',
                            fontSize: '14px',
                            marginBottom: '4px'
                          }}
                          itemStyle={{ 
                            color: isDarkMode ? '#f97316' : '#ff7300',
                            fontSize: '13px',
                            padding: '4px 0'
                          }}
                          formatter={(value) => [`${value}건`, '사고 발생']}
                        />
                        <Legend 
                          wrapperStyle={{
                            paddingTop: '20px',
                            fontSize: '12px',
                            color: textColor
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="사고" 
                          stroke="url(#colorAccident)"
                          strokeWidth={3}
                          dot={{ 
                            r: 6, 
                            fill: '#ff7300',
                            stroke: isDarkMode ? '#1f2937' : '#fff',
                            strokeWidth: 2,
                            filter: 'url(#shadow)'
                          }}
                          activeDot={{ 
                            r: 8, 
                            fill: '#ff7300',
                            stroke: isDarkMode ? '#1f2937' : '#fff',
                            strokeWidth: 2,
                            filter: 'url(#shadow)'
                          }}
                          animationDuration={1500}
                          animationBegin={0}
                          style={{ filter: 'url(#shadow)' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="anomalies">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">이상 유형 분포</CardTitle>
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
                          dataKey="value"
                          labelStyle={{ fill: textColor }}
                        >
                          {anomalyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: tooltipBgColor,
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            padding: '12px',
                            color: tooltipTextColor
                          }}
                        />
                        <Legend 
                          wrapperStyle={{
                            color: textColor
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">년도별 작업 통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-2 text-lg font-medium dark:text-white">총 작업 수</h3>
                      <div className="text-3xl font-bold dark:text-white">1364건</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">전년 대비 +12%</p>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 text-lg font-medium dark:text-white">작업 유형 분포</h3>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="dark:text-gray-300">싱크홀</span>
                          <span className="font-medium text-red-500 dark:text-red-400">211건</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "13%" }}></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="dark:text-gray-300">타이어</span>
                          <span className="font-medium text-amber-500 dark:text-amber-400">49건</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "3%" }}></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="dark:text-gray-300">바위</span>
                          <span className="font-medium text-blue-500 dark:text-blue-400">53건</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "3%" }}></div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="dark:text-gray-300">동물</span>
                          <span className="font-medium text-amber-500 dark:text-amber-400">1041건</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div className="bg-amber-300 h-2.5 rounded-full" style={{ width: "68%" }}></div>
                        </div>

                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">년도별 추세 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: textColor }}
                        axisLine={{ stroke: isDarkMode ? '#4b5563' : '#ccc' }}
                      />
                      <YAxis 
                        domain={[500, 1500]} 
                        tick={{ fill: textColor }}
                        axisLine={{ stroke: isDarkMode ? '#4b5563' : '#ccc' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: tooltipBgColor,
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          padding: '12px',
                          color: tooltipTextColor
                        }}
                      />
                      <Legend 
                        wrapperStyle={{
                          color: textColor
                        }}
                      />
                      <Line type="monotone" dataKey="사고" stroke="#ff7300" />
                      <Line type="monotone" dataKey="이상감지" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          
        </Tabs>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">사고 다발 구역</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">경부선 서울방향 364.6km 지점</p>
                  </div>
                  <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">싱크홀🕳</span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">중부내륙선 양평방향 28.9km 지점</p>
                  </div>
                  <span className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-200">로드킬🦌</span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">중앙선 부산방향 7.4km 지점</p>
                  </div>
                  <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-200">바위🪨</span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">남해선 순천방향 124.5km 지점</p>
                  </div>
                  <span className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-200">로드킬🦌</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">실시간 주행 방해 요소</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">도로 위 낙하물📦</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">낙하물로 인한 급제동 사고 주의!</p>
                  </div>
                  <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">🚨5건</span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">로드킬🦌</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">주행 시 감속 주의!</p>
                  </div>
                  <span className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-200">🚨2건</span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">장애물/파손 가드레일🚧</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">주행 시 차선 이탈 주의!</p>
                  </div>
                  <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-200">🚨1건</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">시간대별 사고 비율</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="dark:text-gray-300">출근/주간(06~14시)</span>
                    <span className="dark:text-white">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-black dark:bg-white h-2.5 rounded-full" style={{ width: "26.7%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="dark:text-gray-300">퇴근/야간(14시~22시)</span>
                    <span className="dark:text-white">50%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "50%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="dark:text-gray-300">심야/새벽(22~06시)</span>
                    <span className="dark:text-white">22%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "22%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}