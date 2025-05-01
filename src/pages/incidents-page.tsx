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
import { motion } from "framer-motion";

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
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle className="w-8 h-8 text-amber-500 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">사고 관리</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">도로 이상 상황을 모니터링하고 관리합니다</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center w-full max-w-2xl gap-2 mx-auto">
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                className="w-full pl-10 bg-white border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl h-11 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
                placeholder="제목, 설명 또는 위치로 검색"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-amber-500"></div>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500 dark:text-red-400">
              데이터를 불러오는 중 오류가 발생했습니다.
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full dark:bg-gray-800">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredIncidents.map((incident: Incident, index: number) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <AccordionItem
                    value={incident.id.toString()}
                    className="transition-shadow bg-white border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:shadow-md"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <SeverityBadge severity={incident.severity} />
                          <span className="font-medium text-gray-900 dark:text-white">{incident.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            {format(new Date(incident.createdAt), 'yyyy-MM-dd HH:mm')}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`${
                              incident.status === '진행중' ? 'border-amber-500 text-amber-500' :
                              incident.status === '해결됨' ? 'border-green-500 text-green-500' :
                              'border-gray-500 text-gray-500'
                            }`}
                          >
                            {incident.status}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">설명</h3>
                          <p className="mt-2 text-gray-700 dark:text-gray-300">{incident.description}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">위치</h3>
                          <p className="mt-2 text-gray-700 dark:text-gray-300">{incident.location}</p>
                        </div>
                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="rounded-xl border-amber-500 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                          >
                            상세보기
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          )}
        </motion.div>
      </motion.div>
    </Layout>
  );
}
