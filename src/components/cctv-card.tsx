import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CCTVVideoPlayer } from "@/components/CCTVVideoPlayer"; // 외부 컴포넌트 임포트

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
    url: "http://cctvsec.ktict.co.kr/1/YSAWT+Et3EUFCGNlki9QLNQUSZ4ytH4wY7KdMIuTmRcL77ywqLzlsZHrqr7vRv/EMHQAvyOmjtvpsohk5ZN2oQ==",
    additionalData: {
      roadsectionid: "",
      cctvresolution: "",
      filecreatetime: "",
      cctvformat: "HLS",
      cctvname: "[수도권제1순환선] 판교분기점",
      cctvurl: "http://cctvsec.ktict.co.kr/1/YSAWT+Et3EUFCGNlki9QLNQUSZ4ytH4wY7KdMIuTmRcL77ywqLzlsZHrqr7vRv/EMHQAvyOmjtvpsohk5ZN2oQ=="
    }
  },
  {
    id: "2",
    cctvtype: 1,
    name: "[수도권제1순환선] 성남",
    coordx: 127.12361,
    coordy: 37.42889,
    url: "http://cctvsec.ktict.co.kr/2/7qZabOhWqOugzM02i27Hv2PJZ/Nmnqem4lv4mTe5xAOkxp3F0Ri1e1FkxreduJh+US0kZKxcLVty2ETLWVOd/A==",
    additionalData: {
      roadsectionid: "",
      cctvresolution: "",
      filecreatetime: "",
      cctvformat: "HLS",
      cctvname: "[수도권제1순환선] 성남",
      cctvurl: "http://cctvsec.ktict.co.kr/2/7qZabOhWqOugzM02i27Hv2PJZ/Nmnqem4lv4mTe5xAOkxp3F0Ri1e1FkxreduJh+US0kZKxcLVty2ETLWVOd/A=="
    }
  },
  {
    id: "3",
    cctvtype: 1,
    name: "[경부선] 서초",
    coordx: 127.02583,
    coordy: 37.48306,
    url: "http://cctvsec.ktict.co.kr/99/udHJ/JiVQEjQlNCivyP8ruueDbV5mGFoarTlt/N+yQjdq1DigS8WPbnVh5O+AUptOrLxW1sDnuSe9kSov1X1ydITK/D54U+SNoVmLYFAJKY=",
    additionalData: {
      roadsectionid: "",
      cctvresolution: "",
      filecreatetime: "",
      cctvformat: "HLS",
      cctvname: "[경부선] 서초",
      cctvurl: "http://cctvsec.ktict.co.kr/99/udHJ/JiVQEjQlNCivyP8ruueDbV5mGFoarTlt/N+yQjdq1DigS8WPbnVh5O+AUptOrLxW1sDnuSe9kSov1X1ydITK/D54U+SNoVmLYFAJKY="
    }
  }
];

// CCTVVideoPlayer 컴포넌트 제거 (외부 파일에서 임포트)

export function CCTVCard() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedCCTV, setSelectedCCTV] = useState<any>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        if (mapRef.current) {
          const options = {
            center: new window.kakao.maps.LatLng(36.533333, 127.900000),
            level: 13,
          };
          const map = new window.kakao.maps.Map(mapRef.current, options);
          mapInstanceRef.current = map;

          // CCTV 데이터를 마커로 추가
          cctvData.forEach((camera) => {
            const marker = new window.kakao.maps.Marker({
              map: map,
              position: new window.kakao.maps.LatLng(camera.coordy, camera.coordx),
            });

            // 마커 클릭 시 CCTV 스트리밍 보여주기
            window.kakao.maps.event.addListener(marker, "click", () => {
              console.log("마커 클릭됨:", camera.name);
              setSelectedCCTV(camera); // CCTV 정보 설정
              setShowVideo(true); // 비디오 표시 상태 활성화
            });
          });
        }
      });
    } else {
      console.error("카카오맵 API가 로드되지 않았습니다.");
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 비디오 닫기 함수
  const closeVideo = () => {
    setShowVideo(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            실시간 CCTV 모니터링
          </CardTitle>
          
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row">
          <div
            ref={mapRef}
            style={{
              width: "100%",
              height: "405px",
              borderRadius: "0.5rem",
              overflow: "hidden",
              marginTop: "23px",
            }}
            className="md:w-1/2"
          />
          {showVideo && selectedCCTV && (
            <div className="md:w-1/2 ">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{selectedCCTV.name}</h3>
                <button 
                  onClick={closeVideo}
                  style={{ 
                    background: "white", 
                    color: "black", 
                    border: "none", 
                    borderRadius: "50%", 
                    width: "24px", 
                    height: "24px", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center" 
                  }}
                >
                  ×
                </button>
              </div>
              <CCTVVideoPlayer url={selectedCCTV.url} />
            </div>
          )}
          {!showVideo && (
            <div className="flex items-center justify-center hidden bg-gray-100 rounded-lg md:block md:w-1/2">
              <p className="text-gray-500">CCTV를 선택하면 여기에 영상이 표시됩니다</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
