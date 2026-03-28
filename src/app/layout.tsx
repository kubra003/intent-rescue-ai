import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IntentRescue AI - Emergency Intelligence',
  description: 'Mission-critical Gemini-powered bridge between chaotic human emergencies and structured life-saving actions.',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-red-600 selection:text-white bg-gray-950">
        {children}
      </body>
    </html>
  );
}
