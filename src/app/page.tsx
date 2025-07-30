import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "無料の日程調整ツール | ムリな日カレンダー",
  description: "飲み会・遊び・イベントの日程調整を最速で！参加できない日を選ぶだけの革新的な日程調整ツール。LINEで簡単共有、登録不要、完全無料。調整さんより簡単に使える。",
  alternates: {
    canonical: "https://murinahi.vercel.app",
  },
};

export default function Home() {
  return <HomeClient />;
}
