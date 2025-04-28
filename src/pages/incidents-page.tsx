import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Incident {
  id: number;
  title: string;
  description: string;
  location: string;
  severity: string;
  status: string;
  createdAt: string | Date;
}

type SeverityBadgeProps = {
  severity: string;
};

const SeverityBadge = ({ severity }: SeverityBadgeProps) => {
  let variant: "outline" | "secondary" | "destructive" | "default" = "outline";
  
  switch (severity) {
    case "긴급":
      variant = "destructive";
      break;
    case "경고":
      variant = "default";
      break;
    case "정보":
      variant = "secondary";
      break;
  }
  
  return <Badge variant={variant}>{severity}</Badge>;
};

export default function IncidentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: incidents = [], isLoading, error } = useQuery({
    queryKey: ["incidents"],
    queryFn: getQueryFn()("/api/v1/incidents"),
  });

  const filteredIncidents = (incidents || []).filter((incident: Incident) => {
    return searchQuery === "" || 
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <Layout title="사고 관리">
      <div className="px-4 py-8">
        <div className="mb-8">
          <h1 className="flex items-center text-2xl font-bold text-gray-800 dark:text-white">
            <AlertTriangle className="w-6 h-6 mr-2 text-amber-500" />
            이상 보고
          </h1>
          <p className="text-gray-600 dark:text-gray-400">도로 이상 상황 알림</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center w-full max-w-2xl gap-2 mx-auto">
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                className="w-full bg-gray-100 border-gray-200 rounded-full shadow-inner dark:bg-dark-700 dark:border-dark-600 pl-9 h-9 focus:shadow-none"
                placeholder="제목, 설명 또는 위치로 검색"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="py-8 text-center">로딩 중...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              데이터를 불러오는 중 오류가 발생했습니다.
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              검색 결과가 없습니다.
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredIncidents.map((incident: Incident) => (
                <AccordionItem
                  key={incident.id}
                  value={incident.id.toString()}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-dark-800 dark:border-dark-700"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <SeverityBadge severity={incident.severity} />
                        <span className="font-medium dark:text-white">{incident.title}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{format(new Date(incident.createdAt), 'yyyy-MM-dd HH:mm')}</span>
                        <Badge variant="outline">{incident.status}</Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 border-t border-gray-200 dark:border-dark-700">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">설명</h3>
                        <p className="mt-1 text-gray-700 dark:text-gray-300">{incident.description}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">위치</h3>
                        <p className="mt-1 text-gray-700 dark:text-gray-300">{incident.location}</p>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">상세보기</Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </Layout>
  );
}
