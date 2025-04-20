import { z } from "zod";

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  name: z.string(),
});

export type User = z.infer<typeof insertUserSchema> & {
  id: number;
  email: string;
};

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  location: z.string(),
  assignedTo: z.string().optional(),
  status: z.string(),
  dueDate: z.string().optional(),
});

export type Task = z.infer<typeof taskSchema> & {
  id: number;
  assignedTo: number;
  dueDate?: Date;
};

export interface Incident {
  id: number;
  title: string;
  description: string;
  location: string;
  severity: "정보" | "경고" | "긴급";
  status: "접수" | "처리 중" | "완료";
  createdAt: Date;
}

export interface Camera {
  id: number;
  name: string;
  location: string;
  status: "온라인" | "오프라인" | "유지보수";
  imageUrl: string;
} 