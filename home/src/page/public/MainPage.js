import { Link } from "react-router-dom";
import styled from "styled-components";

function MainPage() {

    const StyledLink = styled(Link)`
        text-decoration: none;

        &:link, &:visited, &:active {
            color: blue;
        }

        &:hover {
            color: yellowgreen;
        }
    `;

    return (
        <div className="main-container">
            <nav>
                <ul>
                    <li>영화찾기</li>
                    <li>스토어</li>
                    <li>커뮤니티</li>
                    <li>마이페이지</li>
                    <li>회원가입</li>
                    <li><StyledLink to='/kakao/login'>로그인</StyledLink></li>
                    {/*
                        sessionStorage     <li>환영합니다 {}님!
                            <img src={11} className="profile-img"/>
                        </li>
                    */}
                    <li><StyledLink to='/mypage/review'>영화후기목록</StyledLink></li>
                    <li><StyledLink to='/inquiry'>1:1문의하기</StyledLink></li>
                </ul>
            </nav>
        </div>
    )
}

export default MainPage;