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
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-800">현재 도로 상태</CardTitle>
          <Button variant="link" className="text-sm p-0 h-auto">자세히 보기</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatusItem color="bg-green-500" label="정상 운영 구간" percentage={87} />
        <StatusItem color="bg-yellow-500" label="경고 구간" percentage={10} />
        <StatusItem color="bg-red-500" label="위험 구간" percentage={3} />
      </CardContent>
    </Card>
  );
}
