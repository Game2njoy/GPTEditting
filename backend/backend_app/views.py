from django.shortcuts import render
from django.conf import settings

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Grammar
from .serializers import GrammarSerializer

import os
from openai import OpenAI

# OpenAI 클라이언트를 API 키로 초기화
client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)

@api_view(['POST'])
def grammarEdit(request): # 문법 수정 api
    try:
        oriText = request.data.get('text')
        if not oriText:
            return Response({"error": "텍스트를 입력해주세요."}, status=400)
        
        completion = client.chat.completions.create(
                model='gpt-4o-mini-2024-07-18',
                messages=[
                    {"role": "system", "content": "사용자의 글에서 문법 오류를 수정해주세요."},
                    {"role": "user", "content": oriText}
                ]
            )
        
        editText = completion.choices[0].message.content.strip()
        return Response({'editText': editText})
    except Exception as e:
        return f"오류: {str(e)}"
    
@api_view(['GET'])
def grammarEdit(request): # 메인 화면
    grammar = Grammar.objects.all().order_by('-created_at')
    serializer = GrammarSerializer(grammar, many=True)
    return Response(serializer.data)

    
@api_view(['POST'])
def grammarSave(request): # 수정된 문법 저장 api
    oriText = request.data.get(oriText)
    editText = request.data.get(editText)
    if not oriText or not editText:
        return Response({"error": "원본 또는 수정된 텍스트가 없습니다."}, status=400)
    
    grammar = Grammar.objects.create(oriText=oriText, editText=editText)

    serializer = GrammarSerializer(grammar)
    return Response(serializer.data)

    