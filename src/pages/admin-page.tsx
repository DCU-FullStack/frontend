import { useState } from "react";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../hooks/use-auth";

export const AdminPage = () => {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar isOpen={isSidebarOpen} /> */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          // isSidebarOpen={isSidebarOpen}
          // onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-6 text-2xl font-semibold text-gray-900">
              관리자 페이지
            </h1>
            <Tabs defaultValue="users" className="space-y-4">
              <TabsList>
                <TabsTrigger value="users">사용자 관리</TabsTrigger>
                <TabsTrigger value="settings">시스템 설정</TabsTrigger>
              </TabsList>
              <TabsContent value="users">
                <Card className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">사용자 관리</h2>
                  {/* 사용자 관리 기능 구현 예정 */}
                  <p>사용자 관리 기능이 곧 추가될 예정입니다.</p>
                </Card>
              </TabsContent>
              <TabsContent value="settings">
                <Card className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">시스템 설정</h2>
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