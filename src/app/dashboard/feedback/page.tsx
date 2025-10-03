'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockFeedbacks } from '@/lib/data';
import { format } from 'date-fns';
import { Sparkles, Loader2, AlertCircle, Lightbulb } from 'lucide-react';
import { getFeedbackSummary, getSolutionSuggestion } from '@/actions/feedback';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import type { Feedback } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

export default function FeedbackPage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);


  const handleSummarize = async () => {
    setIsLoadingSummary(true);
    setError(null);
    setSummary(null);
    const result = await getFeedbackSummary();
    if ('error' in result) {
      setError(result.error);
    } else {
      setSummary(result.summary);
    }
    setIsLoadingSummary(false);
  };

  const handleCardClick = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setSuggestion(null);
    setSuggestionError(null);
  };
  
  const handleGenerateSuggestion = async () => {
    if (!selectedFeedback) return;
    setIsGeneratingSuggestion(true);
    setSuggestion(null);
    setSuggestionError(null);
    const result = await getSolutionSuggestion({ feedbackContent: selectedFeedback.content });
    if (result.error) {
      setSuggestionError(result.error);
    } else {
      setSuggestion(result.suggestion);
    }
    setIsGeneratingSuggestion(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Phản ánh Cộng đồng</h1>
          <p className="text-muted-foreground">Tiếp nhận và xử lý các phản ánh từ người dân.</p>
        </div>
        <Button onClick={handleSummarize} disabled={isLoadingSummary}>
          {isLoadingSummary ? (
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
          <Card key={feedback.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleCardClick(feedback)}>
            <CardHeader>
              <CardTitle className="text-lg">{feedback.author}</CardTitle>
              <CardDescription>{format(new Date(feedback.timestamp), 'dd/MM/yyyy HH:mm')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground line-clamp-3">{feedback.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedFeedback} onOpenChange={(isOpen) => !isOpen && setSelectedFeedback(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selectedFeedback && (
            <>
              <DialogHeader>
                <DialogTitle>Chi tiết Phản ánh</DialogTitle>
                <DialogDescription>
                  Từ: {selectedFeedback.author} - {format(new Date(selectedFeedback.timestamp), 'dd/MM/yyyy HH:mm')}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">Nội dung phản ánh</h3>
                    <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-md">{selectedFeedback.content}</p>
                </div>
                <Separator />
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Đề xuất xử lý từ AI</h3>
                        <Button size="sm" onClick={handleGenerateSuggestion} disabled={isGeneratingSuggestion}>
                            {isGeneratingSuggestion ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Lightbulb className="mr-2 h-4 w-4"/>}
                            Tạo đề xuất
                        </Button>
                    </div>
                    {isGeneratingSuggestion && <p className="text-sm text-muted-foreground flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> AI đang suy nghĩ...</p>}
                    {suggestionError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Lỗi</AlertTitle><AlertDescription>{suggestionError}</AlertDescription></Alert>}
                    {suggestion && (
                        <div className="text-sm bg-background text-foreground p-4 rounded-md border">
                            <ul className="list-disc list-inside space-y-2">
                                {suggestion.split(/\n- | - /).map((line, index) => {
                                    const cleanedLine = line.replace(/^- /, '');
                                    return cleanedLine.trim() && <li key={index}>{cleanedLine}</li>;
                                })}
                            </ul>
                        </div>
                    )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedFeedback(null)}>Đóng</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
