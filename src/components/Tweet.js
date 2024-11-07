import React, { useEffect, useState } from 'react'
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db, storage } from 'fbase';
import { ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "styles/tweet.scss";

function Tweet(props) { // 구조분해할당을 위해 받음
  // console.log("tweetObj->",tweetObj)
  console.log("props->", props);
  const {tweetObj:
    {
      createdAt,creatorId,text,id,attachmentUrl
    }, 
    isOwner} = props; //객체로 들어온 props를 구조분해할당으로 가져옴. const {} = props; / {속성: {}} 안에 추가로 내용을 나누어서 내보낼 수 있음
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(text);
  const [nowDate, setNowDate] = useState(createdAt);

  const onDeleteClick = async () => {
    const ok = window.confirm("삭제하시겠습니까?");
    if(ok){
      const data = await deleteDoc(doc(db, "tweets", `/${id}`)); // 폴더 안에 있는 id에 해당되는 문서를 삭제하기 위함. 폴더/문서 구조이기 때문에 앞에 /를 붙인다. 연필 아이콘 눌러보면 그렇게 나옴.
      if(attachmentUrl !== ""){
        const desertRef = ref(storage, attachmentUrl);
        await deleteObject(desertRef);
      }
    }
  }
  
  const toggleEditing = () => setEditing((prev) => !prev); //토글 기능
  const onChange = (e) => {
    const {target:{value}} = e;
    setNewTweet(value);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const newTweetRef = doc(db, "tweets", `/${id}`);

    await updateDoc(newTweetRef, {
      text: newTweet,
      createdAt: Date.now()
    });
    setEditing(false);
  }

  useEffect(() => {
    let timeStamp = createdAt;
    const now = new Date(timeStamp);
    setNowDate(now.toUTCString());  //.toUTCString() .toDateString()
  }, [])

  return (
    <div className='tweet'>
      {editing ? (
        <>
          <form onSubmit={onSubmit} className='container tweetEdit'>
            <input type='text' onChange={onChange} value={newTweet} required className='formInput'/>
            <input type='submit' value='Update Tweet' className='formBtn'/>
          </form>
          <button onClick={toggleEditing} className="formBtn cancelBtn">Cancel</button>
        </>
      ) : (
        <>
          <h4>{text}</h4>
          {attachmentUrl && (// 이렇게 설정하면 이미지 없이 내용만 넣어도 엑박이 안 뜸
          <img src={attachmentUrl} width="50" height="50" alt='' />
          )}
          <span>{nowDate}</span>
          {isOwner && (// true일 경우에만 아래 내용들이 보이게 된다.
            <div className='tweet__actions'>
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon="fa-solid fa-trash" />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon="fa-solid fa-pencil" />
              </span>
            </div>
          )}
        </>
      )}

    </div>
  )
}

export default Tweet
