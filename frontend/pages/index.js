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
  const [diffGrammars, setDiffGrammars] = useState('');

  const grammarEdit = async () => { // 첨삭 결과 api 받기
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

      // diff-match-patch 사용
      const dmp = new diff_match_patch();
      const diff = dmp.diff_main(text, edited);
      dmp.diff_cleanupSemantic(diff);
      
      setDiffGrammars(diff);

    } catch (error) {
      alert('첨삭 중 오류가 발생했습니다.');
      console.error('오류', error);
    }
  };

  const renderDiff = () => { // diff-match-patch 랜더링 함수
    return diffGrammars.map((part, index) => {
      const [type, content] = part;
      
      if (type === -1) { // 삭제
        return <span key={index} style={{ backgroundColor: 'red', textDecoration: 'line-through' }}>{content}</span>;
      } else if (type === 1) { // 추가
        return <span key={index} style={{ backgroundColor: 'lightgreen' }}>{content}</span>;
      } else { // 그대로
        return <span key={index}>{content}</span>;
      }
    });
  };

  const grammarSave = async () => { // 첨삭 결과 저장
    try {
      const response = await fetch(`${BACKEND_URL}api/saveGrammar/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          oriText: text,
          editText: editText,
        })
      });
      alert('저장되었습니다.');
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
      console.error('오류', error);
    }
  };

  return (
    <div>
      <h1>AI 문법 검수 웹사이트</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows="10" cols="50" placeholder="글을 입력해주세요." />
      <br />
      <button onClick={grammarEdit}>첨삭</button>
      {editText && (
        <div>
          <h2>첨삭 완료!</h2>
          <div
            style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
            {renderDiff()}
          </div>
          <button onClick={grammarSave}>저장</button>
        </div>
      )}
      <h2>저장된 글</h2>
    </div>
    
   
  )
}
