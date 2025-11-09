"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { SceneCapturePayload } from "@/components/canvas/TehranScene";
import DownloadButton from "@/components/ui/DownloadButton";

const TehranScene = dynamic(() => import("@/components/canvas/TehranScene"), {
  ssr: false
});

export default function HomePage() {
  const [captureContext, setCaptureContext] =
    useState<SceneCapturePayload | null>(null);

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
      <div className="pointer-events-none absolute -left-1/4 top-0 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,106,197,0.24),_rgba(11,15,26,0))] blur-3xl" />
      <div className="pointer-events-none absolute right-[-20%] top-1/3 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(167,196,255,0.13),_rgba(11,15,26,0))] blur-3xl" />
      <section className="relative z-10 w-full max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.55em] text-slate-200/60">
            Tehran Cinematic Rendering
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
            Mist-laden evening over Azadi Square
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-200/75">
            A hyper-realistic portrayal of Tehran at blue hour. Layers of fog,
            diffused daylight, and architectural lights blend together to evoke
            a cinematic ambience across the skyline.
          </p>
        </div>

        <div className="relative mt-10 aspect-[21/9] w-full overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-white/4 via-white/2 to-transparent shadow-cinematic">
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-night-900/68 via-night-900/10 to-transparent pointer-events-none" />
          <TehranScene onCaptureReady={setCaptureContext} />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/40 via-black/5 to-transparent" />
          <div className="absolute inset-x-8 bottom-8 z-30 flex justify-end">
            <DownloadButton captureContext={captureContext} />
          </div>
        </div>

        <div className="mt-8 grid gap-6 text-sm text-slate-200/70 md:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-100">
              Weather
            </h2>
            <p className="mt-2 leading-relaxed">
              Heavy stratiform clouds filtering the late-day sun, producing a
              dramatic soft contrast across the skyline.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-100">
              Atmosphere
            </h2>
            <p className="mt-2 leading-relaxed">
              Volumetric fog evolving through the city blocks, capturing the
              humidity and depth of a metropolitan dusk.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-100">
              Composition
            </h2>
            <p className="mt-2 leading-relaxed">
              Centered on the Azadi Tower with sweeping city layers to frame the
              monument in cinematic perspective.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
