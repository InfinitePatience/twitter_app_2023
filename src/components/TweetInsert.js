import { db, storage } from 'fbase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "styles/tweetInsert.scss"
import { updateProfile } from 'firebase/auth';

function TweetInsert({userObj}) {
  console.log(userObj);
  const [tweet, setTweet] = useState('');
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let attachmentUrl = "";
      if(attachment !== ""){
        const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`); //경로 생성.  ${uuidv4()} - 아이디를 자동생성해주는 모듈.   경로 지정. uuidv4는 설치한 uuid 통해 자동생성되는 uid. [userObj.uid 폴더/uuidv4() 문서] 로 경로를 만들어서 보냄.
        const response = await uploadString(storageRef, attachment, 'data_url'); // attachment를 storage에 저장
        console.log('response->', response);
        attachmentUrl = await getDownloadURL(ref(storage, response.ref)); //response.ref 는 https 주소가 됨. https 주소를 가져옴.

      }
      const docRef = await addDoc(collection(db, "tweets"), {
        text:tweet,
        createdAt: Date.now(),
        creatorId: userObj.uid, // 문서를 누가 작성했는지 알아내기 위함. userObj는 로그인한 사용자 정보.
        attachmentUrl
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setTweet("");
    setAttachment("");
  }

  const onChange = e => {
    e.preventDefault();
    const {target: {value}} = e;
    setTweet(value);
  }


  const onFilechange = (e) => {
    console.log("e->",e)
    const {target: {files}} = e;
    
    const theFile = files[0];
    console.log('theFile->', theFile); // 사진 파일 이미지 주소
    
    const reader = new FileReader(); // FileReader - 웹 브라우저에서 제공하는 API 함수. 선택한 파일을 브라우저에서 미리 보여주기 위함. (필수)
    reader.onloadend = (finishedEvent) => {// onloadend -- 브라우저 로딩이 완료된 후 이벤트
      console.log('finishedEvent->',finishedEvent);
      const {currentTarget: {result}} = finishedEvent; // result는 Data URL임. [data:img~~]
      setAttachment(result);
    }
    reader.readAsDataURL(theFile); // 첨부한 file이 DATA URL 주소로 바뀌도록 만들어 줌. 결과는 currentTarget: result에 나옴. [data:img~~]
  }

  const onclearAttachment = () => {
    setAttachment(""); // 사진이 안 보이게 하려면 Data URL을 지우면 된다. 따라서 attachment를 공백으로 만들면 안 보이게 됨.
  }

  return (
    <>
    <form onSubmit={onSubmit} className='InsertForm'>
        <div className='InsertInput__container'>
        <input type='text' placeholder="'what'son your mind" value={tweet} onChange={onChange} 
        maxLength={120} className='InsertInput__input'/>
        <input type='submit' value='&rarr;' className='InsertInput__arrow' />
        </div>
        <label htmlFor="attach-file" className='InsertInput__label'>
          <span>Add photos</span>
          <FontAwesomeIcon icon="fa-solid fa-plus" />
        </label>
        <input type='file' accept='image/*' onChange={onFilechange} id='attach-file' style={{opacity:0}} />
        {attachment && ( // 값이 있으면 true
        <div className='Insertform_attachment'>
          <img src={attachment} style={{backgroundImage:attachment}} alt='' />
          <div className='Insertform__clear' onClick={onclearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon="fa-solid fa-xmark" />
          </div>
        </div>
      )}
      </form>
    </>
  )
}

export default TweetInsert