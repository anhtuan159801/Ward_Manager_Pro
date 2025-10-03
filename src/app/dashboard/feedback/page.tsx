'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockFeedbacks } from '@/lib/data';
import { format } from 'date-fns';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { getFeedbackSummary } from '@/actions/feedback';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function FeedbackPage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);
    const result = await getFeedbackSummary();
    if ('error' in result) {
      setError(result.error);
    } else {
      setSummary(result.summary);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Phản ánh Cộng đồng</h1>
          <p className="text-muted-foreground">Tiếp nhận và xử lý các phản ánh từ người dân.</p>
        </div>
        <Button onClick={handleSummarize} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Tóm tắt với AI
        </Button>
      </div>

      {(summary || error) && (
        <Alert variant={error ? 'destructive' : 'default'} className="max-w-3xl">
          {error ? <AlertCircle className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          <AlertTitle>{error ? 'Lỗi' : 'Tóm tắt từ AI'}</AlertTitle>
          <AlertDescription>
            {error || summary}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockFeedbacks.map((feedback) => (
          <Card key={feedback.id}>
            <CardHeader>
              <CardTitle className="text-lg">{feedback.author}</CardTitle>
              <CardDescription>{format(new Date(feedback.timestamp), 'dd/MM/yyyy HH:mm')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">{feedback.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
