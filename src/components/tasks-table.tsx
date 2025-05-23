import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from "@/shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

type StatusBadgeProps = {
  status: string;
};

type TasksFilterState = "전체" | "할당됨" | "완료";

export function TasksTable() {
  const [filter, setFilter] = useState<TasksFilterState>("전체");
  const { data: tasks, isLoading, error } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const filteredTasks = tasks?.filter(task => {
    if (filter === "전체") return true;
    if (filter === "할당됨") return task.status !== "완료됨";
    if (filter === "완료") return task.status === "완료됨";
    return true;
  });

  

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">오늘의 작업</CardTitle>
          
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>작업명</TableHead>
                <TableHead>위치</TableHead>
                <TableHead>날짜/시간</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(3)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-8 h-8 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[80px] rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-4 text-center text-red-500">
                    작업 데이터를 불러오는 중 오류가 발생했습니다.
                  </TableCell>
                </TableRow>
              ) : filteredTasks && filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground">{task.description}</div>
                    </TableCell>
                    <TableCell>{task.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center w-8 h-8 text-indigo-800 bg-indigo-100 rounded-full">
                        <span className="text-xs font-medium">{task.assignedTo || "미배정"}</span>
                      </div>
                    </TableCell>
                    
                    
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-4 text-center text-gray-500">
                    작업이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
