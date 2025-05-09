// components/CCTVVideoPlayer.tsx
import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface CCTVVideoPlayerProps {
  url: string;
}

export function CCTVVideoPlayer({ url }: CCTVVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (videoRef.current) {
          videoRef.current.play().catch(error => {
            console.error("Error playing video:", error);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Network error:", data);
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Media error:", data);
              hls.recoverMediaError();
              break;
            default:
              console.error("Fatal error:", data);
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = url;
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error);
      });
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      muted
      playsInline
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        backgroundColor: "black"
      }}
    />
  );
}
