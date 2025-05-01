import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { MessageSquare, User, Mail, Clock, CheckCircle2, AlertCircle, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";

interface HelpRequestEntity {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdDate: string;
  status: string;
}

interface Comment {
  id: number;
  content: string;
  createdDate: string;
  author: string;
}

interface InquiryDetailModalProps {
  inquiry: HelpRequestEntity;
  comments: Comment[];
  onClose: () => void;
  onUpdate: (updatedInquiry: HelpRequestEntity) => void;
  onRefresh: () => Promise<void>;
}

export function InquiryDetailModal({
  inquiry,
  comments,
  onClose,
  onUpdate,
  onRefresh
}: InquiryDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(inquiry.message);

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'PPP', { locale: ko });
    } catch (error) {
      console.error('날짜 포맷팅 에러:', error);
      return '날짜 정보 없음';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '답변완료':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
      case '답변중':
        return <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("로그인이 필요합니다.");
        return;
      }

      const response = await axios.put(
        `http://localhost:3000/api/help/inquiries/${inquiry.id}`,
        {
          ...inquiry,
          message: editedMessage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        onUpdate(response.data);
        setIsEditing(false);
        toast.success("문의가 수정되었습니다.");
        await onRefresh();
      }
    } catch (error) {
      console.error("문의 수정 실패:", error);
      toast.error("문의 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setEditedMessage(inquiry.message);
    setIsEditing(false);
  };

  const handleClose = async () => {
    await onRefresh();
    onClose();
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-background border-border !rounded-[2rem] [&>button]:hidden">
        <DialogHeader className="px-8 py-6 border-b !rounded-t-[2rem]">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
              <MessageSquare className="w-6 h-6 text-primary" />
              문의 상세
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="w-10 h-10 rounded-2xl hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-8 space-y-8">
          {/* 문의 제목 및 상태 */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{inquiry.subject}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {formatDate(inquiry.createdDate)}
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border rounded-full bg-muted/50">
              {getStatusIcon(inquiry.status)}
              <span className="text-sm font-semibold">{inquiry.status}</span>
            </div>
          </div>

          {/* 작성자 정보 */}
          <div className="grid grid-cols-2 gap-6 p-6 bg-muted/50 rounded-[2rem] border">
            <div className="flex items-center gap-3">
              <div className="p-2 border rounded-full bg-background">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{inquiry.name}</p>
                <p className="text-xs text-muted-foreground">작성자</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 border rounded-full bg-background">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{inquiry.email}</p>
                <p className="text-xs text-muted-foreground">이메일</p>
              </div>
            </div>
          </div>

          {/* 문의 내용 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">문의 내용</h4>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="rounded-xl hover:bg-muted"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  수정하기
                </Button>
              )}
            </div>
            <div className="p-6 bg-muted/50 rounded-[2rem] border">
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    className="min-h-[200px] resize-none bg-background"
                    placeholder="문의 내용을 입력하세요"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="rounded-xl hover:bg-muted"
                    >
                      취소
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleSave}
                      className="rounded-xl"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      저장
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
              )}
            </div>
          </div>
          
          {/* 답변 목록 */}
          {comments.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">답변</h4>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 border rounded-full bg-background border-primary/10">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{comment.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(comment.createdDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="px-8 py-6 border-t bg-muted/50 !rounded-b-[2rem]">
        </div>
      </DialogContent>
    </Dialog>
  );
} 