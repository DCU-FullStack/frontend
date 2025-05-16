// components/CCTVVideoPlayer.tsx
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useAlert } from "@/contexts/alert-context";

interface CCTVVideoPlayerProps {
  url: string;
  format?: string;  // 'HLS' 또는 'MP4' 형식 지정
}

export function CCTVVideoPlayer({ url, format }: CCTVVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();
  const [isDetectionActive, setIsDetectionActive] = useState(false);


  useEffect(() => {
    if (!videoRef.current) return;

    // HLS 스트리밍 처리
    if (format === 'HLS' || (!format && !url.endsWith('.mp4'))) {
      if (Hls.isSupported()) {
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
              setError("스트리밍 재생 중 오류가 발생했습니다.");
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
                setError("스트리밍 연결 중 오류가 발생했습니다.");
                break;
            }
          }
        });

        return () => {
          hls.destroy();
        };
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = url;
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
          setError("스트리밍 재생 중 오류가 발생했습니다.");
        });
      }
    } 
    // MP4 파일 처리
    else if (format === 'MP4' || url.endsWith('.mp4')) {
      videoRef.current.src = url;
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error);
        setError("비디오 재생 중 오류가 발생했습니다.");
      });
    }
  }, [url, format]);

  return (
    <div className="relative w-full h-full">
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
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="p-4 text-white bg-red-500 rounded-lg">
            {error}
          </div>
        </div>
      )}
      
    </div>
  );
}
