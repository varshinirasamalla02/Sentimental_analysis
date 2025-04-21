from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Count, Avg, Q
from django.contrib.auth import get_user_model
from .models import Review
from .serializers import UserSerializer, ReviewSerializer
from .sentiment import analyze_product_sentiment

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                'token': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'message': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            return Response({'message': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'token': str(refresh.access_token),
        })

class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for Review model"""
    queryset = Review.objects.all()  # <<<< ADD THIS LINE!
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]  # <<< TEMPORARY for testing (remove later)

    def get_queryset(self):
        queryset = Review.objects.all()
        search = self.request.query_params.get('search', None)

        if search:
            queryset = queryset.filter(product__icontains=search)

        return queryset

@api_view(['GET'])
@permission_classes([permissions.AllowAny])  # <<< Allow public to view stats temporarily
def get_stats(request):
    """Get statistics for dashboard"""
    total_reviews = Review.objects.count()
    total_products = Review.objects.values('product').distinct().count()

    positive_reviews = Review.objects.filter(rating__gte=4).count()
    negative_reviews = Review.objects.filter(rating__lte=2).count()

    return Response({
        'totalReviews': total_reviews,
        'totalProducts': total_products,
        'positiveReviews': positive_reviews,
        'negativeReviews': negative_reviews
    })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_top_products(request):
    """Get top products by review count"""
    products = Review.objects.values('product') \
                .annotate(
                    reviewCount=Count('id'),
                    averageRating=Avg('rating')
                ) \
                .order_by('-reviewCount')[:5]

    result = []
    for product in products:
        sentiment = min(1.0, max(0.0, product['averageRating'] / 5.0))
        product_data = {
            'name': product['product'],
            'reviewCount': product['reviewCount'],
            'averageRating': product['averageRating'],
            'sentiment': sentiment
        }
        result.append(product_data)

    return Response(result)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_products(request):
    """Get unique product names for dropdown selection"""
    products = Review.objects.values('product').distinct()
    result = [{'id': i, 'name': p['product']} for i, p in enumerate(products, 1)]
    return Response(result)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def analyze_sentiment(request, product_id):
    """Analyze sentiment for a specific product"""
    products = list(Review.objects.values_list('product', flat=True).distinct())

    if not products or int(product_id) > len(products):
        return Response(
            {'message': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    product_name = products[int(product_id) - 1]
    reviews = Review.objects.filter(product=product_name)

    if not reviews:
        return Response(
            {'message': 'No reviews found for this product'},
            status=status.HTTP_404_NOT_FOUND
        )

    review_texts = [review.review for review in reviews]

    sentiment_result = analyze_product_sentiment(product_name, review_texts)

    return Response(sentiment_result)
