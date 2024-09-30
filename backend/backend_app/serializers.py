from rest_framework import serializers
from .models import Grammar

class GrammarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grammar
        fields = '__all__'

