import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Book, MessageCircle, FileText, Phone, Mail, ExternalLink } from "lucide-react";

export function HelpPage() {
  const [activeTab, setActiveTab] = useState("faq");

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">자주 묻는 질문</TabsTrigger>
            <TabsTrigger value="guide">사용 가이드</TabsTrigger>
            <TabsTrigger value="contact">문의하기</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>자주 묻는 질문</CardTitle>
                <CardDescription>
                  사용자들이 자주 묻는 질문과 답변을 모았습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>시스템에 어떻게 로그인하나요?</AccordionTrigger>
                    <AccordionContent>
                      로그인 페이지에서 관리자가 제공한 이메일과 비밀번호를 입력하여 로그인할 수 있습니다. 
                      비밀번호를 잊어버린 경우 관리자에게 문의하세요.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>대시보드에서 어떤 정보를 확인할 수 있나요?</AccordionTrigger>
                    <AccordionContent>
                      대시보드에서는 시스템의 전반적인 상태, 최근 사고, 할당된 작업, CCTV 피드 등을 한눈에 확인할 수 있습니다.
                      각 카드에는 해당 섹션의 요약 정보가 표시되며, 더 자세한 정보는 각 섹션 페이지에서 확인할 수 있습니다.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>사고 관리 페이지는 어떻게 사용하나요?</AccordionTrigger>
                    <AccordionContent>
                      사고 관리 페이지에서는 발생한 사고 목록을 확인하고, 사고 상태를 업데이트하며, 사고에 대한 상세 정보를 볼 수 있습니다.
                      새로운 사고를 등록하거나 기존 사고를 편집할 수도 있습니다.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>CCTV 모니터링은 어떻게 작동하나요?</AccordionTrigger>
                    <AccordionContent>
                      CCTV 모니터링 페이지에서는 설치된 CCTV 피드를 실시간으로 확인할 수 있습니다.
                      각 피드는 16:9 비율로 표시되며, 피드 상태(온라인/오프라인)를 확인할 수 있습니다.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>알림은 어떻게 설정하나요?</AccordionTrigger>
                    <AccordionContent>
                      설정 페이지의 알림 섹션에서 다양한 알림 유형(이메일, SMS 등)을 설정할 수 있습니다.
                      각 알림 유형별로 활성화/비활성화할 수 있으며, 알림 수신 빈도도 조정할 수 있습니다.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>사용 가이드</CardTitle>
                <CardDescription>
                  시스템의 주요 기능과 사용 방법에 대한 가이드입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">시스템 개요</h3>
                  <p>
                    스마트 도로 이상감지 시스템은 도로 상태를 실시간으로 모니터링하고 이상 상황을 감지하여 
                    신속하게 대응할 수 있도록 도와주는 통합 관리 시스템입니다.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">주요 기능</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <h4 className="mb-2 font-medium">대시보드</h4>
                      <p className="text-sm text-muted-foreground">
                        시스템의 전반적인 상태와 중요 정보를 한눈에 확인할 수 있습니다.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="mb-2 font-medium">사고 관리</h4>
                      <p className="text-sm text-muted-foreground">
                        발생한 사고를 등록하고 관리하며, 상태를 업데이트할 수 있습니다.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="mb-2 font-medium">작업 관리</h4>
                      <p className="text-sm text-muted-foreground">
                        사고 대응을 위한 작업을 할당하고 진행 상황을 추적할 수 있습니다.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="mb-2 font-medium">CCTV 모니터링</h4>
                      <p className="text-sm text-muted-foreground">
                        설치된 CCTV 피드를 실시간으로 확인하고 모니터링할 수 있습니다.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="mb-2 font-medium">데이터 분석</h4>
                      <p className="text-sm text-muted-foreground">
                        수집된 데이터를 분석하여 인사이트를 얻고 보고서를 생성할 수 있습니다.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="mb-2 font-medium">사용자 관리</h4>
                      <p className="text-sm text-muted-foreground">
                        시스템 사용자를 관리하고 권한을 설정할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">단계별 가이드</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="mb-2 font-medium">1. 로그인</h4>
                      <p className="text-sm text-muted-foreground">
                        관리자가 제공한 계정 정보로 시스템에 로그인합니다.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="mb-2 font-medium">2. 대시보드 확인</h4>
                      <p className="text-sm text-muted-foreground">
                        대시보드에서 시스템의 전반적인 상태와 중요 정보를 확인합니다.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="mb-2 font-medium">3. 사고 관리</h4>
                      <p className="text-sm text-muted-foreground">
                        사고 관리 페이지에서 발생한 사고를 확인하고 상태를 업데이트합니다.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="mb-2 font-medium">4. 작업 할당</h4>
                      <p className="text-sm text-muted-foreground">
                        작업 관리 페이지에서 사고 대응을 위한 작업을 할당하고 진행 상황을 추적합니다.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="mb-2 font-medium">5. CCTV 모니터링</h4>
                      <p className="text-sm text-muted-foreground">
                        CCTV 모니터링 페이지에서 실시간 피드를 확인하고 이상 상황을 감지합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>문의하기</CardTitle>
                <CardDescription>
                  시스템 사용에 관한 문의사항이 있으시면 아래 연락처로 문의해주세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">기술 지원</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-5 h-5 text-primary" />
                        <span>02-1234-5678</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-5 h-5 text-primary" />
                        <span>support@smartroad.com</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        <span>평일 09:00 - 18:00</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">문서 및 자료</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <a href="#" className="flex items-center text-primary hover:underline">
                          사용자 매뉴얼 <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Book className="w-5 h-5 text-primary" />
                        <a href="#" className="flex items-center text-primary hover:underline">
                          API 문서 <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        <a href="#" className="flex items-center text-primary hover:underline">
                          문제 해결 가이드 <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="mb-2 font-medium">문의 양식</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    아래 양식을 작성하여 문의사항을 보내주세요. 최대한 빨리 답변 드리겠습니다.
                  </p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">이름</label>
                        <input
                          type="text"
                          className="w-full p-2 mt-1 border rounded-md"
                          placeholder="이름을 입력하세요"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">이메일</label>
                        <input
                          type="email"
                          className="w-full p-2 mt-1 border rounded-md"
                          placeholder="이메일을 입력하세요"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">제목</label>
                      <input
                        type="text"
                        className="w-full p-2 mt-1 border rounded-md"
                        placeholder="문의 제목을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">내용</label>
                      <textarea
                        className="w-full h-32 p-2 mt-1 border rounded-md"
                        placeholder="문의 내용을 입력하세요"
                      ></textarea>
                    </div>
                    <Button className="w-full">문의하기</Button>
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