import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { useAuth, type ChangePasswordData, type DeleteAccountData } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Bell, LockKeyhole, User, Shield, Mail, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTheme } from "@/contexts/theme-context";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user, logoutMutation, changePasswordMutation, deleteAccountMutation, updateProfileMutation } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // 설정 상태 변수
  const [profileData, setProfileData] = useState({
    name: user?.name || "사용자",
    email: user?.email || "user@example.com",
    phoneNumber: user?.phoneNumber || "010-1234-5678"
  });
  
  // 사용자 정보가 변경될 때마다 프로필 데이터 업데이트
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "사용자",
        email: user.email || "user@example.com",
        phoneNumber: user.phoneNumber || "010-1234-5678"
      });
    }
  }, [user]);
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    appAlerts: true
  });
  
  // 비밀번호 변경 상태
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  
  // 계정 삭제 상태
  const [deleteAccountPassword, setDeleteAccountPassword] = useState("");
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDeleteAccountPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteAccountPassword(e.target.value);
  };
  
  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync(profileData);
      toast({
        title: "프로필 업데이트 완료",
        description: "프로필 정보가 성공적으로 업데이트되었습니다."
      });
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
    }
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "설정 저장 완료",
      description: "시스템 설정이 성공적으로 저장되었습니다."
    });
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast({
        title: "비밀번호 변경 실패",
        description: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "비밀번호 변경 실패",
        description: "새 비밀번호는 최소 6자 이상이어야 합니다.",
        variant: "destructive",
      });
      return;
    }
    
    changePasswordMutation.mutate(passwordData);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    });
  };
  
  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deleteAccountPassword) {
      toast({
        title: "계정 삭제 실패",
        description: "비밀번호를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    deleteAccountMutation.mutate({ password: deleteAccountPassword });
    setDeleteAccountPassword("");
  };

  return (
    <Layout title="마이페이지">
      <div className="min-h-screen bg-blue-100 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container px-4 py-8 mx-auto"
        >

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 transition-shadow bg-white shadow-sm dark:bg-gray-800 rounded-2xl hover:shadow-md">
              <TabsTrigger 
                value="profile" 
                className="rounded-xl data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 dark:text-gray-300 dark:hover:text-gray-200"
              >
                프로필
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="rounded-xl data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 dark:text-gray-300 dark:hover:text-gray-200"
              >
                보안
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="rounded-xl data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 dark:text-gray-300 dark:hover:text-gray-200"
              >
                알림
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card className="rounded-2xl">
                <CardHeader>
                <CardTitle>
                    <div className="flex items-center gap-2">
                      <img src="/profile.png" alt="Profile" className="w-6 h-6" />
                      프로필 정보
                    </div>
                  </CardTitle>
                  <CardDescription>계정의 기본 정보를 관리합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-muted">
                      <User className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div className="space-y-2">
                      <Button className="rounded-xl">프로필 사진 변경</Button>
                      <p className="text-sm text-muted-foreground">JPG, GIF 또는 PNG. 최대 10MB</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">이름</label>
                      <Input 
                        className="rounded-xl"
                        id="name" 
                        name="name" 
                        value={profileData.name} 
                        onChange={handleProfileChange} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">이메일</label>
                      <Input 
                        className="rounded-xl"
                        id="email" 
                        name="email" 
                        type="email" 
                        value={profileData.email} 
                        onChange={handleProfileChange} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">전화번호</label>
                      <Input 
                        className="rounded-xl"
                        id="phoneNumber"
                        name="phoneNumber" 
                        type="tel" 
                        value={profileData.phoneNumber}
                        onChange={handleProfileChange} 
                      />
                    </div>
                  </div>
                  
                  <Button className="text-white bg-blue-500 rounded-xl" onClick={handleSaveProfile}>변경사항 저장</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-6">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>🔔 알림 설정</CardTitle>
                  <CardDescription>시스템 알림 수신 설정을 관리합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">시스템 업데이트 및 보안</h4>
                          <p className="text-sm text-muted-foreground">시스템 업데이트 및 보안 관련 이메일 알림 수신</p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailAlerts}
                          onCheckedChange={() => handleNotificationToggle("emailAlerts")}
                          className="bg-blue-500 rounded-xl"
                        />
                      </div>
                   </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                  
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">작업 상태 변경</h4>
                          <p className="text-sm text-muted-foreground">작업 상태 변경 및 할당 관련 알림 수신</p>
                        </div>
                        <Switch
                          checked={notificationSettings.smsAlerts}
                          onCheckedChange={() => handleNotificationToggle("smsAlerts")}
                          className="bg-blue-500 rounded-xl"
                        />
                      </div>
                    
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 ">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">CCTV 모니터링</h4>
                          <p className="text-sm text-muted-foreground">도로 이상 감지 및 CCTV 모니터링 관련 알림 수신</p>
                        </div>
                        <Switch
                          checked={notificationSettings.appAlerts}
                          onCheckedChange={() => handleNotificationToggle("appAlerts")}
                          className="bg-blue-500 rounded-xl"
                        />
                      </div>
                  </div>
                  <Button className="text-white bg-blue-500 rounded-xl" onClick={handleSaveSettings}>알림 설정 저장</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-6">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>🔒 보안 설정</CardTitle>
                  <CardDescription>계정 보안을 위한 설정을 관리합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <h3 className="text-lg font-medium">비밀번호 변경</h3>
                    <p className="text-sm text-muted-foreground">계정의 비밀번호를 변경합니다.</p>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium">현재 비밀번호</label>
                        <Input 
                          className="rounded-xl"
                          id="current-password" 
                          name="currentPassword" 
                          type="password" 
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">새 비밀번호</label>
                        <Input 
                          className="rounded-xl"
                          id="new-password" 
                          name="newPassword" 
                          type="password" 
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">새 비밀번호 확인</label>
                        <Input 
                          className="rounded-xl"
                          id="confirm-password" 
                          name="confirmNewPassword" 
                          type="password" 
                          value={passwordData.confirmNewPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <Button 
                        className="text-white bg-blue-500 dark:bg-gray-700 dark:text-white rounded-xl hover:bg-blue-600 dark:hover:bg-gray-600" 
                        type="submit"
                        disabled={changePasswordMutation.isPending}
                      >
                        {changePasswordMutation.isPending ? "변경 중..." : "비밀번호 변경"}
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/50">
                    <h3 className="text-lg font-medium">계정 삭제</h3>
                    <p className="text-sm text-muted-foreground">
                      계정을 삭제하면 모든 데이터가 영구적으로 제거됩니다. 이 작업은 되돌릴 수 없습니다.
                    </p>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="mt-4 text-white bg-red-500 rounded-xl hover:bg-red-600">
                          계정 삭제
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>계정 삭제 확인</AlertDialogTitle>
                          <AlertDialogDescription>
                            정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form onSubmit={handleDeleteAccount}>
                          <div className="py-4">
                            <label className="text-sm font-medium">비밀번호 확인</label>
                            <Input 
                              type="password" 
                              value={deleteAccountPassword}
                              onChange={handleDeleteAccountPasswordChange}
                              className="mt-1 rounded-xl"
                              required
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">취소</AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button 
                                type="submit" 
                                className="text-white bg-red-500 rounded-xl hover:bg-red-600"
                                disabled={deleteAccountMutation.isPending}
                              >
                                {deleteAccountMutation.isPending ? "삭제 중..." : "계정 삭제"}
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </form>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
}