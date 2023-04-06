import React, { useEffect, useState } from 'react'
import { collection, addDoc, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, storage } from 'fbase';
import Tweet from 'components/Tweet';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import TweetInsert from 'components/TweetInsert';

function Home({userObj}) {
  console.log(userObj);
  const [tweets, setTweets] = useState([]);

 /*  const getTweets = async () => {
  const querySnapshot = await getDocs(collection(db, "tweets"));
  querySnapshot.forEach((doc) => {  //쿼리를 스냅샷 찍는 것 처럼 불러온다 해서  변수이름을 querySnapshot 으로 했고.
    console.log(`${doc.id} => ${doc.data()}`);
    const tweetObject = {...doc.data(), id:doc.id }
    setTweets(prev => [tweetObject, ...prev]); // 새 트윗을 가장 먼저 보여준다.
  });
} */

  useEffect(() => { // useEffect에다 직접 함수를 기재하지 않고 호출만 한다.
    // getTweets();
    const q = query(collection(db,"tweets"),
                 orderBy("createdAt","desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newArray = [];
      querySnapshot.forEach((doc) => { // 문서 하나하나 가져와서 
        newArray.push({...doc.data(), id:doc.id});  // (10 -> 9 -> 8 -> 7 -> 6 -> 5 -> ...)
        console.log(newArray)
      });
      setTweets(newArray);
    });
    
  },[]);

  return (
    <div className='container'>
     <TweetInsert userObj={userObj} />
      <div>
        {tweets.map(tweet => (
          // <div key={tweet.id}>
          //   <h4>{tweet.text}</h4>
          // </div>
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
        ))}
      </div>
      <footer>&copy; {new Date().getFullYear()}Tweiiter app</footer>
    </div>
  )
}

export default Home