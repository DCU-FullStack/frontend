import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  useAuth,
  registerUserSchema,
  loginUserSchema,
  resetPasswordSchema
} from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Home } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/theme-context";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, loginMutation, registerMutation, resetPasswordMutation } = useAuth();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { theme } = useTheme();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const loginForm = useForm({
    resolver: zodResolver(loginUserSchema),
    defaultValues: { username: "", password: "" }
  });

  const registerForm = useForm({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      email: "",
      phoneNumber: ""
    }
  });

  const resetPasswordForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" }
  });

  const onLoginSubmit = async (data: z.infer<typeof loginUserSchema>) => {
    try {
      await loginMutation.mutateAsync(data);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const onRegisterSubmit = async (data: z.infer<typeof registerUserSchema>) => {
    try {
      await registerMutation.mutateAsync(data);
      setActiveTab("login");
      loginForm.reset();
      toast.success("회원가입이 완료되었습니다. 로그인해주세요.");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const onResetPasswordSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      await resetPasswordMutation.mutateAsync(data);
      setShowResetDialog(false);
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* 좌측 배경 */}
      <div className="flex flex-col items-center justify-center w-1/2 p-8 text-white bg-center bg-cover" style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=1374&auto=format&fit=crop')",
      }}>
        <div className="p-8 text-center bg-black/60 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 13l4 4L19 7" />
          </svg>
          <h1 className="text-2xl font-bold">스마트 도로 이상감지 시스템</h1>
          <p className="mt-2 text-sm text-white/70"></p>
          <div className="mt-6">
            <Link to="/" className="inline-flex items-center text-white hover:text-primary">
              <Home className="w-5 h-5 mr-2" /> 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      {/* 우측 탭 영역 */}
      <div className="flex items-center justify-center w-1/2 px-4 bg-white dark:bg-gray-800">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
          <TabsList className="grid grid-cols-2 mb-6 overflow-hidden bg-transparent border border-gray-300 rounded-full dark:border-gray-600">
            <TabsTrigger 
              value="login" 
              className="text-black dark:text-white data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black transition rounded-xl"
            >
              로그인
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="text-black dark:text-white data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black transition rounded-xl"
            >
              회원가입
            </TabsTrigger>
          </TabsList>

          {/* 로그인 */}
          <TabsContent value="login">
            <Card className="bg-white border-0 shadow-md dark:bg-gray-800 rounded-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center dark:text-white">스마트 도로 이상감지 시스템</CardTitle>
                <CardDescription className="text-center dark:text-gray-400">로그인 정보를 입력하여 시스템에 접속하세요.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="login-username" className="dark:text-gray-200">ID</Label>
                    <Input 
                      id="login-username" 
                      placeholder="아이디를 입력하세요" 
                      {...loginForm.register("username")} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password" className="dark:text-gray-200">Password</Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      placeholder="비밀번호를 입력하세요" 
                      {...loginForm.register("password")} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" className="dark:border-gray-600" />
                      <Label htmlFor="remember" className="text-sm dark:text-gray-300">로그인 상태 유지</Label>
                    </div>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="px-0 text-sm dark:text-gray-300" 
                      onClick={() => setShowResetDialog(true)}
                    >
                      비밀번호 찾기
                    </Button>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full text-white bg-black dark:bg-white dark:text-black rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending && (
                      <Loader2 rounded-xl className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    로그인
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 회원가입 */}
          <TabsContent value="register">
            <Card className="bg-white border-0 shadow-md dark:bg-gray-800 rounded-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center rounded-xl dark:text-white">회원가입</CardTitle>
                <CardDescription className="text-center dark:text-gray-400">계정을 생성하여 서비스를 이용하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="dark:text-gray-200">ID</Label>
                    <Input 
                      id="username" 
                      type="text" 
                      placeholder="아이디를 입력하세요" 
                      {...registerForm.register("username")} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name" className="dark:text-gray-200">Name</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="이름을 입력하세요" 
                      {...registerForm.register("name")} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="이메일을 입력하세요" 
                      {...registerForm.register("email")} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className="dark:text-gray-200">Phone Number</Label>
                    <Input 
                      id="phoneNumber" 
                      type="text" 
                      placeholder="전화번호를 입력하세요" 
                      {...registerForm.register("phoneNumber")} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="dark:text-gray-200">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="비밀번호를 입력하세요" 
                      {...registerForm.register("password")} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="dark:text-gray-200">Confirm Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="비밀번호를 다시 입력하세요" 
                      {...registerForm.register("confirmPassword")} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full text-white bg-black dark:bg-white dark:text-black rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200" 
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        처리 중...
                      </>
                    ) : (
                      "회원가입 하기"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 비밀번호 재설정 다이얼로그 */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-[425px] rounded-xl dark:bg-gray-800 dark:text-white">
          <DialogHeader>
            <DialogTitle className="dark:text-white">비밀번호 재설정</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="reset-email" className="dark:text-gray-200">Email</Label>
              <Input 
                id="reset-email" 
                type="email" 
                placeholder="이메일을 입력하세요" 
                {...resetPasswordForm.register("email")} 
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full text-white bg-black dark:bg-white dark:text-black rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200" 
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  처리 중...
                </>
              ) : (
                "비밀번호 재설정 링크 보내기"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}