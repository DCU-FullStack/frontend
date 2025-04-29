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

export default function SettingsPage() {
  const { user, logoutMutation, changePasswordMutation, deleteAccountMutation, updateProfileMutation } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
      <div className="px-4 py-8">
        <div className="mb-8 py-8">
          <h1 className="flex items-center text-2xl font-bold text-gray-800 dark:text-white">
            <Shield className="w-6 h-6 mr-2 text-primary" />
            마이페이지
          </h1>
          <p className="text-gray-600 dark:text-gray-400">마이페이지 설정을 관리하세요.</p>
        </div>
        
        <Tabs defaultValue="profile" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              프로필
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              알림
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              보안
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>내 프로필</CardTitle>
                <CardDescription>
                  개인정보를 관리하고 업데이트 하세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-8 md:flex-row">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center justify-center w-20 h-20 text-white bg-black border border-gray-300 rounded-full">
                      <span className="text-3xl font-medium">
                        {user?.name?.[0] || user?.username?.[0] || "U"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="name">이름</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={profileData.name} 
                          onChange={handleProfileChange} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">이메일</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={profileData.email} 
                          onChange={handleProfileChange} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="phoneNumber">전화번호</Label>
                        <Input 
                          id="phoneNumber"
                          name="phoneNumber" 
                          type="tel" 
                          value={profileData.phoneNumber}
                          onChange={handleProfileChange} 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Button className="mt-4 bg-[#1B1D35] text-white hover:bg-gray-500 rounded-full" onClick={handleSaveProfile}>
                        변경사항 저장
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>알림 설정</CardTitle>
                <CardDescription>
                  시스템 알림 및 공지 설정을 관리하세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <h4 className="font-medium">이메일 알림</h4>
                      <p className="text-sm text-muted-foreground">
                        이상 상황 및 작업 관련 이메일 알림 수신
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailAlerts}
                      onCheckedChange={() => handleNotificationToggle("emailAlerts")}
                      className="data-[state=checked]:bg-black"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <h4 className="font-medium">SMS 알림</h4>
                      <p className="text-sm text-muted-foreground">
                        긴급 상황 발생 시 SMS 알림 수신
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsAlerts}
                      onCheckedChange={() => handleNotificationToggle("smsAlerts")}
                      className="data-[state=checked]:bg-black"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <h4 className="font-medium">앱 알림</h4>
                      <p className="text-sm text-muted-foreground">
                        애플리케이션 내 알림 수신
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.appAlerts}
                      onCheckedChange={() => handleNotificationToggle("appAlerts")}
                      className="data-[state=checked]:bg-black"
                    />
                  </div>
                  
                  <div>
                    <Button className="mt-4 bg-[#1B1D35] text-white hover:bg-gray-500 rounded-full" onClick={handleSaveSettings}>
                      알림 설정 저장
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>보안 설정</CardTitle>
                <CardDescription>
                  계정 보안 및 접근 권한을 관리하세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">비밀번호 변경</h4>
                    <form onSubmit={handleChangePassword}>
                      <div>
                        <Label htmlFor="current-password">현재 비밀번호</Label>
                        <Input 
                          id="current-password" 
                          name="currentPassword" 
                          type="password" 
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-password">새 비밀번호</Label>
                        <Input 
                          id="new-password" 
                          name="newPassword" 
                          type="password" 
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">비밀번호 확인</Label>
                        <Input 
                          id="confirm-password" 
                          name="confirmNewPassword" 
                          type="password" 
                          value={passwordData.confirmNewPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <Button 
                        className="mt-2 bg-[#1B1D35] text-white hover:bg-[#1B1D35]/90 rounded-full" 
                        type="submit"
                        disabled={changePasswordMutation.isPending}
                      >
                        {changePasswordMutation.isPending ? "변경 중..." : "비밀번호 변경"}
                      </Button>
                    </form>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">계정 삭제</h4>
                    <p className="text-sm text-muted-foreground">
                      계정을 삭제하면 모든 데이터가 영구적으로 제거됩니다. 이 작업은 되돌릴 수 없습니다.
                    </p>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-[#E54D2E] text-white hover:bg-[#E54D2E]/90 rounded-full">계정 삭제</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>계정 삭제 확인</AlertDialogTitle>
                          <AlertDialogDescription>
                            정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form onSubmit={handleDeleteAccount}>
                          <div className="py-4">
                            <Label htmlFor="delete-password">비밀번호 확인</Label>
                            <Input 
                              id="delete-password" 
                              type="password" 
                              value={deleteAccountPassword}
                              onChange={handleDeleteAccountPasswordChange}
                              required
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button 
                                type="submit" 
                                className="bg-[#E54D2E] text-white hover:bg-[#E54D2E]/90 rounded-full"
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}