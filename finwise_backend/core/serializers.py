from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, DashboardSummary, Book, UserReadingPreference, UserReadingHistory, BookRecommendation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'

class DashboardSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardSummary
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class BookListSerializer(serializers.ModelSerializer):
    """Simplified serializer for book lists"""
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'genre', 'sub_genre', 'rating', 'cover_image_url', 'difficulty_level', 'investment_level']

class UserReadingPreferenceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserReadingPreference
        fields = '__all__'

class UserReadingHistorySerializer(serializers.ModelSerializer):
    book = BookListSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserReadingHistory
        fields = '__all__'

class BookRecommendationSerializer(serializers.ModelSerializer):
    book = BookListSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = BookRecommendation
        fields = '__all__'

class UserRegistrationSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user
