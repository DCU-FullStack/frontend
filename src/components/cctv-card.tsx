import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 카카오맵 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

// CCTV 데이터 샘플
const cctvData = [
  {
    id: "1",
    cctvtype: 1,
    name: "[수도권제1순환선]판교분기점",
    coordx: 127.09706,
    coordy: 37.40665,
    url: "http://cctvsec.ktict.co.kr/1/tBJ0WDtSxXfRYgkgzKTz8bQFKv6DK/eDFFT/uQpYir/e9OP552JziFeEDB+CRIALJwLPlCT0MMxj3KWtNIItJw==",
    additionalData: {
      roadsectionid: "",
      cctvresolution: "",
      filecreatetime: "",
      cctvformat: "HLS",
      cctvname: "[수도권제1순환선] 판교분기점",
      cctvurl: "http://cctvsec.ktict.co.kr/1/tBJ0WDtSxXfRYgkgzKTz8bQFKv6DK/eDFFT/uQpYir/e9OP552JziFeEDB+CRIALJwLPlCT0MMxj3KWtNIItJw=="
    }
  },
  {
    id: "2",
    name: "[수도권제1순환선]성남",
    coordx: 127.12361,
    coordy: 37.42889,
    url: "http://example.com/2"
  }
  // 추가 데이터 작성...
];

export function CCTVCard() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // 카카오맵 API가 로드되었는지 확인
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        if (mapRef.current) {
          const options = {
            center: new window.kakao.maps.LatLng(37.40665, 127.09706), // 초기 중심 좌표
            level: 13 // 지도 레벨
          };
          const map = new window.kakao.maps.Map(mapRef.current, options);
          mapInstanceRef.current = map;

          // CCTV 데이터를 마커로 추가
          cctvData.forEach((camera) => {
            const marker = new window.kakao.maps.Marker({
              map: map,
              position: new window.kakao.maps.LatLng(camera.coordy, camera.coordx)
            });

            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:10px;"><strong>${camera.name}</strong><br><a href="${camera.url}" target="_blank">스트리밍 보기</a></div>`
            });

            // 마커 클릭 이벤트 추가
            window.kakao.maps.event.addListener(marker, "click", () => {
              infowindow.open(map, marker);
            });
          });
        }
      });
    } else {
      console.error("카카오맵 API가 로드되지 않았습니다.");
    }

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
          <CardTitle className="text-lg font-semibold text-gray-800">
            실시간 CCTV 모니터링
          </CardTitle>
          <Button
            variant="link"
            className="h-auto p-0 text-sm"
            onClick={() => navigate("/cctv")}
          >
            전체 화면
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "400px",
            borderRadius: "0.5rem",
            overflow: "hidden"
          }}
        />
      </CardContent>
    </Card>
  );
}