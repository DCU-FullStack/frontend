import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth, registerUserSchema, loginUserSchema, resetPasswordSchema } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Home } from "lucide-react";
import { toast } from "sonner";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, loginMutation, registerMutation, resetPasswordMutation } = useAuth();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  // Reset password form
  const resetPasswordForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
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
    <div className="flex items-center justify-center min-h-screen bg-center bg-no-repeat bg-cover" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <div className="relative z-10 w-full max-w-4xl px-4 mx-auto">
        <div className="flex justify-end mb-4">
          <Link
            to="/"
            className="flex items-center text-white transition-colors hover:text-primary"
          >
            <Home className="w-5 h-5 mr-2" />
            <span>홈으로 돌아가기</span>
          </Link>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="login">로그인</TabsTrigger>
            <TabsTrigger value="register">회원가입</TabsTrigger>
          </TabsList>
          
          {/* Login Form */}
          <TabsContent value="login">
            <Card className="w-full bg-white">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">스마트 도로 이상감지 시스템</CardTitle>
                <CardDescription className="text-center">
                  로그인 정보를 입력하여 시스템에 접속하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">사용자 아이디</Label>
                      <Input 
                        id="login-username"
                        placeholder="아이디를 입력하세요" 
                        {...loginForm.register("username")}
                      />
                      {loginForm.formState.errors.username && (
                        <p className="text-sm text-red-500">
                          {loginForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">비밀번호</Label>
                      <Input 
                        id="login-password" 
                        type="password" 
                        placeholder="비밀번호를 입력하세요" 
                        {...loginForm.register("password")}
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm">로그인 상태 유지</Label>
                      </div>
                      <Button 
                        type="button" 
                        variant="link" 
                        className="px-0 text-sm"
                        onClick={() => setShowResetDialog(true)}
                      >
                        비밀번호 찾기
                      </Button>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full text-white bg-black hover:bg-gray-800"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      로그인
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Register Form */}
          <TabsContent value="register">
            <Card className="w-full bg-white">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
                <CardDescription>
                  계정을 생성하여 서비스를 이용하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">아이디</Label>
                    <Input
                      id="username"
                      placeholder="아이디를 입력하세요"
                      {...registerForm.register("username")}
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      placeholder="이름을 입력하세요"
                      {...registerForm.register("name")}
                    />
                    {registerForm.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="이메일을 입력하세요"
                      {...registerForm.register("email")}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">전화번호</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="전화번호를 입력하세요"
                      {...registerForm.register("phoneNumber")}
                    />
                    {registerForm.formState.errors.phoneNumber && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      {...registerForm.register("password")}
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
                      {...registerForm.register("confirmPassword")}
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-white bg-black hover:bg-gray-800"
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
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Reset Password Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>비밀번호 재설정</DialogTitle>
            <DialogDescription>
              가입 시 사용한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">이메일</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="이메일을 입력하세요"
                {...resetPasswordForm.register("email")}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full text-white bg-black hover:bg-gray-800"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              비밀번호 재설정 링크 보내기
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
