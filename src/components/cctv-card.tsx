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
    name: "[동해선] 강릉분기점",
    coordx: 128.834702,
    coordy: 37.77278,
    url: "http://cctvsec.ktict.co.kr/2127/3Wn5iIfmjx2tS8+M5LXsboHpjySZuTMyNZK5Ebrn5OOPKlGy7xlYWqmdV04egYp58EHZJptF+jEIcyOb8Lo7hiXzhlUh0EMYgF2eTL0B0As=",
    additionalData: {
      roadsectionid: "",
      cctvresolution: "",
      filecreatetime: "",
      cctvformat: "HLS",
      cctvname: "[동해선] 강릉분기점",
      cctvurl: "http://cctvsec.ktict.co.kr/2127/3Wn5iIfmjx2tS8+M5LXsboHpjySZuTMyNZK5Ebrn5OOPKlGy7xlYWqmdV04egYp58EHZJptF+jEIcyOb8Lo7hiXzhlUh0EMYgF2eTL0B0As="
    }
  },
  {
    id: "2",
    cctvtype: 1,
    name: "[익산포항선] 포항",
    coordx: 129.3116527,
    coordy: 36.0443321,
    url: "http://cctvsec.ktict.co.kr/2223/sNU2xFU2Ue5pLJfT9oymKpREYd9J0fBKBrqprSXaIv2e4tKhly4bTjnDS7ny4DfY1dnOX+6CyQTNruXijF9mCpoH+waepF1aoZeBY/Cxf6A=",
    additionalData: {
      roadsectionid: "",
      cctvresolution: "",
      filecreatetime: "",
      cctvformat: "HLS",
      cctvname: "[익산포항선] 포항",
      cctvurl: "http://cctvsec.ktict.co.kr/2223/sNU2xFU2Ue5pLJfT9oymKpREYd9J0fBKBrqprSXaIv2e4tKhly4bTjnDS7ny4DfY1dnOX+6CyQTNruXijF9mCpoH+waepF1aoZeBY/Cxf6A="
    }
  },
  {
    "id": "3",
    "cctvtype": 1,
    "name": "[부산울산선] 해운대",
    "coordx": 129.18417,
    "coordy": 35.17806,
    "url": "http://cctvsec.ktict.co.kr/2125/ZTUyNy1itRDJXNpcPRKbJN6hyf32DLgKMzAzkcGS2vA14T2fbOM/O7oSosDKnnIL7HHy+zNNoUi1JmbMbzfDu3/RdE5eOF71xqqa66AhlO8=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[부산울산선] 해운대",
      "cctvurl": "http://cctvsec.ktict.co.kr/2125/ZTUyNy1itRDJXNpcPRKbJN6hyf32DLgKMzAzkcGS2vA14T2fbOM/O7oSosDKnnIL7HHy+zNNoUi1JmbMbzfDu3/RdE5eOF71xqqa66AhlO8="
    }
  },
  {
    "id": "4",
    "cctvtype": 1,
    "name": "[남해선] 축동정류장",
    "coordx": 128.055918,
    "coordy": 35.088476,
    "url": "http://cctvsec.ktict.co.kr/2516//QIP6IaVn16B2M3+AF3BWfBtoNQfrli5UVYp2z4zbdeAtU6Xm1qWguIegHmEBGSMc8KRurPEa/5HKOORp/xpu43CiGWFt8m3wmc9hZasmmU=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[남해선] 축동정류장",
      "cctvurl": "http://cctvsec.ktict.co.kr/2516//QIP6IaVn16B2M3+AF3BWfBtoNQfrli5UVYp2z4zbdeAtU6Xm1qWguIegHmEBGSMc8KRurPEa/5HKOORp/xpu43CiGWFt8m3wmc9hZasmmU="
    }
  },
  {
    "id": "5",
    "cctvtype": 1,
    "name": "[순천완주선] 순천분기점",
    "coordx": 127.537711,
    "coordy": 34.990836,
    "url": "http://cctvsec.ktict.co.kr/2624/icBE5GZ0WWkKyhVBnn07PgBSg48Ju4rvFB6D88CNOPg1B3hCoBVp8jjSNeHsaZO0l5porGg04bBZmHp40XblNyVgm4yTASVtD6iv6KCfb4g=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[순천완주선] 순천분기점",
      "cctvurl": "http://cctvsec.ktict.co.kr/2624/icBE5GZ0WWkKyhVBnn07PgBSg48Ju4rvFB6D88CNOPg1B3hCoBVp8jjSNeHsaZO0l5porGg04bBZmHp40XblNyVgm4yTASVtD6iv6KCfb4g="
    }
  },
  {
    "id": "6",
    "cctvtype": 1,
    "name": "[남해선] 장흥",
    "coordx": 126.907028,
    "coordy": 34.708694,
    "url": "http://cctvsec.ktict.co.kr/3067/P1BE3fB34sx5AQ1L2pbh5D0pZgweoDQh4ewCGZW1pGvSclwTdeRtahaPbAgwFBq3w51bAGt/ti853pCpTULLFgnEQP837e0/WomDOCJDSfY=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[남해선] 장흥",
      "cctvurl": "http://cctvsec.ktict.co.kr/3067/P1BE3fB34sx5AQ1L2pbh5D0pZgweoDQh4ewCGZW1pGvSclwTdeRtahaPbAgwFBq3w51bAGt/ti853pCpTULLFgnEQP837e0/WomDOCJDSfY="
    }
  },
  {
    "id": "7",
    "cctvtype": 1,
    "name": "[서해안선] 고창분기점",
    "coordx": 126.6531811,
    "coordy": 35.41723766,
    "url": "http://cctvsec.ktict.co.kr/154/Lo4a0NWPduGjffynVNh4Bc6eVBLVKQ1u5YH6iLv39LMdd/+SdVq1xScMvxKQx9+nTydkIyvlpkZcAMzSvry45u/EvRQhkSf/4hC5pDysh38=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[서해안선] 고창분기점",
      "cctvurl": "http://cctvsec.ktict.co.kr/154/Lo4a0NWPduGjffynVNh4Bc6eVBLVKQ1u5YH6iLv39LMdd/+SdVq1xScMvxKQx9+nTydkIyvlpkZcAMzSvry45u/EvRQhkSf/4hC5pDysh38="
    }
  },
  {
    "id": "8",
    "cctvtype": 1,
    "name": "[서천공주선] 동서천분기점",
    "coordx": 126.77306,
    "coordy": 36.05639,
    "url": "http://cctvsec.ktict.co.kr/2168/keLyOB2Vf8RdV7t4fcix16IxPo6OO3v0DnO1JokxKbuSAMLjLorkxqe04JDUawVdcvaofbEO9Xx5F4Qahhy51Wpv+/NzwyVdWKrO3qW9SsI=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[서천공주선] 동서천분기점",
      "cctvurl": "http://cctvsec.ktict.co.kr/2168/keLyOB2Vf8RdV7t4fcix16IxPo6OO3v0DnO1JokxKbuSAMLjLorkxqe04JDUawVdcvaofbEO9Xx5F4Qahhy51Wpv+/NzwyVdWKrO3qW9SsI="
    }
  },
  {
    "id": "9",
    "cctvtype": 1,
    "name": "[호남지선] 서대전분기점",
    "coordx": 127.317457,
    "coordy": 36.291514,
    "url": "http://cctvsec.ktict.co.kr/2337/AhWQRKjwQmnJBLjYGRDDXQXgRlL27w4nrI7fyA/GL9cn5+ngvafF3+gEoegSoM4ebsv2zpYytUTWoPVPRvzbg13nVFb6jMsyWI6z43J3Rck=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[호남지선] 서대전분기점",
      "cctvurl": "http://cctvsec.ktict.co.kr/2337/AhWQRKjwQmnJBLjYGRDDXQXgRlL27w4nrI7fyA/GL9cn5+ngvafF3+gEoegSoM4ebsv2zpYytUTWoPVPRvzbg13nVFb6jMsyWI6z43J3Rck="
    }
  },
  {
    "id": "10",
    "cctvtype": 1,
    "name": "[서해안선] 당진분기점",
    "coordx": 126.614,
    "coordy": 36.848,
    "url": "http://cctvsec.ktict.co.kr/2179/QzgNGf1RCFvbuJQ6hhBVu5KhMFCAFXbcZ0YjmY14rjZ8JTWuBlXa8mEz5+mseMCYo4o28sZLbDr/FAUYmCS+GIVxGOUtSKJok4Hx9sZnL60=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[서해안선] 당진분기점",
      "cctvurl": "http://cctvsec.ktict.co.kr/2179/QzgNGf1RCFvbuJQ6hhBVu5KhMFCAFXbcZ0YjmY14rjZ8JTWuBlXa8mEz5+mseMCYo4o28sZLbDr/FAUYmCS+GIVxGOUtSKJok4Hx9sZnL60="
    }
  },
  {
    "id": "11",
    "cctvtype": 1,
    "name": "[경부선] 신갈분기점",
    "coordx": 127.10389,
    "coordy": 37.29111,
    "url": "http://cctvsec.ktict.co.kr/76/gJe4rLR6qBfgUX4O8bP7gIO4OZSav5nlIIzY/0rVJeiA6eoGByFzFOC+iw0XYlYNiC5nqOSVb8Ze+EmRKSwiP7ISZ2jM0HUSsdsvJlov40w=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[경부선] 신갈분기점",
      "cctvurl": "http://cctvsec.ktict.co.kr/76/gJe4rLR6qBfgUX4O8bP7gIO4OZSav5nlIIzY/0rVJeiA6eoGByFzFOC+iw0XYlYNiC5nqOSVb8Ze+EmRKSwiP7ISZ2jM0HUSsdsvJlov40w="
    }
  },
  {
    "id": "12",
    "cctvtype": 1,
    "name": "[중부내륙선] 김천분기점",
    "coordx": 128.26577,
    "coordy": 36.16496,
    "url": "http://cctvsec.ktict.co.kr/2241/hp8WJAY1yHNUMLgspLq92S4ZQ3A2N98CJjGapXmAvEdiW2eja8iwUJh+DHwxmG3Jq4B6un4EVJJdaZoa01sTlniCYFX0IPrOWB+TuwR7Sr0=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[중부내륙선] 김천분기점",
      "cctvurl": "http://cctvsec.ktict.co.kr/2241/hp8WJAY1yHNUMLgspLq92S4ZQ3A2N98CJjGapXmAvEdiW2eja8iwUJh+DHwxmG3Jq4B6un4EVJJdaZoa01sTlniCYFX0IPrOWB+TuwR7Sr0="
    }
  },
  {
    "id": "13",
    "cctvtype": 1,
    "name": "[구리포천선] 신북IC",
    "coordx": 127.217947,
    "coordy": 37.911863,
    "url": "http://cctvsec.ktict.co.kr/3705/qE1+GHCMQrQ00iIP68v2xZVJehw3yTbU2JIjgye6z2qohuyd8njNMaP3Z8Z+6AqMuX/ANFXSzabI7NbRtdvWOTiAdyH1DInZW87AhP3jk3o=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[구리포천선] 신북IC",
      "cctvurl": "http://cctvsec.ktict.co.kr/3705/qE1+GHCMQrQ00iIP68v2xZVJehw3yTbU2JIjgye6z2qohuyd8njNMaP3Z8Z+6AqMuX/ANFXSzabI7NbRtdvWOTiAdyH1DInZW87AhP3jk3o="
    }
  },
  {
    "id": "14",
    "cctvtype": 1,
    "name": "[중부내륙선] 연풍",
    "coordx": 127.992233,
    "coordy": 36.75915391,
    "url": "http://cctvsec.ktict.co.kr/2234/ZWcncmJ+Ld1ci9l+g6Ol3G2MVuRu6ruiM37b/xxcp746HuEYPYRPUAtGcf+4L95ME/NW5WGPjzjxKVsGfdQNkLm0LtIBKXugV9BpOJgD1Z0=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[중부내륙선] 연풍",
      "cctvurl": "http://cctvsec.ktict.co.kr/2234/ZWcncmJ+Ld1ci9l+g6Ol3G2MVuRu6ruiM37b/xxcp746HuEYPYRPUAtGcf+4L95ME/NW5WGPjzjxKVsGfdQNkLm0LtIBKXugV9BpOJgD1Z0="
    }
  },
  {
    "id": "15",
    "cctvtype": 1,
    "name": "[광주대구선] 지리산",
    "coordx": 127.58885,
    "coordy": 35.48363,
    "url": "http://cctvsec.ktict.co.kr/2001/ycfthKPg+1CKPIg3JztEriMqnF7hE9azYUMXA5Z8K30MC95WDe6QnkLGyeeejM2MLkghvViSiLscZA0OPaBHRt7Cm/P684E1P5Dx/2BR5K4=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[광주대구선] 지리산",
      "cctvurl": "http://cctvsec.ktict.co.kr/2001/ycfthKPg+1CKPIg3JztEriMqnF7hE9azYUMXA5Z8K30MC95WDe6QnkLGyeeejM2MLkghvViSiLscZA0OPaBHRt7Cm/P684E1P5Dx/2BR5K4="
    }
  },
  {
    "id": "16",
    "cctvtype": 1,
    "name": "[경부선] 금호분기점4",
    "coordx": 129.01595,
    "coordy": 35.895544,
    "url": "http://cctvsec.ktict.co.kr/94848/AIXrykqOH+QcNzpOSq8SS06ccvUiWz387V4U9usv/OKLt1HaD0+tLz2XosC/+gdiLy6PXTS2Eh/u0xEOBpqEaAoQL9rHLaLq8vv06Y95jEw=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[경부선] 금호분기점4",
      "cctvurl": "http://cctvsec.ktict.co.kr/94848/AIXrykqOH+QcNzpOSq8SS06ccvUiWz387V4U9usv/OKLt1HaD0+tLz2XosC/+gdiLy6PXTS2Eh/u0xEOBpqEaAoQL9rHLaLq8vv06Y95jEw="
    }
  },
  {
    "id": "17",
    "cctvtype": 1,
    "name": "태백 화전동",
    "coordx": 128.2729269,
    "coordy": 37.52208632,
    "url": "/porthole6.mp4",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "MP4",
      "cctvname": "태백 화전동",
      "cctvurl": "/porthole6.mp4"
    }
  }
  
];

// CCTVVideoPlayer 컴포넌트 제거 (외부 파일에서 임포트)

export function CCTVCard() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedCCTV, setSelectedCCTV] = useState<any>(null);

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
              console.log("CCTV marker clicked:", camera.name);
              setSelectedCCTV(camera);
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

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      {selectedCCTV && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <div className="w-2/3 overflow-hidden bg-black rounded-lg shadow-lg h-2/3">
              <div className="flex items-center justify-between p-2 bg-gray-800">
                <h3 className="font-medium text-white">{selectedCCTV.name}</h3>
                <button 
                  onClick={() => {
                    console.log("Closing CCTV view");
                    setSelectedCCTV(null);
                  }}
                  className="text-white hover:text-gray-300"
                >
                  ×
                </button>
              </div>
              <div className="h-[calc(100%-2.5rem)]">
                <CCTVVideoPlayer 
                  url={selectedCCTV.url} 
                  format={selectedCCTV.additionalData.cctvformat}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
