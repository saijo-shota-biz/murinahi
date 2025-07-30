import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ムリな日カレンダー | 無料の日程調整ツール - 飲み会・イベントの日程調整を最速で",
    template: "%s | ムリな日カレンダー"
  },
  description: "友達との飲み会や遊びの日程調整が一瞬で完了！参加できない日を選ぶだけの新しい日程調整ツール。LINEグループで簡単共有。登録不要・完全無料。調整さんより簡単。",
  keywords: [
    "日程調整",
    "日程調整ツール",
    "スケジュール調整",
    "飲み会 日程調整",
    "イベント 日程調整",
    "無料 日程調整",
    "調整さん",
    "伝助",
    "出欠確認",
    "予定調整",
    "カレンダー共有",
    "LINE 日程調整",
    "友達 予定合わせ",
    "グループ 日程調整"
  ],
  authors: [{ name: "ムリな日カレンダー" }],
  creator: "ムリな日カレンダー",
  publisher: "ムリな日カレンダー",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "ムリな日カレンダー - 参加できない日を選ぶだけの日程調整",
    description: "友達との予定調整が超簡単！ムリな日を選ぶだけで最適な日程が見つかる。登録不要・完全無料。",
    url: "https://murinahi.vercel.app",
    siteName: "ムリな日カレンダー",
    images: [
      {
        url: "/api/og?title=ムリな日カレンダー&subtitle=参加できない日を選ぶだけの日程調整",
        width: 1200,
        height: 630,
        alt: "ムリな日カレンダー - 新しい日程調整の形",
      }
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ムリな日カレンダー - 逆転の発想で日程調整",
    description: "参加できない日だけ選ぶ、新しい日程調整ツール。友達との予定がサクッと決まる！",
    images: ["/api/og?title=ムリな日カレンダー&subtitle=逆転の発想で日程調整"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://murinahi.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
