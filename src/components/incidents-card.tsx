import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Incident } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

function formatTimeAgo(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
}

type IncidentItemProps = {
  incident: Incident;
};

const IncidentItem = ({ incident }: IncidentItemProps) => {
  const navigate = useNavigate();
  const badgeVariant = incident.severity === "긴급" ? "destructive" : "default";
  const reportedDate = new Date(incident.createdAt);
  
  return (
    <div className="pb-3 border-b">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-gray-800">{incident.title}</h4>
          <p className="mt-1 text-sm text-gray-600">{incident.location}</p>
        </div>
        <Badge variant={badgeVariant}>{incident.severity}</Badge>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-500">{formatTimeAgo(reportedDate)}</p>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs"
          onClick={() => navigate(`/incidents/${incident.id}`)}
        >
          자세히 보기
        </Button>
      </div>
    </div>
  );
};

export function IncidentsCard() {
  const navigate = useNavigate();
  const { data: incidents, isLoading, error } = useQuery<Incident[]>({
    queryKey: ["/api/incidents"],
    queryFn: async () => {
      const response = await fetch("/api/incidents");
      return response.json();
    },
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">최근 이상 징후</CardTitle>
          <Button 
            variant="link" 
            className="h-auto p-0 text-sm"
            onClick={() => navigate("/incidents")}
          >
            모두 보기
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <div className="pb-3 space-y-2 border-b">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-5 w-[60px] rounded-full" />
              </div>
              <Skeleton className="h-3 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
            <div className="pb-3 space-y-2 border-b">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[180px]" />
                <Skeleton className="h-5 w-[60px] rounded-full" />
              </div>
              <Skeleton className="h-3 w-[170px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[190px]" />
                <Skeleton className="h-5 w-[60px] rounded-full" />
              </div>
              <Skeleton className="h-3 w-[160px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </>
        ) : error ? (
          <div className="py-4 text-center text-red-500">
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        ) : incidents && incidents.length > 0 ? (
          <>
            {incidents.slice(0, 3).map((incident) => (
              <IncidentItem key={incident.id} incident={incident} />
            ))}
            {incidents.length > 3 && (
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate("/incidents")}
              >
                더 보기
              </Button>
            )}
          </>
        ) : (
          <div className="py-4 text-center text-gray-500">
            현재 보고된 이상 징후가 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
