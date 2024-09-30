import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import React, { useState, useEffect } from 'react';
import { diff_match_patch } from 'diff-match-patch';

export default function Home(){
  return (
    <div>
      <h1>AI 문법 검수 웹사이트</h1>
      <textarea onChange={(e) => e} rows="10" cols="50" placeholder="글을 입력해주세요." />
      <br />
      <button>첨삭</button>
      <h2>저장된 글</h2>
    </div>
    
   
  )
}
