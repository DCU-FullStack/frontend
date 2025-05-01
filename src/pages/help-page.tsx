import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { X, Send, Edit2, Check } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Book, MessageCircle, FileText, Phone, Mail, ExternalLink, List } from "lucide-react";
import { InquiryList } from "@/components/inquiry-list";
import { InquiryDetailModal } from "@/components/inquiry-detail-modal";
import { HelpRequestEntity, Comment } from "@/types/help";

export function HelpPage() {
  const navigate = useNavigate();
  const { inquiryId } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("faq");
  const { register, handleSubmit, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<HelpRequestEntity[]>([]);
  const [showInquiries, setShowInquiries] = useState(false);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<HelpRequestEntity | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const fetchInquiries = async () => {
    try {
      setIsLoadingInquiries(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("로그인이 필요합니다.", {
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #e5e7eb'
          }
        });
        return;
      }

      const response = await axios.get<HelpRequestEntity[]>("http://localhost:3000/api/help/inquiries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data || !Array.isArray(response.data)) {
        toast.error("문의 목록 데이터 형식이 올바르지 않습니다.", {
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #e5e7eb'
          }
        });
        return;
      }

      setInquiries(response.data);
      
      if (inquiryId) {
        const inquiry = response.data.find(inq => inq.id === Number(inquiryId));
        if (inquiry) {
          setSelectedInquiry(inquiry);
        }
      }
    } catch (error: any) {
      console.error("문의 목록 조회 실패:", error.response || error);
      const errorMessage = error.response?.data?.message || "문의 목록을 불러오는데 실패했습니다.";
      toast.error(errorMessage, {
        style: {
          background: 'white',
          color: 'black',
          border: '1px solid #e5e7eb'
        }
      });
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  useEffect(() => {
    if (location.pathname.includes('/help/inquiries')) {
      setActiveTab('my-inquiries');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (activeTab === 'my-inquiries') {
      fetchInquiries();
    }
  }, [activeTab]);

  useEffect(() => {
    if (inquiryId) {
      const fetchInquiryDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            toast.error("로그인이 필요합니다.");
            return;
          }

          const response = await axios.get<HelpRequestEntity>(
            `http://localhost:3000/api/help/inquiries/${inquiryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setSelectedInquiry(response.data);
          setShowDetailModal(true);
          setIsEditing(false);
          
          // 폼 데이터 초기화
          setValue('name', response.data.name);
          setValue('email', response.data.email);
          setValue('subject', response.data.subject);
          setValue('message', response.data.message);

          if (response.data.status === '답변완료' || response.data.status === '답변중') {
            const commentsResponse = await axios.get<Comment[]>(
              `http://localhost:3000/api/help/inquiries/${inquiryId}/comments`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setComments(commentsResponse.data);
          } else {
            setComments([]);
          }
        } catch (error) {
          console.error("문의 상세 정보 조회 실패:", error);
          toast.error("문의 상세 정보를 불러오는데 실패했습니다.");
          navigate('/help');
        }
      };

      fetchInquiryDetails();
    }
  }, [inquiryId]);

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

  const handleInquiryClick = async (inquiry: HelpRequestEntity) => {
    try {
      setSelectedInquiry(inquiry);
      setShowDetailModal(true);
      setIsEditing(false);
      
      // 폼 데이터 초기화
      setValue('name', inquiry.name);
      setValue('email', inquiry.email);
      setValue('subject', inquiry.subject);
      setValue('message', inquiry.message);

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("로그인이 필요합니다.", {
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #e5e7eb'
          }
        });
        return;
      }

      // 댓글 목록 가져오기
      if (inquiry.status === '답변완료' || inquiry.status === '답변중') {
        try {
          const commentsResponse = await axios.get<Comment[]>(
            `http://localhost:3000/api/help/inquiries/${inquiry.id}/comments`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setComments(commentsResponse.data);
        } catch (error) {
          console.error("댓글 목록 조회 실패:", error);
          toast.error("댓글 목록을 불러오는데 실패했습니다.", {
            style: {
              background: 'white',
              color: 'black',
              border: '1px solid #e5e7eb'
            }
          });
        }
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("문의 상세 정보 조회 실패:", error);
      toast.error("문의 상세 정보를 불러오는데 실패했습니다.", {
        style: {
          background: 'white',
          color: 'black',
          border: '1px solid #e5e7eb'
        }
      });
    }
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedInquiry(null);
    setComments([]);
    setIsEditing(false);
    reset();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleBackdropClick = () => {
    handleCloseModal();
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedInquiry) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("로그인이 필요합니다.", {
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #e5e7eb'
          }
        });
        return;
      }

      const response = await axios.post<Comment>(
        `http://localhost:3000/api/help/${selectedInquiry.id}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setComments([...comments, response.data]);
        setNewComment("");
        toast.success("댓글이 등록되었습니다.", {
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #e5e7eb'
          }
        });
      }
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      toast.error("댓글 등록에 실패했습니다.", {
        style: {
          background: 'white',
          color: 'black',
          border: '1px solid #e5e7eb'
        }
      });
    }
  };

  const handleEditClick = () => {
    if (selectedInquiry) {
      setIsEditing(true);
    }
  };

  const onEditSubmit = async (data: any) => {
    if (!selectedInquiry) {
      toast.error("유효하지 않은 문의입니다.", {
        style: {
          background: 'white',
          color: 'black',
          border: '1px solid #e5e7eb'
        }
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("로그인이 필요합니다.", {
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #e5e7eb'
          }
        });
        return;
      }

      const response = await axios.put(
        `http://localhost:3000/api/help/inquiries/${selectedInquiry.id}`,
        {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // 목록의 해당 문의도 업데이트
        setInquiries(inquiries.map(inq => 
          inq.id === selectedInquiry.id
            ? { ...inq, subject: data.subject, message: data.message }
            : inq
        ));
        
        setSelectedInquiry({
          ...selectedInquiry,
          subject: data.subject,
          message: data.message
        });
        setIsEditing(false);
        toast.success("문의가 수정되었습니다.", {
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #e5e7eb'
          }
        });
      }
    } catch (error) {
      console.error("문의 수정 실패:", error);
      toast.error("문의 수정에 실패했습니다.", {
        style: {
          background: 'white',
          color: 'black',
          border: '1px solid #e5e7eb'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleUpdateInquiry = (updatedInquiry: HelpRequestEntity) => {
    setInquiries(inquiries.map(inq => 
      inq.id === updatedInquiry.id ? updatedInquiry : inq
    ));
    setSelectedInquiry(updatedInquiry);
  };

  return (
    <Layout title="도움말">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container px-4 py-8 mx-auto"
      >
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <div className="p-3 rounded-full shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50">
              <HelpCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">도움말</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">시스템 사용 방법 및 FAQ</p>
            </div>
          </motion.div>
        </div>
        
        <Tabs defaultValue="faq" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 mb-4 transition-shadow bg-white shadow-sm dark:bg-gray-800 rounded-2xl hover:shadow-md">
            <TabsTrigger 
              value="faq" 
              className="rounded-xl data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 dark:text-gray-300 dark:hover:text-gray-200"
            >
              자주 묻는 질문
            </TabsTrigger>
            <TabsTrigger 
              value="guide" 
              className="rounded-xl data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 dark:text-gray-300 dark:hover:text-gray-200"
            >
              사용 가이드
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="rounded-xl data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 dark:text-gray-300 dark:hover:text-gray-200"
            >
              문의하기
            </TabsTrigger>
          </TabsList>

          {/* FAQ 탭 */}
          <TabsContent value="faq" className="mt-6">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>자주 묻는 질문</CardTitle>
                <CardDescription>사용자들이 자주 묻는 질문과 답변을 모았습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {/* FAQ 항목들 */}
                  <AccordionItem value="item-1" className="rounded-xl">
                    <AccordionTrigger>시스템을 사용하려면 어떻게 해야 하나요?</AccordionTrigger>
                    <AccordionContent>시스템은 웹 브라우저를 통해 접근할 수 있으며, 사용자는 회원가입 후 로그인하여 서비스를 이용할 수 있습니다.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="rounded-xl">
                    <AccordionTrigger>이상 감지는 얼마나 자주 업데이트되나요?</AccordionTrigger>
                    <AccordionContent>도로 이상 데이터는 실시간으로 업데이트되며, 사용자는 언제든 최신 정보를 확인할 수 있습니다.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 가이드 탭 */}
          <TabsContent value="guide" className="mt-6">
            <Card className="rounded-xl">
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
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>문의하기</CardTitle>
                <CardDescription>시스템 사용에 관한 문의사항이 있으시면 아래 양식으로 문의주세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* 연락처 정보 카드들 */}
                  <Card className="rounded-xl">
                    <CardHeader className="flex flex-row items-center space-x-4">
                      <Phone />
                      <div>
                        <CardTitle>전화 문의</CardTitle>
                        <CardDescription>+82 10-1234-5678</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                  <Card className="rounded-xl">
                    <CardHeader className="flex flex-row items-center space-x-4">
                      <Mail />
                      <div>
                        <CardTitle>이메일 문의</CardTitle>
                        <CardDescription>support@example.com</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </div>

                {/* 문의 양식 */}
                <div className="p-4 border rounded-xl bg-muted/50">
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
                          className="w-full p-2 mt-1 border rounded-xl"
                          placeholder="이름을 입력하세요"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">이메일</label>
                        <input
                          {...register("email")}
                          type="email"
                          className="w-full p-2 mt-1 border rounded-xl"
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
                        className="w-full p-2 mt-1 border rounded-xl"
                        placeholder="문의 제목을 입력하세요"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">내용</label>
                      <textarea
                        {...register("message")}
                        className="w-full h-40 p-2 mt-1 border rounded-xl"
                        placeholder="문의 내용을 입력하세요"
                        required
                      ></textarea>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full text-white bg-blue-600 rounded-xl hover:bg-blue-700" 
                      disabled={loading}
                    >
                      {loading ? "전송 중..." : "문의 보내기"}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 내 문의 확인 탭 */}
          <TabsContent value="my-inquiries" className="mt-6">
            {isLoadingInquiries ? (
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle>내 문의 목록</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40">
                    <p className="text-muted-foreground">문의 목록을 불러오는 중...</p>
                  </div>
                </CardContent>
              </Card>
            ) : inquiries.length === 0 ? (
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle>내 문의 목록</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40">
                    <p className="text-muted-foreground">등록된 문의가 없습니다.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <InquiryList
                inquiries={inquiries}
                isLoading={isLoadingInquiries}
                onInquiryClick={handleInquiryClick}
              />
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* 문의 상세 모달 */}
      {showDetailModal && selectedInquiry && (
        <InquiryDetailModal 
          inquiry={selectedInquiry}
          comments={comments}
          onClose={handleCloseModal}
          onUpdate={handleUpdateInquiry}
          onRefresh={fetchInquiries}
        />
      )}
    </Layout>
  );
}