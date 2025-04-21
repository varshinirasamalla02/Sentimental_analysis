from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, ReviewViewSet,
    get_stats, get_top_products, get_products, analyze_sentiment
)

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('stats/', get_stats, name='stats'),
    path('products/top/', get_top_products, name='top-products'),
    path('products/', get_products, name='products'),
    path('sentiment/analyze/<str:product_id>/', analyze_sentiment, name='analyze-sentiment'),
]
