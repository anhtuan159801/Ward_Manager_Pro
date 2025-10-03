'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, Send, FileDown, Copy } from 'lucide-react';
import { generateContentAction } from '@/actions/content';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  contentType: z.enum(['announcement', 'report', 'invitation'], {
    required_error: "Vui lòng chọn loại nội dung."
  }),
  topic: z.string().min(5, { message: 'Chủ đề phải có ít nhất 5 ký tự.' }),
  targetAudience: z.string().min(3, { message: 'Đối tượng phải có ít nhất 3 ký tự.' }),
  additionalContext: z.string().optional(),
});

export default function AiContentPage() {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentType: 'announcement',
      topic: '',
      targetAudience: '',
      additionalContext: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedContent(null);
    const result = await generateContentAction(values);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: result.error,
      });
    } else {
      setGeneratedContent(result.draftContent);
    }
    setIsLoading(false);
  }

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      toast({
        title: 'Thành công',
        description: 'Đã sao chép nội dung vào clipboard.',
      });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Soạn thảo với AI</h1>
          <p className="text-muted-foreground">Tạo nhanh thông báo, báo cáo, thư mời với Gemini.</p>
        </div>
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Nhập thông tin</CardTitle>
                <CardDescription>Cung cấp chi tiết để AI tạo nội dung chính xác nhất.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại nội dung</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Chọn loại văn bản" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="announcement">Thông báo</SelectItem>
                          <SelectItem value="report">Báo cáo</SelectItem>
                          <SelectItem value="invitation">Thư mời</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chủ đề</FormLabel>
                      <FormControl>
                        <Input placeholder="VD: Họp tổ dân phố tháng 9" {...field} />
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
                        <Input placeholder="VD: Toàn thể cư dân tổ 12" {...field} />
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
                        <Textarea placeholder="VD: Nội dung họp bao gồm..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Tạo nội dung
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Nội dung được tạo</CardTitle>
          <CardDescription>Đây là bản nháp do AI tạo ra. Vui lòng xem lại và chỉnh sửa.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <Textarea
            readOnly
            value={generatedContent || "Nội dung sẽ xuất hiện ở đây..."}
            className="h-full min-h-[300px] text-base resize-none"
          />
        </CardContent>
        {generatedContent && (
          <CardFooter className="flex-col sm:flex-row gap-2 justify-end pt-4">
            <Button variant="outline" onClick={handleCopy}><Copy className="mr-2 h-4 w-4" /> Sao chép</Button>
            <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Xuất PDF</Button>
            <Button><Send className="mr-2 h-4 w-4" /> Gửi thông báo</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
