import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { authService } from 'fbase';
import "styles/authForm.scss";


function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setAccount] = useState(true); //true 회원가입, false로그인
  const [error, setError] = useState('');

  const onChange = (e) => {
    console.log('e.target.name->',e.target.name);
    console.log(e);
    const {target:{name, value}} = e; // 이벤트 객체의 타겟 속성에 name과 value 속성을 구조분해할당으로 가져온 것
    if(name === 'email'){
      setEmail(value);
    }else if(name === 'password'){
      setPassword(value);
    }
  }

  const onSubmit = async(e) =>{ // onSubmit 기능 중 하나(새로고침)  email을 firebase로 옮겨주는 역할
    e.preventDefault(); 
    try {  // 서버에다가 무언가 요청 했을 때 받아오고 (try) , 에러가 났을 때 에러를 잡아오는게 (catch)  try catch 문
      let data;
      if(newAccount){
        //회원가입
        data = await createUserWithEmailAndPassword(authService, email, password); // firebase에서 신규 회원가입을 처리해주는 함수
      }else { // 에러 났을 때 에러 메시지 출력
        //로그인
        data = await signInWithEmailAndPassword(authService, email, password); // firebase에서 이메일/비번으로 로그인을 처리해주는 함수
      }
      console.log('data->',data);
    } catch(error) {
      console.log('error->',error);
      setError(error.message);
    }
  }

  const toggleAccount = () => setAccount(prev => !prev); 
  return (
    <>
    <form onSubmit={onSubmit} className="container">  
        <input name="email" type='email' placeholder='Email' required value={email} onChange={onChange} className="authInput"/>

        <input name="password" type='password' placeholder='Password' required value={password} onChange={onChange} className="authInput"/>

        <input type='submit' value={newAccount ? "Create Account" : "Log In"} className="authInput authSubmit"/> 
        {/* newAccount 값이 value 값을 true 인지 false 인지에 따라 입력된 값을 바뀌게 설정 */}
        {error && <span className="authError">{error}</span>} 
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  )
}

export default AuthForm