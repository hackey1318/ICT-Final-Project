import { useState } from "react";
import '../../css/user/FindUser.css';
import axios from "axios";
import arrow from '../../img/arrow.png';
import apiNoAccessClient from "../../js/public/axiosConfigNoAccess";

function FindId(){
    //입력한 닉네임, 이메일을 보관할 변수
    let [idFindForm, setIdFindForm] = useState({});

    //alert메세지를 보관할 변수
    const [alertMsg, setAlertMsg] = useState({
        nickname:'',
        email:''
    })

    //아이디 찾기 성공 여부를 저장할 상태
    let [idFound, setIdFound] = useState(false);
    //찾은 아이디를 저장할 변수
    let [userId, setUserId] = useState('');

    //form의 값 유효성검사 
    function setFormData(event){
        let name = event.target.name;
        let value = event.target.value;

        setIdFindForm(prev=>{ //데이터가 두 개 이상이면 데이터 보존을 위해 써준다.
            return {...prev, [name]:value};
        });
    }

    //아이디 찾기 클릭시 폼체크
    function formCheck(event){
        console.log("nickname=>"+idFindForm.nickname);
        console.log("email=>"+idFindForm.email);

        //기본 이벤트 제거
        event.preventDefault();

        //이름 입력 여부 확인
        if(idFindForm.nickname==null || idFindForm.nickname===''){
            alert("닉네임을 입력하세요");
            setAlertMsg((prev) => {return {...prev, nickname:'닉네임을 입력하세요'}})
            return false;
        }

        //이메일 입력 여부 확인
        if(idFindForm.email==null || idFindForm.email===''){
            alert("이메일을 입력하세요.");
            setAlertMsg((prev) => {return {...prev, email:'이메일을 입력하세요'}})
            return false;
        }

        //비동기로 백엔드 요청
        apiNoAccessClient.post("/user/findIdOk",{
            nickname: idFindForm.nickname,
            email: idFindForm.email
        })
        .then(function(response){
            console.log(response.data);

            //result가 "userActive", "userDelete", "userNone"인지 확인
            if(response.data.status === "userActive"){
                //아이디 찾기 성공시
                alert("아이디 찾기 성공하였습니다.");
                setUserId(response.data.id);
                setIdFound(true);  //아이디 찾기 성공 상태로 변경
            }else if(response.data.status === "userDelete"){
                //탈퇴한 사용자의 경우
                alert("탈퇴한 사용자입니다. 회원가입 후 이용하세요.");
                window.location.href = "/register";
            }else if(response.data.status === "userNone"){
                //아이디 존재하지 않을 경우
                alert("아이디 찾기 실패하였습니다. 회원가입 페이지로 이동합니다.");
                window.location.href = "/register";
            }
        }).catch(function(error){
            console.log(error);
        });
    }

    //전체 아이디 이메일로 받기 버튼 클릭시 동작함(마스킹 해제된 아이디 이메일로 발송)
    function unmaskId(){
        apiNoAccessClient.post("/user/unmask-id",{
            nickname: idFindForm.nickname,
            email: idFindForm.email
        })
        .then(function(response){
            console.log(response);
            alert("전체 아이디가 메일로 전송되었습니다.");
        }).catch(function(error){
            console.log(error);
            alert("메일 전송에 실패했습니다.");
        });
    }

    return(
        <div>
            <div className="find-form">
                <button onClick={() => window.history.back()} className="back-button" style={{display:"flex"}}>
                    <img src={arrow} alt="Back Arrow" style={{width: '20px', height:'20px', objectFit:'contain'}} />
                </button>
                {!idFound ? (
                    <>
                    <form onSubmit={formCheck}>
                        <h3 className="find-form-subject">아이디 찾기</h3>
                        <div className="find-form-div"><span className="find-form-title">닉네임</span><input type="text" name="nickname" className="find-form-input" onChange={setFormData} placeholder="이름을 입력하세요"/></div>
                        <div className="find-form-div"><span className="find-form-title">이메일</span><input type="text" name="email" className="find-form-input" onChange={setFormData} placeholder="이메일을 입력하세요"/></div>
                        <input type="submit" value="아이디 찾기" className="find-btn"/>
                    </form>
                    </>
                ):(
                    <div>
                        <h3 className="find-form-subject">아이디 찾기</h3>
                        찾은 아이디는 {userId}입니다.
                        <div className="find-btn-wrap">
                            <button onClick={unmaskId} className="find-btn find-btn-id">
                                전체 아이디 이메일로 받기
                            </button>
                        </div>
                        <div className="find-btn-wrap">
                            <button onClick={() => window.location.href='/login'} className="find-btn find-btn-id">
                                로그인
                            </button>
                            <button onClick={() => window.location.href='/user/findPWd'} className="find-btn find-btn-id">
                                비밀번호 찾기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FindId;
