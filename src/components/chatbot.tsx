import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "안녕하세요! 무엇을 도와드릴까요?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // 사용자 메시지 추가
    setMessages(prev => [...prev, { text: inputMessage, isUser: true }]);
    
    // 챗봇 응답 (실제로는 API 호출 등으로 대체)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "죄송합니다. 현재 개발 중인 기능입니다. 문의사항은 고객센터 문의하기를 이용해 주세요.", 
        isUser: false 
      }]);
    }, 1000);

    setInputMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-24 right-0 w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* 챗봇 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <div className="flex items-center gap-2">
                <img src="/chat1.png" alt="챗봇" className="w-5 h-5" />
                <span className="font-semibold">AI 챗봇</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* 메시지 영역 */}
            <div className="h-[calc(100%-8rem)] overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.isUser
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* 입력 영역 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <Button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 챗봇 토글 버튼 */}
      <div className="flex flex-col items-center">
        <div
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="cursor-pointer transition-transform hover:scale-110"
        >
          <img 
            src={isHovered ? "/chat.gif" : "/chat1.png"} 
            alt="챗봇" 
            className={`${isHovered ? 'w-16 h-16' : 'w-12 h-12'}`}
          />
        </div>
        <span className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-300">AI 챗봇</span>
      </div>
    </div>
  );
} 