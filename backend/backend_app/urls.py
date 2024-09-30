from django.urls import path
from . import views

urlpatterns = [
    path('grammar/', views.grammarEdit),
    path('saveGrammar/', views.grammarSave),
]