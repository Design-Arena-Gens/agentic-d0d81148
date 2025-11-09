"use client";

import { useCallback, useMemo, useState } from "react";
import * as THREE from "three";
import type { SceneCapturePayload } from "@/components/canvas/TehranScene";

type DownloadButtonProps = {
  captureContext: SceneCapturePayload | null;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function DownloadButton({
  captureContext
}: DownloadButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const disabled = !captureContext || isSaving;

  const handleDownload = useCallback(async () => {
    if (!captureContext || isSaving) return;
    setIsSaving(true);

    const { renderer, size, setSize, setDpr, invalidate } = captureContext;

    const originalSize = new THREE.Vector2();
    renderer.getSize(originalSize);
    const originalPixelRatio = renderer.getPixelRatio();

    const aspect = size.width / size.height;
    const targetWidth = 3840;
    const targetHeight = Math.round(targetWidth / aspect);

    try {
      setDpr(2);
      setSize(targetWidth, targetHeight, false, 0, 0);
      invalidate();
      await delay(120);

      const canvas = renderer.domElement;
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((generated) => {
          if (generated) resolve(generated);
          else reject(new Error("Unable to export canvas"));
        }, "image/png");
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tehran-cinematic-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export scene", error);
    } finally {
      setSize(originalSize.x, originalSize.y, false, 0, 0);
      setDpr(originalPixelRatio);
      invalidate();
      setIsSaving(false);
    }
  }, [captureContext, isSaving]);

  const label = useMemo(
    () => (isSaving ? "Rendering…" : "Download 4K Still"),
    [isSaving]
  );

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled}
      className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.26em] text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {label}
    </button>
  );
}
