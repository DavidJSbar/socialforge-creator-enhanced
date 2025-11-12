import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SocialForge Creator - AI-Powered Content Creation',
  description: 'Create unique, platform-optimized content with AI assistance. Multi-platform drafting, niche intelligence, and monetization tracking.',
  keywords: 'content creation, social media, AI, content generator, creator tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
