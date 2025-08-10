from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Personal Information
    name = models.CharField(max_length=100, default='')
    email = models.EmailField(default='')
    phone = models.CharField(max_length=15, default='')
    
    # Financial Information
    income = models.FloatField(default=0.0)
    age = models.IntegerField(default=0)
    dependents = models.IntegerField(default=0)
    
    # Investment & Savings
    monthly_savings = models.FloatField(default=0.0)
    total_savings = models.FloatField(default=0.0)
    investment_amount = models.FloatField(default=0.0)
    savings_goal = models.FloatField(default=0.0)
    
    # Investment Details
    investments = models.TextField(blank=True, default='')
    investment_types = models.CharField(max_length=200, default='')  # e.g., "Stocks,Mutual Funds,PPF"
    
    # Additional Financial Info
    emergency_fund = models.FloatField(default=0.0)
    retirement_savings = models.FloatField(default=0.0)
    tax_deductions = models.FloatField(default=0.0)
    
    # Report Generation Fields
    occupation = models.CharField(max_length=100, default='')  # For benefit eligibility
    city = models.CharField(max_length=100, default='')  # For location-based benefits
    state = models.CharField(max_length=100, default='')  # For state-specific schemes
    marital_status = models.CharField(max_length=20, default='')  # For family benefits
    education = models.CharField(max_length=100, default='')  # For education benefits
    business_type = models.CharField(max_length=100, default='')  # For business benefits
    property_owned = models.BooleanField(default=False)  # For housing benefits
    vehicle_owned = models.BooleanField(default=False)  # For transport benefits
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class DashboardSummary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_savings = models.FloatField(default=0.0)
    monthly_savings = models.FloatField(default=0.0)
    savings_goal = models.FloatField(default=0.0)
    progress_percentage = models.FloatField(default=0.0)
    recommendations = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

class Book(models.Model):
    """Financial and self-help books for the wisdom library"""
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    genre = models.CharField(max_length=100)  # e.g., "Business & Management", "Psychology", "Self-Help"
    sub_genre = models.CharField(max_length=100, blank=True)  # e.g., "Investment", "Leadership", "Mindset"
    description = models.TextField()
    rating = models.FloatField(default=0.0)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    pages = models.IntegerField(null=True, blank=True)
    publication_year = models.IntegerField(null=True, blank=True)
    isbn = models.CharField(max_length=20, blank=True)
    cover_image_url = models.URLField(blank=True)
    amazon_url = models.URLField(blank=True)
    
    # Financial relevance tags
    investment_level = models.CharField(max_length=50, blank=True)  # Beginner, Intermediate, Advanced
    financial_topics = models.TextField(blank=True)  # JSON string of relevant topics
    difficulty_level = models.CharField(max_length=20, default='Beginner')  # Beginner, Intermediate, Advanced
    
    # ML features
    embedding_vector = models.TextField(blank=True)  # Store book embedding for similarity
    popularity_score = models.FloatField(default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', '-popularity_score']

    def __str__(self):
        return f"{self.title} by {self.author}"

class UserReadingPreference(models.Model):
    """User's reading preferences and history"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # Preferred genres (stored as JSON)
    preferred_genres = models.JSONField(default=list)
    preferred_authors = models.JSONField(default=list)
    preferred_topics = models.JSONField(default=list)
    
    # Reading level preferences
    preferred_difficulty = models.CharField(max_length=20, default='Beginner')
    preferred_investment_level = models.CharField(max_length=20, default='Beginner')
    
    # Reading goals
    books_per_month = models.IntegerField(default=1)
    reading_goal = models.IntegerField(default=12)  # books per year
    
    # ML features
    user_embedding = models.TextField(blank=True)  # User preference embedding
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class UserReadingHistory(models.Model):
    """Track user's reading history and interactions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    
    # Reading status
    STATUS_CHOICES = [
        ('want_to_read', 'Want to Read'),
        ('currently_reading', 'Currently Reading'),
        ('completed', 'Completed'),
        ('abandoned', 'Abandoned'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='want_to_read')
    
    # User ratings and reviews
    user_rating = models.FloatField(null=True, blank=True)
    user_review = models.TextField(blank=True)
    
    # Reading progress
    pages_read = models.IntegerField(default=0)
    completion_percentage = models.FloatField(default=0.0)
    
    # Interaction data
    time_spent_reading = models.IntegerField(default=0)  # in minutes
    last_read_date = models.DateTimeField(null=True, blank=True)
    
    # ML features
    interaction_score = models.FloatField(default=0.0)  # How much user engaged with this book
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'book']

class BookRecommendation(models.Model):
    """ML-generated book recommendations for users"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    
    # Recommendation metadata
    recommendation_score = models.FloatField()  # ML confidence score
    recommendation_reason = models.TextField()  # Why this book was recommended
    recommendation_type = models.CharField(max_length=50)  # e.g., "collaborative", "content-based", "hybrid"
    
    # Recommendation status
    is_viewed = models.BooleanField(default=False)
    is_clicked = models.BooleanField(default=False)
    is_added_to_list = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)  # When recommendation expires

    class Meta:
        unique_together = ['user', 'book']
        ordering = ['-recommendation_score']
