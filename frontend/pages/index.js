import React, { useState, useEffect } from 'react';
import { diff_match_patch } from 'diff-match-patch';

export const BACKEND_URL = 'http://127.0.0.1:8000/';

export default function Home(){
  const [text, setText] = useState(''); // 입력한 글의 상태
  const [editText, setEditText] = useState(''); // 첨삭된 글의 상태
  const [grammars, setGrammars] = useState([]); // 첨삭된 글의 목록의 상태
  const [diffGrammars, setDiffGrammars] = useState(''); // 원래의 글과 첨삭된 글의 비교 결과 상태
  const [isEditing, setIsEditing] = useState(false); // 첨삭 버튼 상태

  const grammarEdit = async () => { // 첨삭 결과 api 받기
    setIsEditing(true); // 첨삭 시작
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
    } finally {
      setIsEditing(false); // 첨삭 완료
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

      await getGrammars(); // 저장 후에 첨삭 결과 다시 가져오기
      alert('저장되었습니다.');
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
      console.error('오류', error);
    }
  };

  const getGrammars = async () => { // 저장된 첨삭 결과 가져오기
    try {
      const response = await fetch(`${BACKEND_URL}api/grammar/`);

      const data = await response.json();
      setGrammars(data);
    } catch (error) {
      alert('데이터를 가져오는 중 오류가 발생했습니다.');
      console.error('오류', error);
    }
  };

  useEffect(() => {
    getGrammars();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '0 5px' }}>
      <h1 style={{ marginTop: '10px' }}>AI 문법 검수 웹사이트</h1>
      <br />
      <div style={{ display: 'inline-block' }}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows="10" cols="80" placeholder="글을 입력해주세요." style={{ display: 'block', margin: '0 auto', marginBottom: '5px', width: '100%', maxWidth: '100%' }} />
        <div style={{ textAlign: 'right', marginTop: '5px' }}>
          <button onClick={grammarEdit} style={{ fontSize: '14px', width: '70px', height: '30px' }} disabled={isEditing}>{isEditing ? '첨삭 중...' : '첨삭'}</button>
        </div>
      </div>
      {editText && (
        <div>
          <h2 style={{ marginTop: '10px' }}>첨삭 완료!</h2>
          <div style={{ display: 'inline-block' }}>
            <div
              style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', display: 'inline-block', margin: "5px 0px", textAlign: 'left', maxWidth: '600px' }}>
              {renderDiff()}
            </div>
            <div style={{ textAlign: 'right' }}>
              <button onClick={grammarSave} style={{ ffontSize: '14px', width: '70px', height: '30px' }}>저장</button>
            </div>
          </div>
        </div>
      )}
      <h2 style={{ margin: '10px 0px' }}>저장된 글</h2>
      <ul style={{ display: 'inline-block', textAlign: 'left', maxWidth: '600px', listStyle: 'none' }}>
        {grammars.map((item) => (
          <li key={item.id} style={{ marginBottom: '10px', backgroundColor: '#ddd', padding: '10px', borderRadius: '5px', wordWrap: 'break-word' }}>
            <strong>원본:</strong> {item.oriText}
            <br />
            <strong>첨삭 결과:</strong> {item.editText}
            <br />
            <em>저장 시간: {new Date(item.created_at).toLocaleString()}</em>
          </li>
        ))}
      </ul>
    </div>
    
   
  )
}
