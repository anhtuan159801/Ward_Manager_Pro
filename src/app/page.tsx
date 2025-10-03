import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-100 via-blue-200 to-purple-100 dark:from-blue-900/50 dark:via-slate-900 dark:to-purple-900/50">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
             <div className="bg-primary p-3 rounded-full text-primary-foreground">
                <Sparkles className="h-8 w-8" />
             </div>
          </div>
          <CardTitle className="font-headline text-4xl">Ward Manager Pro</CardTitle>
          <CardDescription className="pt-2">Hệ thống quản lý khu phố thông minh</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-6">
            Đăng nhập để bắt đầu quản lý cư dân, sự kiện, và hơn thế nữa với sự trợ giúp từ AI.
          </p>
          <Link href="/dashboard" className="w-full">
            <Button className="w-full text-lg py-6 font-bold">Đăng nhập</Button>
          </Link>
        </CardContent>
      </Card>
      <footer className="mt-8 text-sm text-muted-foreground">
        <p>Phát triển bởi Gemini & Firebase Studio</p>
      </footer>
    </main>
  );
}
