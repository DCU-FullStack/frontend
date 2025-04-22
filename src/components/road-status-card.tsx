import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type StatusItemProps = {
  color: string;
  label: string;
  percentage: number;
};

const StatusItem = ({ color, label, percentage }: StatusItemProps) => (
  <div className="flex items-center justify-between border-b pb-2">
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <span className="font-medium">{percentage}%</span>
  </div>
);

export function RoadStatusCard() {
  
}
