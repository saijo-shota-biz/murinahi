import { Button } from "@/components/ui";
import { useClipboard } from "@/hooks";

interface EventUrlDisplayProps {
  url: string;
}

export function EventUrlDisplay({ url }: EventUrlDisplayProps) {
  const { copyToClipboard, justCopied } = useClipboard();

  return (
    <div className="animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
          <p className="text-sm font-medium text-gray-600">作成完了！URLを共有してください</p>
          <div
            className={`transition-all duration-300 ${
              justCopied ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-2"
            }`}
          >
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>コピー完了</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              コピーしました！
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full">
          <div className="flex-1 bg-gray-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm text-gray-700 overflow-x-auto">
            {url}
          </div>
          <Button variant="secondary" onClick={() => copyToClipboard(url)} className="flex-shrink-0">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>コピー</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            コピー
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <a
            href={url}
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
          >
            イベントページへ移動
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>右矢印</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
