import { useEffect, useRef, useState } from "react";
import { getTheaterList } from "../cart/CartApi";

const KakaoMap = ({ theaterName }) => {
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
                script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=b4b13ac61edf54f257b08ab5b1f5fd51&autoload=false&libraries=services";
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
            const mapContainer = mapRef.current;
            const map = new window.kakao.maps.Map(mapContainer, {
                center: new window.kakao.maps.LatLng(37.5665, 126.9780),
                level: 5
            });

            const selectedTheater = theaterList.find((theater) => theater.name === theaterName);
            if (selectedTheater) {
                const { latitude, longitude } = selectedTheater;
                const coords = new window.kakao.maps.LatLng(parseFloat(latitude), parseFloat(longitude));
                const marker = new window.kakao.maps.Marker({
                    map: map,
                    position: coords
                });
                map.setCenter(coords); 

                window.kakao.maps.event.addListener(marker, 'click', () => {
                    const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(theaterName)},${latitude},${longitude}`;
                    window.open(kakaoMapUrl, '_blank'); 
                });
            }
        };

        if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => renderMap());
        } else {
            loadKakaoMap();
        }
    }, [theaterName, theaterList]);

    return <div ref={mapRef} style={{ width: '95%', height: '200px', margin: '10px auto 0', border: '1px solid #ddd'}} />;
};

export default KakaoMap;