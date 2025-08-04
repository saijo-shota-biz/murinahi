"use client";

import { useState } from "react";
import { AnimatedBackground, GlobalStyles } from "@/components/common";
import { Footer } from "@/components/layout";
import { TwitterShareButton, CopyShareButton } from "@/components/share";
import { HeroSection } from "./HeroSection";
import { Tagline } from "./Tagline";
import { EventForm } from "./EventForm";
import { EventUrlDisplay } from "./EventUrlDisplay";
import { FeatureGrid } from "./FeatureGrid";

export function HomePage() {
  const [url, setUrl] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 relative overflow-hidden">
      <AnimatedBackground />
      <GlobalStyles />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          <HeroSection />
          <Tagline />

          {!url ? <EventForm onEventCreated={setUrl} /> : <EventUrlDisplay url={url} />}

          <FeatureGrid />

          <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 animate-fade-in-up animation-delay-700">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 rounded-full mb-3">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <title>ハートアイコン</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">
                  気に入っていただけましたか？
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                ムリな日カレンダーをお友達にもシェアしていただけると嬉しいです✨
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <TwitterShareButton variant="primary" />
              <CopyShareButton variant="secondary" />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
