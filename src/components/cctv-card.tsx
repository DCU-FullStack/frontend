import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import KakaoMap from "@/components/kakaomap";

// 카카오맵 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

type CCTVFeedProps = {
  camera: Camera;
};

const CCTVFeed = ({ camera }: CCTVFeedProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative overflow-hidden bg-gray-200 rounded cursor-pointer group"
      onClick={() => navigate(`/cctv/${camera.id}`)}
    >
      <AspectRatio ratio={16 / 9}>
        <img
          src={camera.imageUrl}
          alt={`CCTV 피드 - ${camera.name}`}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </AspectRatio>
      <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-white bg-black bg-opacity-50">
        <div className="flex items-center justify-between">
          <span>{camera.name}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/cctv/${camera.id}?fullscreen=true`);
            }}
          >
            전체화면
          </Button>
        </div>
      </div>
    </div>
  );
};

export function CCTVCard() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // 카카오맵 API가 로드되었는지 확인
<div className="mb-6">
                <KakaoMap />
            </div>

    return () => {
      // 컴포넌트 언마운트 시 정리
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
        
          <CardTitle className="text-lg font-semibold text-gray-800">실시간 CCTV 모니터링</CardTitle>
          <Button 
            variant="link" 
            className="h-auto p-0 text-sm"
            onClick={() => navigate("/cctv")}
          >
            전체 화면
          </Button>
        </div>
        <div className="mb-1" >
          
                <KakaoMap />
            </div>
      </CardHeader>
      
      {/* <CardContent>
        <div 
          ref={mapRef} 
          style={{ width: "100%", height: "400px", borderRadius: "0.5rem" }}
        />
      </CardContent> */}
    </Card>
  );
}
