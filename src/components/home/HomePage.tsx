"use client";

import { useState } from "react";
import { AnimatedBackground, GlobalStyles } from "@/components/common";
import { Footer } from "@/components/layout";
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
        </div>

        <Footer />
      </div>
    </div>
  );
}
