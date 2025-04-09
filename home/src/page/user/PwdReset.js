import { useState, useEffect } from "react";
import './../../css/user/FindUser.css';
import axios from "axios";
import { useLocation } from "react-router-dom";

function PwdReset(){
    //입력한 비밀번호를 보관할 변수
    const [resetPwd, setresetPwd] = useState({});

    //비밀번호 재설정 링크에서 token 가져오기
    const location = useLocation();
    console.log("location", location);
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    console.log("token",token);
    const no = queryParams.get("userNo");
    console.log("no",no);

    useEffect(()=>{
        if(token && no) 
        axios.get(`http://127.0.0.1:9988/user/pwdReset?token=${token}&userNo=${no}`)
        .then(response=>{
            console.log(response.data);

            if(response.data == "ok"){
                // window.location.href = "/user/pwdReset";
            }else{
                alert("유효하지 않은 주소입니다.");
                window.location.href = "/";
            }
        }).catch(error=>{
            console.log(error);
        });
    },[]);

    //form의 값 업데이트 
    function setFormData(event){
        let name = event.target.name;
        let value = event.target.value;

        setresetPwd(prev=>{ //데이터가 두 개 이상이면 데이터 보존을 위해 써준다.
            return {...prev, [name]:value};
        });
    }
    
    //비밀번호 재설정 클릭시 폼체크
    function formCheck(event){
        //기본 이벤트 제거
        event.preventDefault();

        //비밀번호 입력 여부 체크
        if(resetPwd.pwd==null || resetPwd.pwd===''){
            alert("비밀번호를 입력하세요");
            // setAlertMsg((prev) => {return {...prev, id:'아이디를 입력하세요'}})
            return false;
        }

        //비밀번호확인 입력 여부 체크
        if(resetPwd.pwdCheck==null || resetPwd.pwdCheck===''){
            alert("비밀번호를 한번 더 입력하세요");
            // setAlertMsg((prev) => {return {...prev, id:'아이디를 입력하세요'}})
            return false;
        }

        //비밀번호, 비밀번호확인 일치 여부 체크
        if(resetPwd.pwd != resetPwd.pwdCheck){
            alert("비밀번호가 일치하지 않습니다.");
            return false;
        }

        //비동기로 백엔드 요청
        axios.post(`http://localhost:9988/user/changePwd?userNo=${no}`,{
            password: resetPwd.pwd,
            no: no
        })
        .then(function(response){
            console.log(response.data);
            if(response.data === "ok"){
                alert("비밀번호 변경 완료");
                window.location.href = "/login";
            }
        }).catch(function(error){
            console.log(error);
        });
    }

    return(
        <div className="find-form">
            <form onSubmit={formCheck}>
                <h3 className="find-form-subject">비밀번호 재설정</h3>
                <div className="find-form-line">
                    <span className="reset-form-title">비밀번호</span><input type="password" name="pwd" className="find-form-input" onChange={setFormData} placeholder="비밀번호를 입력하세요"/>
                    {/* {alertMsg.nickname!='' && <><span style={{color:'red'}}>{alertMsg.nickname}</span><br/></>} */}
                </div>
                <div>
                    <span className="reset-form-title">비밀번호 확인</span><input type="password" name="pwdCheck" className="find-form-input" onChange={setFormData} placeholder="비밀번호를 한번 더 입력하세요"/>
                    {/* {alertMsg.email!='' && <><span style={{color:'red'}}>{alertMsg.email}</span><br/></>} */}
                </div>
                <input type="submit" value="비밀번호 재설정" className="find-btn"/>
            </form>
        </div>
    )
}

export default PwdReset;