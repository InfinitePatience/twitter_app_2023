import { authService } from 'fbase';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { async } from '@firebase/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AuthForm from 'components/AuthForm';
import "styles/auth.scss";


// createUserWithEmailAndPassword 신규 회원가입 사용자 , signInWithEmailAndPassword 기존 사용자

// useState  -  true(A) false(B) 구분 하여 A가 나올경우 true, B 가 나올경우 false 나오게 설정해주는 함수로 사용
// onChange  -  A라는 값이 나왔을 때 onChange 함수로 바꿔주는 구문을 입력하여 바뀌게 해준다.
//   name    -  input이 여러개일 경우 input에다가 name을 입력하여 누가 입력 되었는지 구분해준다.

function Auth() {

  const onSocialClick = async (e) => {
    console.log('e.target.name->',e.target.name);
    const {target:{name}} = e;
    let provider;
    if(name === "google"){
      provider = new GoogleAuthProvider();

    }else if(name === "github"){
      provider = new GithubAuthProvider();

    }
    const data = await signInWithPopup(authService, provider);
    console.log('data->' , data);
  }

  return (// input이 여러 개인 경우 어떤 input인지 알 수 없으므로 name을 각자 지정해서 구분한다.(id 사용 안 함) // input type='submit' 에서 newAccount값이 true 인지 false인지에 따라 value가 바뀌게 설정
  // name은 form 요소를 선택하기 위해서만 사용된다. 다른 요소에는 적용 안 됨.
    <div className="authContainer">
      <FontAwesomeIcon icon="fa-brands fa-twitter" size='3x' color={"#04AAFF"}
      style={{marginBottom:30}}/>
      <AuthForm />
      <div className="authBtns">
        <button onClick={onSocialClick} name="google" className='authBtn'>
          Continue with Google <FontAwesomeIcon icon="fa-brands fa-google" /></button>
        <button onClick={onSocialClick} name="github" className='authBtn'>
          Continue with Github <FontAwesomeIcon icon="fa-brands fa-github" /></button>
      </div>
    </div>
  )
}

export default Auth