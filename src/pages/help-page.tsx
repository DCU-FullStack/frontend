import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Book, MessageCircle, FileText, Phone, Mail, ExternalLink, List } from "lucide-react";

interface HelpRequestEntity {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdDate: string;
  status: string;
}

export function HelpPage() {
  const [activeTab, setActiveTab] = useState("faq");
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<HelpRequestEntity[]>([]);
  const [showInquiries, setShowInquiries] = useState(false);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);

  const fetchInquiries = async () => {
    try {
      setIsLoadingInquiries(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("토큰이 없습니다.");
        return;
      }

      console.log("API 요청 시작:", "http://localhost:3000/api/help/inquiries");
      console.log("사용 토큰:", token);

      const response = await axios.get<HelpRequestEntity[]>("http://localhost:3000/api/help/inquiries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API 응답:", response.data);
      setInquiries(response.data);
    } catch (error: any) {
      console.error("문의 목록 조회 실패:", error);
      if (error.response) {
        console.error("에러 응답 데이터:", error.response.data);
        console.error("에러 상태 코드:", error.response.status);
        console.error("에러 헤더:", error.response.headers);
      } else if (error.request) {
        console.error("서버 응답 없음:", error.request);
      } else {
        console.error("에러 메시지:", error.message);
      }
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  useEffect(() => {
    if (activeTab === "my-inquiries") {
      fetchInquiries();
    }
  }, [activeTab]);

  const onRegisterSubmit = async (data: any) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        return;
      }

      const response = await axios.post("http://localhost:3000/api/help", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("문의가 성공적으로 접수되었습니다.", {
          position: "bottom-right",
          duration: 2000,
          style: {
            background: "#4CAF50",
            color: "white",
            fontSize: "14px",
            padding: "12px 24px",
            borderRadius: "4px",
          },
        });
        reset();
      }
    } catch (error: any) {
      console.error("문의 전송 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowInquiries = () => {
    setShowInquiries(true);
  };

  return (
    <Layout title="도움말">
      <div className="container p-6 mx-auto space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">도움말 및 지원</h1>
          <p className="text-muted-foreground">
            스마트 도로 이상감지 시스템 사용에 관한 도움말과 지원 정보를 제공합니다.
          </p>
        </div>

        <Tabs defaultValue="faq" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">자주 묻는 질문</TabsTrigger>
            <TabsTrigger value="guide">사용 가이드</TabsTrigger>
            <TabsTrigger value="contact">문의하기</TabsTrigger>
            <TabsTrigger value="my-inquiries" onClick={handleShowInquiries}>
              <List className="w-4 h-4 mr-2" />
              내 문의 확인
            </TabsTrigger>
          </TabsList>

          {/* FAQ 탭 */}
          <TabsContent value="faq" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>자주 묻는 질문</CardTitle>
                <CardDescription>사용자들이 자주 묻는 질문과 답변을 모았습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {/* FAQ 항목들 */}
                  <AccordionItem value="item-1">
                    <AccordionTrigger>시스템을 사용하려면 어떻게 해야 하나요?</AccordionTrigger>
                    <AccordionContent>시스템은 웹 브라우저를 통해 접근할 수 있으며, 사용자는 회원가입 후 로그인하여 서비스를 이용할 수 있습니다.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>이상 감지는 얼마나 자주 업데이트되나요?</AccordionTrigger>
                    <AccordionContent>도로 이상 데이터는 실시간으로 업데이트되며, 사용자는 언제든 최신 정보를 확인할 수 있습니다.</AccordionContent>
                  </AccordionItem>
                  {/* 필요한 만큼 추가 */}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 가이드 탭 */}
          <TabsContent value="guide" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>사용 가이드</CardTitle>
                <CardDescription>시스템의 주요 기능과 사용 방법에 대한 가이드입니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">1. 회원가입 및 로그인</h3>
                  <p className="text-sm text-muted-foreground">계정을 생성하고 시스템에 로그인하세요.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">2. 도로 이상 감지 확인</h3>
                  <p className="text-sm text-muted-foreground">지도에서 도로 상태를 확인하고, 이상 발생 지역을 모니터링할 수 있습니다.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 문의하기 탭 */}
          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>문의하기</CardTitle>
                <CardDescription>시스템 사용에 관한 문의사항이 있으시면 아래 양식으로 문의주세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* 연락처 정보 카드들 */}
                  <Card>
                    <CardHeader className="flex flex-row items-center space-x-4">
                      <Phone />
                      <div>
                        <CardTitle>전화 문의</CardTitle>
                        <CardDescription>+82 10-6398-0041</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center space-x-4">
                      <Mail />
                      <div>
                        <CardTitle>이메일 문의</CardTitle>
                        <CardDescription>chillcoder302@gmail.com</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </div>

                {/* 문의 양식 */}
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="mb-2 font-medium">문의 양식</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    아래 양식을 작성하여 문의사항을 보내주세요. 최대한 빨리 답변 드리겠습니다.
                  </p>

                  <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">이름</label>
                        <input
                          {...register("name")}
                          type="text"
                          className="w-full p-2 mt-1 border rounded-md"
                          placeholder="이름을 입력하세요"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">이메일</label>
                        <input
                          {...register("email")}
                          type="email"
                          className="w-full p-2 mt-1 border rounded-md"
                          placeholder="이메일을 입력하세요"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">제목</label>
                      <input
                        {...register("subject")}
                        type="text"
                        className="w-full p-2 mt-1 border rounded-md"
                        placeholder="문의 제목을 입력하세요"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">내용</label>
                      <textarea
                        {...register("message")}
                        className="w-full h-40 p-2 mt-1 border rounded-md"
                        placeholder="문의 내용을 입력하세요"
                        required
                      ></textarea>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "전송 중..." : "문의 보내기"}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 내 문의 확인 탭 */}
          <TabsContent value="my-inquiries" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>내 문의 목록</CardTitle>
                <CardDescription>작성하신 문의 내역을 확인할 수 있습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingInquiries ? (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-muted-foreground">문의 목록을 불러오는 중...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.length === 0 ? (
                      <p className="text-center text-muted-foreground">문의 내역이 없습니다.</p>
                    ) : (
                      inquiries.map((inquiry) => (
                        <Card key={inquiry.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle>{inquiry.subject}</CardTitle>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-sm ${
                                inquiry.status === '답변완료' 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-red-500 text-white'
                              }`}>
                                {inquiry.status}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="overflow-hidden text-sm line-clamp-3 text-ellipsis">{inquiry.message}</p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
