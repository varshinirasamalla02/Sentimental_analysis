from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Review

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'mobile', 'password', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            mobile=validated_data['mobile']
        )
        return user


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review model"""
    created_by_name = serializers.SerializerMethodField()
    updated_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ('id', 'product', 'rating', 'review', 'created_by', 'updated_by', 
                  'created_by_name', 'updated_by_name', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_by', 'updated_by', 'created_at', 'updated_at')

    def get_created_by_name(self, obj):
        return obj.created_by.get_full_name()

    def get_updated_by_name(self, obj):
        return obj.updated_by.get_full_name()

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        
        validated_data['created_by'] = user
        validated_data['updated_by'] = user
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        validated_data['updated_by'] = request.user
        
        return super().update(instance, validated_data)