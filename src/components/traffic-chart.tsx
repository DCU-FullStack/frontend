import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TimeOption = "오늘" | "이번 주" | "이번 달";

const trafficData = {
  "오늘": [
    { time: "06:00", value: 10 },
    { time: "09:00", value: 24 },
    { time: "12:00", value: 16 },
    { time: "15:00", value: 32 },
    { time: "18:00", value: 48 },
    { time: "21:00", value: 36 },
    { time: "00:00", value: 20 },
  ],
  "이번 주": [
    { time: "월", value: 20 },
    { time: "화", value: 32 },
    { time: "수", value: 28 },
    { time: "목", value: 40 },
    { time: "금", value: 45 },
    { time: "토", value: 30 },
    { time: "일", value: 15 },
  ],
  "이번 달": [
    { time: "1주", value: 25 },
    { time: "2주", value: 35 },
    { time: "3주", value: 30 },
    { time: "4주", value: 45 },
  ]
};

export function TrafficChart() {
  const [timeOption, setTimeOption] = useState<TimeOption>("오늘");
  const currentData = trafficData[timeOption];
  
  // Find max value for scaling
  const maxValue = Math.max(...currentData.map(item => item.value));
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-800">교통량 추이</CardTitle>
          <Select
            value={timeOption}
            onValueChange={(value) => setTimeOption(value as TimeOption)}
          >
            <SelectTrigger className="w-24 h-8 text-sm">
              <SelectValue placeholder="기간 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="오늘">오늘</SelectItem>
              <SelectItem value="이번 주">이번 주</SelectItem>
              <SelectItem value="이번 달">이번 달</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48 flex items-end justify-between">
          {currentData.map((item, index) => (
            <div
              key={index}
              className="w-8 bg-primary rounded-t"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            ></div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {currentData.map((item, index) => (
            <span key={index}>{item.time}</span>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>오늘 최대 교통량: <span className="font-semibold">18:00 (2,340대)</span></p>
          <p className="mt-1">평균 대비: <span className="font-semibold text-green-600">+12%</span></p>
        </div>
      </CardContent>
    </Card>
  );
}
