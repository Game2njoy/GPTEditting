import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import React, { useState, useEffect } from 'react';
import { diff_match_patch } from 'diff-match-patch';

export const BACKEND_URL = 'http://127.0.0.1:8000/';

export default function Home(){
  const [text, setText] = useState('');
  const [editText, setEditText] = useState('');
  const [grammars, setGrammars] = useState([]);

  const grammarEdit = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}api/grammar/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({text})
      });
      
      const data = await response.json();
      const edited = data.editText;
      setEditText(edited);
    } catch (error) {
      alert('첨삭 중 오류가 발생했습니다.');
      console.error('오류', error);
    }
  };

  return (
    <div>
      <h1>AI 문법 검수 웹사이트</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows="10" cols="50" placeholder="글을 입력해주세요." />
      <br />
      <button onClick={grammarEdit}>첨삭</button>
      <h2>저장된 글</h2>
      <p>{editText}</p>
    </div>
    
   
  )
}
