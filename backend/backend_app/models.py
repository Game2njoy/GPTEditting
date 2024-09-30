from django.db import models

class Grammar(models.Model):
    oriText = models.TextField()
    editText = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True) # 생성일자

# Create your models here.
