// 基本的な型定義
export type DateString = `${number}-${number}-${number}`;

// Event関連の型は既存のmodel/Event.tsを使用
export type { Event } from "@/types/Event";

// 共通のProps型
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}
