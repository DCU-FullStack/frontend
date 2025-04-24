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
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
      return () => {
        hls.destroy();
      };
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari는 기본적으로 HLS를 지원하므로 바로 설정
      videoRef.current.src = url;
    }
  }, [url]);

  return <video ref={videoRef} controls autoPlay muted width="100%" height="auto" />;
}
