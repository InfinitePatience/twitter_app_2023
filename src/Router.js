import Navigation from 'components/Navigation';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profiles from 'routes/Profiles';

function AppRouter({isLoggedIn, userObj}) {


  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
    {isLoggedIn && <Navigation userObj={userObj} />}  {/* true일 경우에만 실행해준다는 의미 */}
      <Routes>
        {isLoggedIn ? ( //객체안에 또 다른 객체를 넣을 때는 괄호를 넣어줘야 함
        <>
          <Route path='/' element={<Home userObj={userObj} />} />
          <Route path='/profile' element={<Profiles userObj={userObj} />} />
        </>  
        ) : (
          <Route path='/' element={<Auth />} /> // false면 Auth 화면 나옴
        )}  
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
