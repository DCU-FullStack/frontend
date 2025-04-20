import { useState } from "react";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../hooks/use-auth";

export const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              관리자 페이지
            </h1>
            <Tabs defaultValue="users" className="space-y-4">
              <TabsList>
                <TabsTrigger value="users">사용자 관리</TabsTrigger>
                <TabsTrigger value="settings">시스템 설정</TabsTrigger>
              </TabsList>
              <TabsContent value="users">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">사용자 관리</h2>
                  {/* 사용자 관리 기능 구현 예정 */}
                  <p>사용자 관리 기능이 곧 추가될 예정입니다.</p>
                </Card>
              </TabsContent>
              <TabsContent value="settings">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">시스템 설정</h2>
                  {/* 시스템 설정 기능 구현 예정 */}
                  <p>시스템 설정 기능이 곧 추가될 예정입니다.</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}; 