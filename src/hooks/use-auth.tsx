import { createContext, ReactNode, useContext, useState, useEffect, useMemo } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, type User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

// API 응답 타입 정의
interface ApiResponse<T> {
  success: boolean;
  user: T;
  message?: string;
}

// Create improved User schema with validation
const registerUserSchema = z.object({
  username: z.string().min(1, "아이디를 입력해주세요"),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
  confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
  email: z.string().email("올바른 이메일을 입력해주세요"),
  phoneNumber: z.string().min(1, "전화번호를 입력해주세요"),
  name: z.string().min(1, "이름을 입력해주세요"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

// Login schema with just username & password
const loginUserSchema = z.object({
  username: z.string().min(1, "아이디를 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("올바른 이메일을 입력해주세요"),
});

// 비밀번호 변경 스키마
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요"),
  newPassword: z.string().min(6, "새 비밀번호는 6자 이상이어야 합니다"),
  confirmNewPassword: z.string().min(1, "새 비밀번호 확인을 입력해주세요"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "새 비밀번호가 일치하지 않습니다",
  path: ["confirmNewPassword"],
});

// 계정 삭제 스키마
const deleteAccountSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type User = {
  id: number;
  username: string;
  email: string;
  name: string;
  phoneNumber?: string;
  role: 'USER' | 'ADMIN';
};

type AuthContextType = {
  user: Omit<User, "password"> | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<Omit<User, "password">, Error, z.infer<typeof loginUserSchema>>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<Omit<User, "password">, Error, z.infer<typeof registerUserSchema>>;
  resetPasswordMutation: UseMutationResult<void, Error, z.infer<typeof resetPasswordSchema>>;
  changePasswordMutation: UseMutationResult<void, Error, z.infer<typeof changePasswordSchema>>;
  deleteAccountMutation: UseMutationResult<void, Error, z.infer<typeof deleteAccountSchema>>;
  isAdmin: boolean;
};

type RegisterData = z.infer<typeof registerUserSchema>;
type LoginData = z.infer<typeof loginUserSchema>;
type ChangePasswordData = z.infer<typeof changePasswordSchema>;
type DeleteAccountData = z.infer<typeof deleteAccountSchema>;

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 로컬 스토리지에서 사용자 정보 확인
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        // 서버에서 사용자 정보 확인
        const response = await api.get<ApiResponse<Omit<User, "password">>>('/auth/me');
        if (response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post<ApiResponse<Omit<User, "password">>>('/auth/login', data);
      return response.data.user;
    },
    onSuccess: (userData) => {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast({
        title: "로그인 성공",
        description: `${userData.name}님 환영합니다!`,
      });
      navigate('/');
    },
    onError: (error) => {
      console.error('Login failed:', error);
      toast({
        title: "로그인 실패", 
        description: "로그인에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      try {
        // Transform the data to match backend field names
        const transformedData = {
          ...data,
          phone_number: data.phoneNumber,
        };
        delete transformedData.phoneNumber;
        
        const response = await api.post<ApiResponse<Omit<User, "password">>>('/auth/register', transformedData);
        if (!response.data.success) {
          throw new Error(response.data.message || "회원가입에 실패했습니다.");
        }
        if (!response.data.user) {
          throw new Error("회원가입 응답에 사용자 정보가 없습니다.");
        }
        setUser(response.data.user);
        toast({
          title: "회원가입 성공",
          description: `${response.data.user.name}님 환영합니다!`,
          className: "bg-green-500 text-white",
        });
        return response.data.user;
      } catch (error: any) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error(error.message || "회원가입에 실패했습니다.");
      }
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "회원가입 실패",
        description: error.message,
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        // API 호출 시도
        await api.post('/auth/logout');
      } catch (error: any) {
        console.error("Logout API error:", error);
        // API 오류가 발생해도 계속 진행
      } finally {
        // 항상 로컬 상태 초기화
        setUser(null);
        toast({
          title: "로그아웃 성공",
          description: "성공적으로 로그아웃되었습니다.",
        });
      }
    },
    onError: (error: Error) => {
      setError(error);
      // 오류가 발생해도 로컬 상태는 초기화
      setUser(null);
      toast({
        title: "로그아웃 처리 중 오류 발생",
        description: "로그아웃되었지만 서버와의 통신 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: z.infer<typeof resetPasswordSchema>) => {
      try {
        const response = await api.post<ApiResponse<void>>('/auth/reset-password', data);
        if (!response.data.success) {
          throw new Error(response.data.message || "비밀번호 재설정에 실패했습니다.");
        }
        toast({
          title: "비밀번호 재설정",
          description: "비밀번호 재설정 링크가 이메일로 전송되었습니다.",
        });
      } catch (error: any) {
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || "비밀번호 재설정에 실패했습니다.");
        }
        throw new Error("비밀번호 재설정에 실패했습니다.");
      }
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "비밀번호 재설정 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      try {
        const { confirmNewPassword, ...credentials } = data;
        const response = await api.post<ApiResponse<void>>('/auth/change-password', credentials);
        if (!response.data.success) {
          throw new Error(response.data.message || "비밀번호 변경에 실패했습니다.");
        }
        toast({
          title: "비밀번호 변경 성공",
          description: "비밀번호가 성공적으로 변경되었습니다.",
        });
      } catch (error: any) {
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || "비밀번호 변경에 실패했습니다.");
        }
        throw new Error("비밀번호 변경에 실패했습니다.");
      }
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "비밀번호 변경 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (data: DeleteAccountData) => {
      try {
        const response = await api.post<ApiResponse<void>>('/auth/delete-account', data);
        if (!response.data.success) {
          throw new Error(response.data.message || "계정 삭제에 실패했습니다.");
        }
        setUser(null);
        toast({
          title: "계정 삭제 성공",
          description: "계정이 성공적으로 삭제되었습니다.",
        });
      } catch (error: any) {
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || "계정 삭제에 실패했습니다.");
        }
        throw new Error("계정 삭제에 실패했습니다.");
      }
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "계정 삭제 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isAdmin = useMemo(() => user?.role === 'ADMIN', [user?.role]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        resetPasswordMutation,
        changePasswordMutation,
        deleteAccountMutation,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export type { RegisterData, LoginData, ChangePasswordData, DeleteAccountData };
export { registerUserSchema, loginUserSchema, resetPasswordSchema, changePasswordSchema, deleteAccountSchema };
