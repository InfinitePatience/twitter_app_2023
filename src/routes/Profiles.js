import React, { useEffect, useState } from 'react'
import { authService, db } from 'fbase';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import Tweet from 'components/Tweet';
import { updateProfile } from "firebase/auth"
import "styles/profile.scss"

function Profiles({userObj}) {
  const [tweets, setTweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const navigate = useNavigate(); // Hook 함수 

  const onLogOutClick = () => {
    authService.signOut(); // signOut(); 메소드를 사용하면 로그아웃 시킬 수 있다. 로컬 스토리지도 비워짐.
    navigate('/'); // 첫화면으로 이동 즉 리다이렉트 기능이다. ES6(최신) 버전에서만 사용 가능.
  }

  useEffect(() => {
    const q = query(collection(db, "tweets"), 
                  where("creatorId", "==", userObj.uid), // where는 속성
                  orderBy("createdAt","desc")); // orderBy는 정렬 방법 (createdAt: 작성시간, desc: 내림차순)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
     const newArray = [];
     querySnapshot.forEach((doc) => {
      newArray.push({...doc.data(), id:doc.id});
  });
  setTweets(newArray);
  });
},[]);

const onSubmit = async (e) => {
  e.preventDefault();
  if(userObj.displayName !== newDisplayName){
    await updateProfile(userObj,{
      displayName:newDisplayName,
      // photoURL: ,
    });
  }
}
const onChange = (e) => {
  const {target:{value}} = e; 
  setNewDisplayName(value);
}
  
  return (
    <div className='container'>
    <form onSubmit={onSubmit} className='profileForm'>
      <input type='text' onChange={onChange} value={newDisplayName} placeholder='Display name' className='formInput'/>
      <input type='submit' value='Update Profile' className='formBtn' />
    </form>
    <span onClick={onLogOutClick} className='formBtn cancelBtn logOut'>Log out</span>
    <div>
      {tweets.map(tweet => (
        <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
      ))}
    </div>
    </div>
  )
}

export default Profiles