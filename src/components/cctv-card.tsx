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
    url: "http://cctvsec.ktict.co.kr/2127/6rXLH6703vCpmS5YU4Xvu34L7cVj9yXmxR1DnEGptyLY6WpBNjYV+MUAUOaXHTVjcNtcvjvz06kMEhO/V16XPMxiyKgDVZGczRIAP8CfGUQ=",
    additionalData: {
      roadsectionid: "",
      cctvresolution: "",
      filecreatetime: "",
      cctvformat: "HLS",
      cctvname: "[동해선] 강릉분기점",
      cctvurl: "http://cctvsec.ktict.co.kr/2127/6rXLH6703vCpmS5YU4Xvu34L7cVj9yXmxR1DnEGptyLY6WpBNjYV+MUAUOaXHTVjcNtcvjvz06kMEhO/V16XPMxiyKgDVZGczRIAP8CfGUQ="
    }
  },
  {
    id: "2",
    cctvtype: 1,
    name: "[익산포항선] 포항",
    coordx: 129.3116527,
    coordy: 36.0443321,
    url: "http://cctvsec.ktict.co.kr/2223/Qj3QOX1jUo7FO242dOdluYomUPSSEida6Vx+YI/ZbPYQhbY2slobiDhjQxVFsW8g/LD0Xom42Fei+239O7NqGr+srFlip1qzD5hcNTbZDj8=",
    additionalData: {
      roadsectionid: "",
      cctvresolution: "",
      filecreatetime: "",
      cctvformat: "HLS",
      cctvname: "[익산포항선] 포항",
      cctvurl: "http://cctvsec.ktict.co.kr/2223/Qj3QOX1jUo7FO242dOdluYomUPSSEida6Vx+YI/ZbPYQhbY2slobiDhjQxVFsW8g/LD0Xom42Fei+239O7NqGr+srFlip1qzD5hcNTbZDj8="
    }
  },
  {
    "id": "3",
    "cctvtype": 1,
    "name": "[부산울산선] 해운대",
    "coordx": 129.18417,
    "coordy": 35.17806,
    "url": "http://cctvsec.ktict.co.kr/2125/1cmg94ixceCV+NxRH+Ut3EP5WuoMRfNWBPk5e4Gi4+RTf5aMbcsqBHUxwjJS8dppB/CRinCs+allZbJPiSkMFBJTDoZqlQ26Qt9t6sRvhXU=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[부산울산선] 해운대",
      "cctvurl": "http://cctvsec.ktict.co.kr/2125/1cmg94ixceCV+NxRH+Ut3EP5WuoMRfNWBPk5e4Gi4+RTf5aMbcsqBHUxwjJS8dppB/CRinCs+allZbJPiSkMFBJTDoZqlQ26Qt9t6sRvhXU="
    }
  },
  {
    "id": "4",
    "cctvtype": 1,
    "name": "[남해선] 축동정류장",
    "coordx": 128.055918,
    "coordy": 35.088476,
    "url": "http://cctvsec.ktict.co.kr/2516/cWS36B2qJz7487stpVa4zdqSKtkOBCDF7jXOb4OQzSFWFGYu6wA8bnEV2vPnkRhgfnyUy+J7GUcJHxjVzH8fPikhj0yO4bKjvF3k22Zbs/g=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[남해선] 축동정류장",
      "cctvurl": "http://cctvsec.ktict.co.kr/2516/cWS36B2qJz7487stpVa4zdqSKtkOBCDF7jXOb4OQzSFWFGYu6wA8bnEV2vPnkRhgfnyUy+J7GUcJHxjVzH8fPikhj0yO4bKjvF3k22Zbs/g="
    }
  },
  {
    "id": "5",
    "cctvtype": 1,
    "name": "[순천완주선] 순천분기점",
    "coordx": 127.537711,
    "coordy": 34.990836,
    "url": "http://cctvsec.ktict.co.kr/3063/doK0Da5vylFy9OIzFP8l8kE7bp5JRqUQQLo+6Oqrf8H2uyeiKpCZqS6pKSya/7y4tMEBqf7l/kMuGHi7a13Z1lhVwAj3DMwlOvX5jaLLIbQ=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[순천완주선] 순천분기점",
      "cctvurl": "http://cctvsec.ktict.co.kr/3063/doK0Da5vylFy9OIzFP8l8kE7bp5JRqUQQLo+6Oqrf8H2uyeiKpCZqS6pKSya/7y4tMEBqf7l/kMuGHi7a13Z1lhVwAj3DMwlOvX5jaLLIbQ="
    }
  },
  {
    "id": "6",
    "cctvtype": 1,
    "name": "[남해선] 장흥",
    "coordx": 126.907028,
    "coordy": 34.708694,
    "url": "http://cctvsec.ktict.co.kr/3067/IRzoGPNYocdzkKcgMB4nWH1EDK9kbRGIjuAd0UoeKvcQhkqq20Ga+kZs3i/sifGw5KrqvNRA8fsKQTVLHlLS32RZTuhAasUyPttgbSr0IbA=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[남해선] 장흥",
      "cctvurl": "http://cctvsec.ktict.co.kr/3067/IRzoGPNYocdzkKcgMB4nWH1EDK9kbRGIjuAd0UoeKvcQhkqq20Ga+kZs3i/sifGw5KrqvNRA8fsKQTVLHlLS32RZTuhAasUyPttgbSr0IbA="
    }
  },
  {
    "id": "7",
    "cctvtype": 1,
    "name": "[서해안선] 고창분기점",
    "coordx": 126.6531811,
    "coordy": 35.41723766,
    "url": "http://cctvsec.ktict.co.kr/154/6LSk9h08ryVm43cGeUiZqL5tKazaB4cT7Nk+bg48gT9YEQVlL+cTRWNvYuuzdIV/xLuAnuWEBDSU7ycHS7ymu5iPzl+KSy56suZYlV5tUgQ=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[서해안선] 고창분기점",
      "cctvurl": "http://cctvsec.ktict.co.kr/154/6LSk9h08ryVm43cGeUiZqL5tKazaB4cT7Nk+bg48gT9YEQVlL+cTRWNvYuuzdIV/xLuAnuWEBDSU7ycHS7ymu5iPzl+KSy56suZYlV5tUgQ="
    }
  },
  {
    "id": "8",
    "cctvtype": 1,
    "name": "[서천공주선] 동서천분기점",
    "coordx": 126.77306,
    "coordy": 36.05639,
    "url": "http://cctvsec.ktict.co.kr/2168/OGA2hSuCGA3wS+0a2iV50nCmAUPMoMsJZSzoTTtLsAIB94DD/FzmDuXu7W8vD6dFt6CC8JOCkrLUriGVyb4BGoMsGRtZJusXqfNFOmmSMX4=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[서천공주선] 동서천분기점",
      "cctvurl": "http://cctvsec.ktict.co.kr/2168/OGA2hSuCGA3wS+0a2iV50nCmAUPMoMsJZSzoTTtLsAIB94DD/FzmDuXu7W8vD6dFt6CC8JOCkrLUriGVyb4BGoMsGRtZJusXqfNFOmmSMX4="
    }
  },
  {
    "id": "9",
    "cctvtype": 1,
    "name": "[호남지선] 서대전분기점",
    "coordx": 127.317457,
    "coordy": 36.291514,
    "url": "http://cctvsec.ktict.co.kr/3785/iAD65qkgxIJ3MongIVHd4UqanE94yBXLG/ytA5DW5906C5/6+HBEtj541Hrb5T6fclOttMuV9rsGdCr8EtFKfn7Jhg8V1R2M1pB9LvnKMEs=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[호남지선] 서대전분기점",
      "cctvurl": "http://cctvsec.ktict.co.kr/3785/iAD65qkgxIJ3MongIVHd4UqanE94yBXLG/ytA5DW5906C5/6+HBEtj541Hrb5T6fclOttMuV9rsGdCr8EtFKfn7Jhg8V1R2M1pB9LvnKMEs="
    }
  },
  {
    "id": "10",
    "cctvtype": 1,
    "name": "[서해안선] 당진분기점",
    "coordx": 126.614,
    "coordy": 36.848,
    "url": "http://cctvsec.ktict.co.kr/2179/4Uri+xQj7+6U9Bivf7h4yoPJuBhlHn6tt/qNrPMBjYx8IeIY8cOBQT3AbrwmLPyrghYBVuSu2Qf9lfE3YD3wCEuuedUbv4Ahvh5HF1fUMZw=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[서해안선] 당진분기점",
      "cctvurl": "http://cctvsec.ktict.co.kr/2179/4Uri+xQj7+6U9Bivf7h4yoPJuBhlHn6tt/qNrPMBjYx8IeIY8cOBQT3AbrwmLPyrghYBVuSu2Qf9lfE3YD3wCEuuedUbv4Ahvh5HF1fUMZw="
    }
  },
  {
    "id": "11",
    "cctvtype": 1,
    "name": "[경부선] 신갈분기점",
    "coordx": 127.10389,
    "coordy": 37.29111,
    "url": "http://cctvsec.ktict.co.kr/76/GkEJ13YoXa5eSt/Fhu6GrfRFXJkZDK4Vxlhti9eY6PGL2NtBSMBA3OMDnbtfB/GLf+68d/O6LPALkedW1aWFP7ISZ2jM0HUSsdsvJlov40w=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[경부선] 신갈분기점",
      "cctvurl": "http://cctvsec.ktict.co.kr/76/GkEJ13YoXa5eSt/Fhu6GrfRFXJkZDK4Vxlhti9eY6PGL2NtBSMBA3OMDnbtfB/GLf+68d/O6LPALkedW1aWFP7ISZ2jM0HUSsdsvJlov40w="
    }
  },
  {
    "id": "12",
    "cctvtype": 1,
    "name": "[중부내륙선] 김천분기점",
    "coordx": 128.26577,
    "coordy": 36.16496,
    "url": "http://cctvsec.ktict.co.kr/2241/N7ib/l3x+PxRcVdWMdMc85UUcSFjB1sgBuFxCLr8AXXG52MzXjG/bVne55k/aUQf8FpRpRx6EJtYGD8ENElgos0gD1DnIT1G0funmGRQIEc=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[중부내륙선] 김천분기점",
      "cctvurl": "http://cctvsec.ktict.co.kr/2241/N7ib/l3x+PxRcVdWMdMc85UUcSFjB1sgBuFxCLr8AXXG52MzXjG/bVne55k/aUQf8FpRpRx6EJtYGD8ENElgos0gD1DnIT1G0funmGRQIEc="
    }
  },
  {
    "id": "13",
    "cctvtype": 1,
    "name": "[구리포천선] 신북IC",
    "coordx": 127.217947,
    "coordy": 37.911863,
    "url": "http://cctvsec.ktict.co.kr/3705/DESGC665DeHz19m8DeTF/kpHe4IgVH7AIGqOQVLkIAH4yru/sbWHpmXAYOX47aGJPHELJS3QiMs0/63kl+vaABJ2htWQl7DZlAoFuBkZtfc=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[구리포천선] 신북IC",
      "cctvurl": "http://cctvsec.ktict.co.kr/3705/DESGC665DeHz19m8DeTF/kpHe4IgVH7AIGqOQVLkIAH4yru/sbWHpmXAYOX47aGJPHELJS3QiMs0/63kl+vaABJ2htWQl7DZlAoFuBkZtfc="
    }
  },
  {
    "id": "14",
    "cctvtype": 1,
    "name": "[중부내륙선] 연풍",
    "coordx": 127.992233,
    "coordy": 36.75915391,
    "url": "http://cctvsec.ktict.co.kr/2234/mK9Crdk1QjcwgkU3Fff/FTVVIVaRcqXUjuZrAo212RCcKlwagowShhh9hnuerNqstTYcvWG23UjTgAqsE8wwhfu/S2o00dD6hIGDMnlnYnU=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[중부내륙선] 연풍",
      "cctvurl": "http://cctvsec.ktict.co.kr/2234/mK9Crdk1QjcwgkU3Fff/FTVVIVaRcqXUjuZrAo212RCcKlwagowShhh9hnuerNqstTYcvWG23UjTgAqsE8wwhfu/S2o00dD6hIGDMnlnYnU="
    }
  },
  {
    "id": "15",
    "cctvtype": 1,
    "name": "[광주대구선] 지리산",
    "coordx": 127.58885,
    "coordy": 35.48363,
    "url": "http://cctvsec.ktict.co.kr/2001/gvyezhPA0wDgo80QTVP9fW6fOl/9Emnwoll2MmSXn2uLhog3riCndiBFIxfj4VS5sWC4p0D7gxQ7zhx4g/FiQtsHH98LhYOyLA0+B84BInE=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[광주대구선] 지리산",
      "cctvurl": "http://cctvsec.ktict.co.kr/2001/gvyezhPA0wDgo80QTVP9fW6fOl/9Emnwoll2MmSXn2uLhog3riCndiBFIxfj4VS5sWC4p0D7gxQ7zhx4g/FiQtsHH98LhYOyLA0+B84BInE="
    }
  },
  {
    "id": "16",
    "cctvtype": 1,
    "name": "[경부선] 금호분기점4",
    "coordx": 129.01595,
    "coordy": 35.895544,
    "url": "http://cctvsec.ktict.co.kr/94848/VRsSJk53ayTsTgYXPVQYmzuD0asj0ObLy2pT1aScM4Q2LFCE0rDtmQFXEaa4voAylh62Rk31noqoMBMoFzsHUrLtgr2MGDpR8RcXOfzEHfY=",
    "additionalData": {
      "roadsectionid": "",
      "cctvresolution": "",
      "filecreatetime": "",
      "cctvformat": "HLS",
      "cctvname": "[경부선] 금호분기점4",
      "cctvurl": "http://cctvsec.ktict.co.kr/94848/VRsSJk53ayTsTgYXPVQYmzuD0asj0ObLy2pT1aScM4Q2LFCE0rDtmQFXEaa4voAylh62Rk31noqoMBMoFzsHUrLtgr2MGDpR8RcXOfzEHfY="
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
