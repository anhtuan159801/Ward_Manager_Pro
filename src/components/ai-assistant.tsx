'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Sparkles, Bot, UserIcon, Send, Loader2 } from 'lucide-react'; // Renamed User to UserIcon
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getUser } from '@/lib/data';
import { cn } from '@/lib/utils';
import { answerSystemQuery } from '@/actions/assistant';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types'; // Import User type

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null); // State for user data
  const { toast } = useToast();

  // Fetch user data when the sheet opens and messages are empty
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const fetchUser = async () => {
        try {
          const userData = await getUser();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user:', error);
          setUser(null);
        }
      };
      fetchUser();
    }
  }, [isOpen, messages.length]); // Depend on isOpen and messages.length

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Safely handle the result of answerSystemQuery
    const result = await answerSystemQuery({ query: input });

    if ('error' in result) { // Check if error property exists
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: result.error,
      });
      setMessages(prev => prev.filter(m => m !== userMessage)); // Remove the user message if there's an error
    } else {
      const assistantMessage: Message = { role: 'assistant', content: result.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    }

    setIsLoading(false);
  };
  
  const handleSheetOpenChange = (open: boolean) => {
    setIsOpen(open);
    if(open && messages.length === 0){
        // Add welcome message
        setTimeout(() => {
             setMessages([{
                role: 'assistant',
                content: "Xin chào! Tôi là Trợ lý AI của WardPro. Tôi có thể giúp gì cho bạn hôm nay? Bạn có thể hỏi tôi về tình hình cư dân, các sự kiện sắp tới, hoặc các phản ánh cần xử lý."
            }]);
        }, 300);
    }
  }

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-20"
        size="icon"
        onClick={() => handleSheetOpenChange(true)}
      >
        <Sparkles className="h-8 w-8" />
        <span className="sr-only">Mở Trợ lý AI</span>
      </Button>

      <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="flex flex-col w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Bot /> Trợ lý AI WardPro
            </SheetTitle>
            <SheetDescription>
              Hỏi bất cứ điều gì về dữ liệu hệ thống của bạn.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-6 py-6 pr-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                     <Avatar className="h-8 w-8 border">
                        <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-xl p-3 text-sm whitespace-pre-wrap',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    )}
                  >
                    {message.content}
                  </div>
                   {message.role === 'user' && user && ( // Conditionally render if user data exists
                        <Avatar className="h-8 w-8">
                           <AvatarImage src={user.avatarUrl} alt={user.name} />
                           <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                       </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8 border">
                        <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                     <div className="bg-secondary text-secondary-foreground rounded-xl p-3 text-sm flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Đang suy nghĩ...</span>
                     </div>
                 </div>
              )}
            </div>
          </ScrollArea>
          <div className="relative mt-auto -mx-6 px-6 pt-4 border-t">
            <Input
              placeholder="Hỏi về tình hình dân cư..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-8 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
