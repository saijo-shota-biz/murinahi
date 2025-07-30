"use client";

import { useState } from "react";
import { createEvent } from "@/app/actions";

export default function HomeClient() {
  const [url, setUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [justCopied, setJustCopied] = useState(false);

  const genUrl = (eventId: string) => {
    return `${window.location.origin}/event/${eventId}`;
  };

  const handleClickTest = async () => {
    setIsCreating(true);
    try {
      const eventId = await createEvent();
      const url = genUrl(eventId);
      setUrl(url);
      await copyToClipboard(url);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    } catch (err) {
      console.error("URLのコピーに失敗しました:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 md:-top-40 md:-right-40 w-40 h-40 md:w-80 md:h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 md:-bottom-40 md:-left-40 w-40 h-40 md:w-80 md:h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-80 md:h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* Logo/Title with animation */}
          <div className="mb-8 animate-fade-in-down mt-8">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-gray-800 mb-2 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500">ムリな日</span>
              <span className="text-gray-800">カレンダー</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <div className="h-px bg-gray-300 w-12 sm:w-16"></div>
              <p className="text-xs sm:text-sm font-medium uppercase tracking-wide">Since 2025</p>
              <div className="h-px bg-gray-300 w-12 sm:w-16"></div>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 sm:mb-12 leading-relaxed animate-fade-in-up px-4">
            参加できない日だけ選ぶ、
            <br />
            <span className="font-bold text-red-500">逆転の発想</span>
            で最速調整
          </p>

          {/* Main CTA */}
          {!url ? (
            <button
              type="button"
              onClick={handleClickTest}
              disabled={isCreating}
              className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-slow"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isCreating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <title>読み込み中</title>
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    作成中...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <title>イベント作成</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    イベントを作る
                  </>
                )}
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          ) : (
            <div className="animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
                  <p className="text-sm font-medium text-gray-600">作成完了！URLを共有してください</p>
                  <div
                    className={`transition-all duration-300 ${justCopied ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-2"}`}
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
                  <button
                    type="button"
                    onClick={() => copyToClipboard(url)}
                    className="flex-shrink-0 bg-gray-800 hover:bg-gray-900 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <title>コピー</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    コピー
                  </button>
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
          )}

          {/* Features */}
          <div className="mt-16 sm:mt-20 mb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 animate-fade-in-up animation-delay-500 px-4 sm:px-0">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <title>カレンダーアイコン</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">かんたん操作</h3>
              <p className="text-sm text-gray-600">ムリな日をタップするだけ。難しい設定は一切なし</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <title>ユーザーアイコン</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">登録不要</h3>
              <p className="text-sm text-gray-600">アカウント作成なし。URLを共有するだけで即スタート</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <title>稲妻アイコン</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">超高速</h3>
              <p className="text-sm text-gray-600">参加できない日だけ選ぶから、調整が一瞬で完了</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-8 pb-4 sm:pb-6 text-center px-4">
          <p className="text-xs text-gray-500">© 2025 ムリな日カレンダー ・ 完全無料でご利用いただけます</p>
        </footer>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
          animation-fill-mode: backwards;
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}