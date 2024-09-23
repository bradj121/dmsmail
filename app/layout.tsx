import '@/app/ui/global.css';
import { vt323 } from './ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${vt323.className} antialiased`}>{children}</body>
    </html>
  );
}
