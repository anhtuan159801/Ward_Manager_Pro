'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Megaphone, Loader2, Copy, WandSparkles } from 'lucide-react';
import { generatePropagandaAction } from '@/actions/propaganda';
import { useToast } from '@/hooks/use-toast';
import { cn, copyToClipboard } from '@/lib/utils';

const formSchema = z.object({
  topic: z.string().min(5, { message: 'Chủ đề phải có ít nhất 5 ký tự.' }),
  tone: z.string().min(3, { message: 'Vui lòng chọn một giọng điệu.' }),
  targetAudience: z.string().min(3, { message: 'Vui lòng chọn một đối tượng.' }),
  desiredOutcome: z.string().min(10, { message: 'Kết quả mong muốn phải có ít nhất 10 ký tự.' }),
  additionalContext: z.string().optional(),
});

const TONE_OPTIONS = ["Thân mật", "Kêu gọi", "Trang trọng", "Vui vẻ", "Cổ động"];
const AUDIENCE_OPTIONS = ["Tất cả người dân", "Các hộ gia đình", "Thanh niên", "Người cao tuổi", "Phụ nữ", "Trẻ em"];

export default function AiPropagandaPage() {
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      tone: '',
      targetAudience: '',
      desiredOutcome: '',
      additionalContext: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedMessage(null);
    const result = await generatePropagandaAction(values);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: result.error,
      });
    } else {
      setGeneratedMessage(result.message);
    }
    setIsLoading(false);
  }

  const handleCopy = async () => {
    if (!generatedMessage) return;
    const ok = await copyToClipboard(generatedMessage);
    toast({
      variant: ok ? 'default' : 'destructive',
      title: ok ? 'Thành công' : 'Lỗi',
      description: ok ? 'Đã sao chép nội dung vào clipboard.' : 'Trình duyệt không cho phép sao chép tự động.',
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Tuyên truyền với AI</h1>
          <p className="text-muted-foreground">Tạo nhanh thông điệp, khẩu hiệu, bài viết vận động với Gemini.</p>
        </div>
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CardHeader>
                <CardTitle>Nhập thông tin</CardTitle>
                <CardDescription>Cung cấp chi tiết để AI tạo thông điệp hiệu quả nhất.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chủ đề</FormLabel>
                      <FormControl>
                        <Input placeholder="VD: Giữ gìn vệ sinh chung" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giọng điệu</FormLabel>
                       <FormControl>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {TONE_OPTIONS.map(option => (
                            <Button
                              key={option}
                              type="button"
                              variant={field.value === option ? "default" : "outline"}
                              onClick={() => field.onChange(option)}
                              className="rounded-full"
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đối tượng</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {AUDIENCE_OPTIONS.map(option => (
                            <Button
                              key={option}
                              type="button"
                              variant={field.value === option ? "default" : "outline"}
                              onClick={() => field.onChange(option)}
                              className="rounded-full"
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="desiredOutcome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kết quả mong muốn</FormLabel>
                      <FormControl>
                        <Textarea placeholder="VD: Người dân nâng cao ý thức, tích cực tham gia dọn dẹp..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thông tin bổ sung (tùy chọn)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="VD: Trích dẫn câu nói của Bác Hồ..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
                  Tạo thông điệp
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Thông điệp được tạo</CardTitle>
          <CardDescription>Đây là bản nháp do AI tạo ra. Bạn có thể sao chép và sử dụng.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <Textarea
            readOnly
            value={generatedMessage || "Thông điệp tuyên truyền sẽ xuất hiện ở đây..."}
            className="h-full min-h-[300px] text-base resize-none whitespace-pre-wrap"
          />
        </CardContent>
        {generatedMessage && (
          <CardFooter className="justify-end pt-4">
            <Button variant="outline" onClick={handleCopy}><Copy className="mr-2 h-4 w-4" /> Sao chép</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
