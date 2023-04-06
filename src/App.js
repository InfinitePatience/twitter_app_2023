import { useEffect, useState } from 'react';
import AppRouter from 'Router';
import { authService } from 'fbase';
import { onAuthStateChanged } from "firebase/auth";

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
library.add(fas, faTwitter, faGoogle, faGithub );

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  console.log('authService.currentUser ->',authService.currentUser) // currnetUser 현재 로그인한 사람 확인하는 함수 null(false)

  const [userObj, setUserObj] = useState(null);

  useEffect(() => { // 컴포넌트가 렌더링 될 때 딱 한번 실행되는 함수 ( [] <- 이곳에 아무것도 없을경우 ) componentDidMount 시점
    onAuthStateChanged(authService, (user) => {// 로그인한 사용자의 정보를 가져오는 함수
      console.log('user->',user);
      if (user) {
        setIsLoggedIn(user);
        setUserObj(user);

      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  },[]);  // 특정한 시점에서 실행되는 함수. firebase에 로그인 정보를 받게 되는 시점.

  return (// React JSX 문법에서는 Javascript 코드 입력할 때 중괄호({}) 를 해야 한다.
    <>
    {init ? (<AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
    ) : (
      "initializing..."
    )}
    
    </>
  );
}

export default App;
 

