import { useEffect, useRef, useState } from "react";
import { getTheaterList } from "../cart/CartApi";

const KakaoMap = ({ theaterName, latitude, longitude, height = "200px" }) => {
    const mapRef = useRef(null);
    const [theaterList, setTheaterList] = useState([]);

    useEffect(() => {
        getTheaterList()
            .then((response) => {
                setTheaterList(response.data);
                console.log("🎯 응답 데이터:", response.data); 
            })
            .catch((error) => {
                console.error("영화관 목록을 불러오는데 실패했습니다.", error);
            });
    }, []);

    useEffect(() => {
        if (!theaterName || theaterName.trim() === "") return;

        const loadKakaoMap = () => {
            if (window.kakao && window.kakao.maps) {
                renderMap();
            } else {
                const script = document.createElement("script");
                script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=24b0f63fb963a2c72fe0aeb661df2b31&autoload=false&libraries=services";
                script.async = true;
                script.onload = () => {
                    window.kakao.maps.load(() => {
                        renderMap();
                    });
                };
                document.head.appendChild(script);
            }
        };

        const renderMap = () => {
            const selectedTheater = theaterList.find((theater) => theater.name === theaterName);
            if (!selectedTheater) return;
            const { latitude, longitude } = selectedTheater;
            const coords = new window.kakao.maps.LatLng(parseFloat(latitude), parseFloat(longitude));
            const mapContainer = mapRef.current;

            const map = new window.kakao.maps.Map(mapContainer, {
                center: coords,
                level: 5
            });

            const marker = new window.kakao.maps.Marker({
                map: map,
                position: coords
            });
        
            window.kakao.maps.event.addListener(marker, 'click', () => {
                const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(theaterName)},${latitude},${longitude}`;
                window.open(kakaoMapUrl, '_blank');
            });
        };

        if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => renderMap());
        } else {
            loadKakaoMap();
        }
    }, [theaterName, theaterList]);

    return <div ref={mapRef} style={{ width: '95%', height: height, margin: '10px auto 0', border: '1px solid #ddd'}} />;
};

export default KakaoMap;