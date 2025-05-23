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
import { Loader2, Home, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/theme-context";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, loginMutation, registerMutation, resetPasswordMutation } = useAuth();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [registerStep, setRegisterStep] = useState(1);
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

  const nextRegisterStep = () => {
    if (registerStep < 2) {
      setRegisterStep(registerStep + 1);
    }
  };

  const prevRegisterStep = () => {
    if (registerStep > 1) {
      setRegisterStep(registerStep - 1);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-blue-100 dark:bg-gray-900">
      <div className="relative flex flex-col w-full max-w-6xl overflow-hidden bg-white shadow-2xl dark:bg-gray-800 rounded-3xl md:flex-row">
        {/* 홈 버튼 */}
        <div className="absolute z-20 flex items-center gap-2 rounded-full top-4 left-4 hover:bg-gray-100 dark:hover:bg-gray-700">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <Home className="w-5 h-5" />
          </Button>
          <span 
            className="px-2 py-1 rounded-full "
            onClick={() => navigate("/")}
          >
            
          </span>
        </div>
        
        {/* 왼쪽: 로그인/회원가입 폼 */}
        <div className="relative z-10 flex items-center justify-center w-full p-8 md:w-1/2">
          <div className="w-full max-w-md p-6 bg-white/90 dark:bg-gray-800/90 rounded-2xl backdrop-blur-md">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[500px]">
              <TabsList className="grid grid-cols-2 p-0 mb-6 overflow-hidden bg-transparent border border-blue-300 rounded-full dark:border-gray-600">
                <TabsTrigger 
                  value="login" 
                  className="h-full w-full text-black dark:text-gray-200 data-[state=active]:bg-blue-500 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-white dark:data-[state=active]:text-white transition rounded-full"
                >
                  로그인
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="h-full w-full text-black dark:text-gray-200 data-[state=active]:bg-blue-500 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-white dark:data-[state=active]:text-white transition rounded-full"
                >
                  회원가입
                </TabsTrigger>
              </TabsList>
              {/* 로그인 */}
              <TabsContent value="login">
                <Card className="bg-transparent border-0 shadow-none dark:bg-transparent rounded-xl">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl text-center dark:text-gray-200">AI 도로 시스템</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <div>
                        <Label htmlFor="login-username" className="dark:text-gray-300">ID</Label>
                        <Input 
                          id="login-username" 
                          placeholder="아이디를 입력하세요" 
                          {...loginForm.register("username")} 
                          className="border-gray-300 text-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="login-password" className="dark:text-gray-300">Password</Label>
                        <Input 
                          id="login-password" 
                          type="password" 
                          placeholder="비밀번호를 입력하세요" 
                          {...loginForm.register("password")} 
                          className="border-gray-300 text-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 rounded-xl"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="remember" className="dark:border-gray-600" />
                          <Label htmlFor="remember" className="text-sm dark:text-gray-300">로그인 상태 유지</Label>
                        </div>
                      </div>
                      <Button 
                        type="button" 
                        variant="link" 
                        className="px-0 text-sm dark:text-gray-300" 
                        onClick={() => setShowResetDialog(true)}
                      >
                        비밀번호 찾기
                      </Button>
                      <div className="mt-8">
                        <Button 
                          type="submit" 
                          className="w-full text-white bg-blue-500 dark:bg-gray-700 dark:text-white rounded-xl hover:bg-blue-600 dark:hover:bg-gray-600" 
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending && (
                            <Loader2 rounded-xl className="w-4 h-4 mr-2 animate-spin" />
                          )}
                          로그인
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* 회원가입 */}
              <TabsContent value="register">
                <Card className="bg-transparent border-0 shadow-none dark:bg-transparent rounded-xl">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center rounded-xl dark:text-white">회원가입</CardTitle>
                    <CardDescription className="text-center dark:text-gray-400">계정을 생성하여 서비스를 이용하세요</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      {/* Step 1: 기본 정보 */}
                      <div className={`${registerStep === 1 ? 'block' : 'hidden'}`}>
                        <div>
                          <Label htmlFor="name" className="dark:text-gray-200">Name</Label>
                          <Input 
                            id="name" 
                            type="text" 
                            placeholder="이름을 입력하세요" 
                            {...registerForm.register("name")} 
                            className="border-gray-300 text-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-xl"
                          />
                        </div>
                        <div className="mt-4">
                          <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="이메일을 입력하세요" 
                            {...registerForm.register("email")} 
                            className="border-gray-300 text-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-xl"
                          />
                        </div>
                        <div className="mt-4">
                          <Label htmlFor="phoneNumber" className="dark:text-gray-300">Phone Number</Label>
                          <Input 
                            id="phoneNumber" 
                            type="text" 
                            placeholder="전화번호를 입력하세요" 
                            {...registerForm.register("phoneNumber")} 
                            className="border-gray-300 text-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-xl"
                          />
                        </div>
                      </div>
                      
                      {/* Step 2: 계정 정보 */}
                      <div className={`${registerStep === 2 ? 'block' : 'hidden'} h-[200px] flex flex-col justify-center`}>
                        <div>
                          <Label htmlFor="username" className="dark:text-gray-300">ID</Label>
                          <Input 
                            id="username" 
                            type="text" 
                            placeholder="아이디를 입력하세요" 
                            {...registerForm.register("username")} 
                            className="border-gray-300 text-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-xl"
                          />
                        </div>
                        <div className="mt-4">
                          <Label htmlFor="password" className="dark:text-gray-300">Password</Label>
                          <Input 
                            id="password" 
                            type="password" 
                            placeholder="비밀번호를 입력하세요" 
                            {...registerForm.register("password")} 
                            className="border-gray-300 text-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-xl"
                          />
                        </div>
                        <div className="mt-4">
                          <Label htmlFor="confirmPassword" className="dark:text-gray-300">Confirm Password</Label>
                          <Input 
                            id="confirmPassword" 
                            type="password" 
                            placeholder="비밀번호를 다시 입력하세요" 
                            {...registerForm.register("confirmPassword")} 
                            className="border-gray-300 text-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between mt-8">
                        {registerStep > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={prevRegisterStep}
                            className="transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            이전
                          </Button>
                        )}
                        {registerStep < 2 ? (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={nextRegisterStep}
                            className="transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            다음
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        ) : (
                          <Button 
                            type="submit" 
                            className="w-24 text-white bg-blue-500 rounded-full dark:bg-blue-400 dark:text-black hover:bg-blue-600 dark:hover:bg-blue-300" 
          
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                처리 중...
                              </>
                            ) : (
                              "회원가입"
                            )}
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* 오른쪽: 이미지 */}
        <div className="relative z-0 flex items-center justify-center w-full bg-transparent md:w-1/2">
          <div className="h-[600px] flex items-center justify-center">
            <img 
              src="/aurh-car.png" 
              alt="3D 도시와 자동차" 
              className="object-cover w-auto h-full max-w-none md:max-w-none rounded-2xl"
              style={{ 
                filter: 'drop-shadow(0 0 40px #bae6fd)',
                transform: 'scale(1.2) translateX(-50px)'
              }}
            />
          </div>
        </div>
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
                className="text-gray-600 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full text-white bg-blue-500 dark:bg-blue-400 dark:text-black rounded-xl hover:bg-blue-600 dark:hover:bg-blue-300" 
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