import { z } from "zod";

export const loginUserSchema = z.object({
  username: z.string().min(1, "아이디를 입력하세요"),
  password: z.string().min(1, "비밀번호를 입력하세요"),
});

export const registerUserSchema = z.object({
  username: z
    .string()
    .min(4, "아이디는 4자 이상이어야 합니다")
    .max(20, "아이디는 20자 이하여야 합니다")
    .regex(/^[a-zA-Z0-9]+$/, "아이디는 영문과 숫자만 사용할 수 있습니다"),
  password: z
    .string()
    .min(6, "비밀번호는 6자 이상이어야 합니다")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/,
      "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다"
    ),
  confirmPassword: z.string().min(1, "비밀번호 확인을 입력하세요"),
  name: z.string().min(1, "이름을 입력하세요"),
  email: z
    .string()
    .min(1, "이메일을 입력하세요")
    .email("올바른 이메일 형식이 아닙니다"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>; 