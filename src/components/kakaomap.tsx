import { useEffect, useRef } from "react";

const KakaoMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "http://dapi.kakao.com/v2/maps/sdk.js?appkey=017b46f96b87429bd126227659533e66&autoload=false";
    script.async = true;

    script.onload = () => {
      if (!(window as any).kakao) {
        console.error("Kakao SDK가 로드되지 않았습니다.");
        return;
      }

      const kakao = (window as any).kakao;
      kakao.maps.load(() => {
        const container = mapRef.current;
        if (!container) return;

        const options = {
          center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심
          level: 5,
        };

        const map = new kakao.maps.Map(container, options);

        // 기본 마커
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(37.5665, 126.9780),
          draggable: true,
          map,
        });

        // 인포윈도우
        const infowindow = new kakao.maps.InfoWindow({
          content: '<div style="padding:6px;">여기는 서울입니다</div>',
        });
        infowindow.open(map, marker);

        // 클릭 이벤트
        kakao.maps.event.addListener(map, "click", (mouseEvent: any) => {
          const latlng = mouseEvent.latLng;
          console.log("클릭 위치:", latlng.toString());
        });

        // 지도 타입/확대축소 컨트롤
        map.addControl(
          new kakao.maps.MapTypeControl(),
          kakao.maps.ControlPosition.TOPRIGHT
        );
        map.addControl(
          new kakao.maps.ZoomControl(),
          kakao.maps.ControlPosition.RIGHT
        );
      });
    };

    document.head.appendChild(script);
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px  ",
        borderRadius: "0.5rem",
        border: "1px solid #ddd",
      }}
    />
  );
};

export default KakaoMap;
