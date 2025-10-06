import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getEvents } from '@/lib/data';
import { format } from 'date-fns';
import { PlusCircle, QrCode } from 'lucide-react';
import Image from 'next/image';

export default async function EventsPage() {
  const events = await getEvents();
  const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Quản lý Sự kiện</h1>
          <p className="text-muted-foreground">Tạo và quản lý các sự kiện, hoạt động của khu phố.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tạo Sự kiện
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const qrImage = findImage(event.qrCodeUrl);
          return (
            <Card key={event.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{format(new Date(event.date), 'EEEE, dd/MM/yyyy')}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">QR Đóng góp</span>
                </div>
                {qrImage && (
                  <Image
                    src={qrImage.imageUrl}
                    alt={qrImage.description}
                    data-ai-hint={qrImage.imageHint}
                    width={80}
                    height={80}
                    className="rounded-md border p-1"
                  />
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
