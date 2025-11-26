import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clinic Flow',
  description: 'Chiropractor-first automation toolkits',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
