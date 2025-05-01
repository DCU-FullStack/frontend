import { format, parseISO, isValid } from "date-fns";
import { ko } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HelpRequestEntity {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdDate: string;
  status: string;
}

interface InquiryListProps {
  inquiries: HelpRequestEntity[];
  isLoading: boolean;
  onInquiryClick: (inquiry: HelpRequestEntity) => void;
  onEditClick?: (inquiry: HelpRequestEntity) => void;
}

export function InquiryList({ inquiries, isLoading, onInquiryClick, onEditClick }: InquiryListProps) {
  const formatDate = (dateString: string) => {
    try {
      // 먼저 ISO 형식으로 파싱 시도
      let date = parseISO(dateString);
      
      // ISO 파싱이 실패하면 다른 형식 시도
      if (!isValid(date)) {
        // 타임스탬프 형식인 경우
        if (!isNaN(Number(dateString))) {
          date = new Date(Number(dateString));
        } else {
          // 일반 날짜 문자열인 경우
          date = new Date(dateString);
        }
      }

      // 최종적으로 유효한 날짜인지 확인
      if (!isValid(date)) {
        console.error('Invalid date:', dateString);
        return '날짜 정보 없음';
      }

      return format(date, 'PPP', { locale: ko });
    } catch (error) {
      console.error('날짜 포맷팅 에러:', error, 'dateString:', dateString);
      return '날짜 정보 없음';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>내 문의 목록</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="w-3/4 h-4 mb-2" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (inquiries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>내 문의 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">문의 내역이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>내 문의 목록</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="p-4 transition-colors border rounded-lg cursor-pointer hover:bg-muted/50"
            onClick={() => onInquiryClick(inquiry)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">{inquiry.subject}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{inquiry.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    inquiry.status === '답변완료'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : inquiry.status === '답변중'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {inquiry.status}
                </span>
                {onEditClick && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick(inquiry);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 