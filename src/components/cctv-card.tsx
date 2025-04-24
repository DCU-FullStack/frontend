import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    name: "[수도권제1순환선] 성남요금소",
    coordx: 127.12262,
    coordy: 37.43909,
    url: "http://cctvsec.ktict.co.kr/3/gGZjhJMat4zccHvm0cA2OaejS+UZL18fL6YXg6/5KPFg8XhzJmNpddNEPfX1ND6HzDmf8l0ZXZf7/kGf75a8Ig==",
    additionalData: {
      roadsectionid: "",
      cctvresolution: "",
      filecreatetime: "",
      cctvformat: "HLS",
      cctvname: "[수도권제1순환선] 성남요금소",
      cctvurl: "http://cctvsec.ktict.co.kr/3/gGZjhJMat4zccHvm0cA2OaejS+UZL18fL6YXg6/5KPFg8XhzJmNpddNEPfX1ND6HzDmf8l0ZXZf7/kGf75a8Ig=="
    }
  },
  {
    id: "4",
    cctvtype: 1,
    name: "[수도권제1순환선] 송파",
    coordx: 127.12944,
    coordy: 37.475,
    url: "http://cctvsec.ktict.co.kr/4/GVhILHEd/pi56yqbhMHzLz7ZjbC4ZWFB+gGOHDVvCZX63ithbUDzcAUqJKU7NUi+rU9k7H68N6isUcwNLV9I+g==",
    additionalData: {
      roadsectionid: "",
      cctvresolution: "",
      filecreatetime: "",
      cctvformat: "HLS",
      cctvname: "[수도권제1순환선] 송파",
      cctvurl: "http://cctvsec.ktict.co.kr/4/GVhILHEd/pi56yqbhMHzLz7ZjbC4ZWFB+gGOHDVvCZX63ithbUDzcAUqJKU7NUi+rU9k7H68N6isUcwNLV9I+g=="
    }
  },
  {
    id: "5",
    cctvtype: 1,
    name: "[수도권제1순환선] 서하남2",
    coordx: 127.14972,
    coordy: 37.51167,
    url: "http://cctvsec.ktict.co.kr/5/ykaf4YsdBbKaZAe8taq+Kmh42lFPh0bjjopNrHEOL9gi6Wp+5Lf4edgFtTo8OsX89tqC5q8T0+ryaTEO7DwcxQ==",
    additionalData: {
      roadsectionid: "",
      cctvresolution: "",
      filecreatetime: "",
      cctvformat: "HLS",
      cctvname: "[수도권제1순환선] 서하남2",
      cctvurl: "http://cctvsec.ktict.co.kr/5/ykaf4YsdBbKaZAe8taq+Kmh42lFPh0bjjopNrHEOL9gi6Wp+5Lf4edgFtTo8OsX89tqC5q8T0+ryaTEO7DwcxQ=="
    }
  },
  {
    id: "6",
    cctvtype: 1,
    name: "[수도권제1순환선] 광암터널2",
    coordx: 127.173364,
    coordy: 37.516332,
    url: "http://cctvsec.ktict.co.kr/6/wVDjzXeNkTw4HWrpW1Q7XSnuHrHDQd26gVKtTISe1e05qROAbxktgqaK4dfVnFnKpqsEo7IeaY+g0b6kg8qYMg==",
    additionalData: {
      roadsectionid: "",
      cctvresolution: "",
      filecreatetime: "",
      cctvformat: "HLS",
      cctvname: "[수도권제1순환선] 광암터널2",
      cctvurl: "http://cctvsec.ktict.co.kr/6/wVDjzXeNkTw4HWrpW1Q7XSnuHrHDQd26gVKtTISe1e05qROAbxktgqaK4dfVnFnKpqsEo7IeaY+g0b6kg8qYMg=="
    }
  },
  {
    id: "7",
    cctvtype: 1,
    name: "[수도권제1순환선] 광암터널3",
    coordx: 127.1866667,
    coordy: 37.51916667,
    url: "http://cctvsec.ktict.co.kr/7/H/QJ+dsm3BhsgkgRLGF2Ff0N5j+W2YflqXGUAm2f+tAUfjUjC1IIlrL1qJ2Nia5ZWpKCowO6+H5nQhLAZJxFDw==",
    additionalData: {
      roadsectionid: "",
      cctvresolution: "",
      filecreatetime: "",
      cctvformat: "HLS",
      cctvname: "[수도권제1순환선] 광암터널3",
      cctvurl: "http://cctvsec.ktict.co.kr/7/H/QJ+dsm3BhsgkgRLGF2Ff0N5j+W2YflqXGUAm2f+tAUfjUjC1IIlrL1qJ2Nia5ZWpKCowO6+H5nQhLAZJxFDw=="
    }
  },
  {
    id: "8",
    cctvtype: 1,
    name: "[수도권제1순환선] 하남분기점",
    coordx: 127.19361,
    coordy: 37.5325,
    url: "http://cctvsec.ktict.co.kr/8/4AucnLPnDz3ZzPoKpY/IV5V4igqv5imb12/rRotFHWcqe3yTh//cZi/SjI7TTtBjsftd8Y0MnnQlBdBjpKC24Q==",
    additionalData: {
      roadsectionid: "",
      cctvresolution: "",
      filecreatetime: "",
      cctvformat: "HLS",
      cctvname: "[수도권제1순환선] 하남분기점",
      cctvurl: "http://cctvsec.ktict.co.kr/8/4AucnLPnDz3ZzPoKpY/IV5V4igqv5imb12/rRotFHWcqe3yTh//cZi/SjI7TTtBjsftd8Y0MnnQlBdBjpKC24Q=="
    }
  },
  {
    id: "9",
    cctvtype: 1,
    name: "[수도권제1순환선] 상일",
    coordx: 127.181422,
    coordy: 37.5457231,
    url: "http://cctvsec.ktict.co.kr/9/G66qoCCPZmx1TCAriKEjl2NEaZmQBvAYuaxU1I1EjDaGYHk2x8zw3xg+Nu2NlQRasYI/0UI+v9hnbXAyT6RbCw==",
    additionalData: {
      roadsectionid: "",
      cctvresolution: "",
      filecreatetime: "",
      cctvformat: "HLS",
      cctvname: "[수도권제1순환선] 상일",
      cctvurl: "http://cctvsec.ktict.co.kr/9/G66qoCCPZmx1TCAriKEjl2NEaZmQBvAYuaxU1I1EjDaGYHk2x8zw3xg+Nu2NlQRasYI/0UI+v9hnbXAyT6RbCw=="
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
            center: new window.kakao.maps.LatLng(37.40665, 127.09706),
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
            overflow: "hidden",
          }}
        />
        {showVideo && selectedCCTV && (
          <div style={{ marginTop: "20px", position: "relative" }}>
            <div className="flex items-center justify-between mb-2">
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
      </CardContent>
    </Card>
  );
}
