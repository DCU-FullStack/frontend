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

  
}
