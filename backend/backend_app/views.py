from django.conf import settings

from adrf.decorators import api_view  # 비동기 처리를 위한 adrf 데코레이터(Async Django REST framework)
from rest_framework.response import Response

from .models import Grammar
from .serializers import GrammarSerializer

from openai import OpenAI

# OpenAI 클라이언트를 API 키로 초기화
client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)

@api_view(['POST', 'GET'])
def grammarEdit(request): # 문법 수정 api
    if request.method == 'POST':
        try:
            oriText = request.data.get('text')
            if not oriText:
                return Response({"error": "텍스트를 입력해주세요."}, status=400)
            
            completion = client.chat.completions.create(
                    model='gpt-4o-mini-2024-07-18',
                    messages=[
                        {"role": "system", "content": "주어진 문장에서 문법 오류를 수정하고, 수정된 문장만 반환해주세요. 수정된 문장을 반환할 때, 불필요한 추가 설명 없이 단순히 문장만 출력하세요."},
                        {"role": "user", "content": oriText}
                    ]
                )
            
            editText = completion.choices[0].message.content.strip()
            return Response({'editText': editText})
        except Exception as e:
            return f"오류: {str(e)}"
        
    if request.method == 'GET':
        grammar = Grammar.objects.all().order_by('-created_at')
        serializer = GrammarSerializer(grammar, many=True)
        return Response(serializer.data)
 
@api_view(['POST'])
async def grammarSave(request): # 첨삭된 글 db에 비동기로 저장 api
    oriText = request.data.get('oriText')
    editText = request.data.get('editText')
    if not oriText or not editText:
        return Response({"error": "원본 또는 수정된 텍스트가 없습니다."}, status=400)
    
    grammar = await Grammar.objects.acreate(oriText=oriText, editText=editText)  # 비동기 create함수인 acreate로 데이터베이스에 비동기로 저장

    serializer = GrammarSerializer(grammar)
    return Response(serializer.data)

    