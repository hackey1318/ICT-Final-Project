import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KakaoCallback = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            axios
                .get(`http://localhost:9988/oauth/kakao/login?code=${code}`)
                .then(response => {

                    console.log(response.data);
                    setUser(response.data);
                    // localStorage.setItem("accessToken", response.data.accessToken);
                    // navigate("/");
                })
                .catch(error => {
                    console.error("로그인 실패", error.response.data);
                });
        }
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {user ? (
                <div>
                    <h2>환영합니다, {user.kakaoUserInfoDto.knickName}님!</h2>
                    <img
                        src={user.kakaoUserInfoDto.profile}
                        alt="프로필 이미지"
                        style={{ borderRadius: "50%", width: "100px", height: "100px" }}
                    />
                    <p>이메일: {user.kakaoUserInfoDto.email}</p>
                </div>
            ) : (
                <div> 정보가 없습니다. </div>
            )}
        </div>
    );
};

export default KakaoCallback;
