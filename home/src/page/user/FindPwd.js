import axios from "axios";
import { useState } from "react";
import './../../css/user/FindUser.css';
import arrow from '../../img/arrow.png';

function FindPwd(){
    //입력한 아이디, 이메일을 보관할 변수
    let [pwdFindForm, setPwdFindForm] = useState({});

    //비밀번호 찾기 실행 여부를 저장할 상태
    let [pwdFoundCheck, setPwdFoundCheck] = useState(false);

    //입력한 내역과 일치하는 정보가 있는지를 보관할 변수
    let [pwdFound, setPwdFound] = useState(false);

    //form의 값 유효성검사 
    function setFormData(event){
        let name = event.target.name;
        let value = event.target.value;

        setPwdFindForm(prev=>{ //데이터가 두 개 이상이면 데이터 보존을 위해 써준다.
            return {...prev, [name]:value};
        });
    }

    //비밀번호 찾기 클릭시 폼체크
    function formCheck(event){
        console.log("id=>"+pwdFindForm.id);
        console.log("email=>"+pwdFindForm.email);

        //기본 이벤트 제거
        event.preventDefault();

        //아이디 입력 여부 확인
        if(pwdFindForm.id==null || pwdFindForm.id===''){
            alert("아이디를 입력하세요");
            // setAlertMsg((prev) => {return {...prev, id:'아이디를 입력하세요'}})
            return false;
        }

        //이메일 입력 여부 확인
        if(pwdFindForm.email==null || pwdFindForm.email===''){
            alert("이메일을 입력하세요.");
            // setAlertMsg((prev) => {return {...prev, email:'이메일을 입력하세요'}})
            return false;
        }

        //비동기로 백엔드 요청
        axios.post("http://localhost:9988/user/findPwdOk",{
            id: pwdFindForm.id,
            email: pwdFindForm.email
        })
        .then(function(response){
            console.log(response.data);

            setPwdFoundCheck(true); //비밀번호 찾기 실행 여부 true로 변경

            //result가 "userActive", "userDelete", "userNone"인지 확인
            if(response.data.status === "userActive"){
                //일치하는 정보 찾기 성공시
                alert("일치하는 정보 찾기 성공. 메일로 비밀번호 재설정 링크 발송");
                //setUserId(response.data.id);
                setPwdFound(true);  //일치하는 정보 찾기 성공 상태로 변경
            }else if(response.data.status === "userDelete"){
                //탈퇴한 사용자의 경우
                alert("탈퇴한 사용자입니다.");
            }else if(response.data.status === "userNone"){
                //일치하는 정보 없을 때
                alert("일치하는 정보가 없습니다.");
            }
        }).catch(function(error){
            console.log(error);
        });
    }

    return(
        <div className="find-form">
            <button onClick={() => window.history.back()} className="back-button" style={{display:"flex"}}>
                <img src={arrow} alt="Back Arrow" style={{width: '20px', height:'20px', objectFit:'contain'}} />
            </button>
            {!pwdFoundCheck ? (
                <form onSubmit={formCheck}>
                    <h3 className="find-form-subject">비밀번호 찾기</h3>
                    <p>아이디와 이메일을 입력하세요.</p>
                    <div className="find-form-div">
                        <span className="find-form-title">아이디</span>
                        <input type="text" name="id" className="find-form-input" onChange={setFormData} placeholder="아이디를 입력하세요"/>
                    </div>
                    <div className="find-form-div">
                        <span className="find-form-title">이메일</span>
                        <input type="text" name="email" className="find-form-input" onChange={setFormData} placeholder="이메일을 입력하세요"/>
                    </div>
                    <input type="submit" value="비밀번호 찾기" className="find-btn"/>
                </form>
            ):(
                <div>
                    <h3 className="find-form-subject">비밀번호 찾기 결과</h3>
                    {!pwdFound ? ( 
                        //일치하는 정보가 없을 때
                        <>
                        입력하신 내역과 일치하는 정보가 없습니다.
                        <button onClick={() => window.location.href='/register'} className="find-btn">
                            회원가입
                        </button>
                        </>
                    ):(
                        //일치하는 정보가 있고 사용자 status가 ACTIVE일 때, 메일로 재설정 링크 발송
                        <>
                        메일로 비밀번호 재설정 링크를 전송하였습니다.
                        <button onClick={() => window.location.href='/login'} className="find-btn">
                            로그인
                        </button>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default FindPwd;