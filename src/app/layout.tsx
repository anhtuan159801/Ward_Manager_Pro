import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Ward Manager Pro',
  description: 'WebApp quản lý Tổ trưởng khu phố',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        {/* Dev-only: Remove Next.js Dev Tools floating button injected by dev overlay */}
        {process.env.NODE_ENV === 'development' ? (
          <script
            // Ensure this runs early in body
            dangerouslySetInnerHTML={{
              __html: `
                (function(){
                  const removeButton = () => {
                    try {
                      const btn = document.querySelector('button[data-nextjs-dev-tools-button="true"], [data-nextjs-dev-tools-button], button[aria-label="Open Next.js Dev Tools"]');
                      if (btn && btn.parentElement) {
                        btn.parentElement.removeChild(btn);
                      }
                      const menu = document.querySelector('[data-nextjs-dev-tools-menu]');
                      if (menu && menu.parentElement) {
                        menu.parentElement.removeChild(menu);
                      }
                    } catch (e) {}
                  };
                  removeButton();
                  const obs = new MutationObserver(() => removeButton());
                  obs.observe(document.documentElement, { childList: true, subtree: true });
                })();
              `,
            }}
          />
        ) : null}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
