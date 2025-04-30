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
import { Search, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string | Date;
  assignedTo: string;
}

type StatusBadgeProps = {
  status: string;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let variant: "outline" | "secondary" | "destructive" | "default" = "outline";
  let icon = <Clock className="w-4 h-4" />;
  
  switch (status) {
    case "완료":
      variant = "default";
      icon = <CheckCircle2 className="w-4 h-4" />;
      break;
    case "진행중":
      variant = "secondary";
      icon = <Clock className="w-4 h-4" />;
      break;
    case "지연":
      variant = "destructive";
      icon = <AlertCircle className="w-4 h-4" />;
      break;
  }
  
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      {icon}
      {status}
    </Badge>
  );
};

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getQueryFn()("/api/v1/tasks"),
  });

  const filteredTasks = (tasks || []).filter((task: Task) => {
    return searchQuery === "" || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <Layout title="작업 관리">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">작업 관리</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">작업 현황을 모니터링하고 관리합니다</p>
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
                className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm pl-10 h-11 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                placeholder="제목, 설명 또는 담당자로 검색"
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500 dark:text-red-400">
              데이터를 불러오는 중 오류가 발생했습니다.
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredTasks.map((task: Task, index: number) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <AccordionItem
                    value={task.id.toString()}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <Badge 
                            variant="outline" 
                            className={`${
                              task.priority === '높음' ? 'border-red-500 text-red-500' :
                              task.priority === '중간' ? 'border-amber-500 text-amber-500' :
                              'border-green-500 text-green-500'
                            }`}
                          >
                            {task.priority}
                          </Badge>
                          <span className="font-medium text-gray-900 dark:text-white">{task.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            {format(new Date(task.dueDate), 'yyyy-MM-dd')}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`${
                              task.status === '진행중' ? 'border-amber-500 text-amber-500' :
                              task.status === '완료됨' ? 'border-green-500 text-green-500' :
                              'border-gray-500 text-gray-500'
                            }`}
                          >
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">설명</h3>
                          <p className="mt-2 text-gray-700 dark:text-gray-300">{task.description}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">담당자</h3>
                          <p className="mt-2 text-gray-700 dark:text-gray-300">{task.assignedTo}</p>
                        </div>
                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="rounded-xl border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
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
