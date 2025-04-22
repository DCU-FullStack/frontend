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
  
  
}
