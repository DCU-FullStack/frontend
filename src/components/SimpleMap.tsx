import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function SimpleMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      const center = new window.kakao.maps.LatLng(36.533333, 127.900000); // 초기 위치 서울
      const options = {
        center,
        level: 13,
      };

      const mapInstance = new window.kakao.maps.Map(mapRef.current, options);
      setMap(mapInstance);
    });
  }, []);

  const moveToBusan = () => {
    if (!map) return;
    const busan = new window.kakao.maps.LatLng(35.1796, 129.0756);
    map.panTo(busan); // 지도 이동
  };

  return (
    <div className="space-y-2">
      <div ref={mapRef} style={{ width: "100%", height: "300px" }} />
      <button
        className="px-4 py-2 text-white bg-blue-500 rounded"
        onClick={moveToBusan}
      >
        부산으로 이동
      </button>
    </div>
  );
}