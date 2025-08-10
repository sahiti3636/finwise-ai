from django.core.management.base import BaseCommand
from core.models import Book
from core.book_covers import book_cover_service
import random

class Command(BaseCommand):
    help = 'Populate the database with sample financial books'
    


    def handle(self, *args, **options):
        books_data = [
            # Business & Management Books
            {
                'title': 'The Psychology of Money',
                'author': 'Morgan Housel',
                'genre': 'Business & Management',
                'sub_genre': 'Investment',
                'description': 'Timeless lessons on wealth, greed, and happiness. Understanding how people think about money.',
                'rating': 4.5,
                'difficulty_level': 'Beginner',
                'investment_level': 'Beginner',
                'financial_topics': '["Behavioral Finance", "Wealth Building", "Psychology"]',
                'popularity_score': 9.2
            },
            {
                'title': 'Rich Dad Poor Dad',
                'author': 'Robert T. Kiyosaki',
                'genre': 'Business & Management',
                'sub_genre': 'Investment',
                'description': 'What the rich teach their kids about money that the poor and middle class do not.',
                'rating': 4.3,
                'difficulty_level': 'Beginner',
                'investment_level': 'Beginner',
                'financial_topics': '["Financial Education", "Assets vs Liabilities", "Cash Flow"]',
                'popularity_score': 8.8
            },
            {
                'title': 'The Intelligent Investor',
                'author': 'Benjamin Graham',
                'genre': 'Business & Management',
                'sub_genre': 'Investment',
                'description': 'The definitive book on value investing, written by Warren Buffett\'s mentor.',
                'rating': 4.6,
                'difficulty_level': 'Advanced',
                'investment_level': 'Advanced',
                'financial_topics': '["Value Investing", "Stock Analysis", "Risk Management"]',
                'popularity_score': 9.0
            },
            {
                'title': 'Think and Grow Rich',
                'author': 'Napoleon Hill',
                'genre': 'Business & Management',
                'sub_genre': 'Mindset',
                'description': 'Based on interviews with successful people, this book reveals the secrets to success.',
                'rating': 4.4,
                'difficulty_level': 'Beginner',
                'investment_level': 'Beginner',
                'financial_topics': '["Success Principles", "Mindset", "Goal Setting"]',
                'popularity_score': 8.5
            },
            {
                'title': 'The 7 Habits of Highly Effective People',
                'author': 'Stephen R. Covey',
                'genre': 'Business & Management',
                'sub_genre': 'Leadership',
                'description': 'A powerful framework for personal and professional effectiveness.',
                'rating': 4.5,
                'difficulty_level': 'Intermediate',
                'investment_level': 'Intermediate',
                'financial_topics': '["Leadership", "Productivity", "Personal Development"]',
                'popularity_score': 8.9
            },
            
            # Psychology Books
            {
                'title': 'Thinking, Fast and Slow',
                'author': 'Daniel Kahneman',
                'genre': 'Psychology',
                'sub_genre': 'Behavioral Economics',
                'description': 'Nobel Prize winner explains the two systems that drive the way we think.',
                'rating': 4.4,
                'difficulty_level': 'Intermediate',
                'investment_level': 'Intermediate',
                'financial_topics': '["Decision Making", "Cognitive Biases", "Behavioral Economics"]',
                'popularity_score': 8.7
            },
            {
                'title': 'The Power of Habit',
                'author': 'Charles Duhigg',
                'genre': 'Psychology',
                'sub_genre': 'Behavioral Science',
                'description': 'Why we do what we do in life and business. Understanding habit formation.',
                'rating': 4.3,
                'difficulty_level': 'Beginner',
                'investment_level': 'Beginner',
                'financial_topics': '["Habit Formation", "Behavioral Change", "Productivity"]',
                'popularity_score': 8.2
            },
            {
                'title': 'Mindset: The New Psychology of Success',
                'author': 'Carol S. Dweck',
                'genre': 'Psychology',
                'sub_genre': 'Growth Mindset',
                'description': 'How we can learn to fulfill our potential through the power of mindset.',
                'rating': 4.4,
                'difficulty_level': 'Beginner',
                'investment_level': 'Beginner',
                'financial_topics': '["Growth Mindset", "Learning", "Personal Development"]',
                'popularity_score': 8.4
            },
            {
                'title': 'Atomic Habits',
                'author': 'James Clear',
                'genre': 'Psychology',
                'sub_genre': 'Behavioral Science',
                'description': 'Tiny changes, remarkable results. An easy and proven way to build good habits.',
                'rating': 4.6,
                'difficulty_level': 'Beginner',
                'investment_level': 'Beginner',
                'financial_topics': '["Habit Building", "Personal Development", "Productivity"]',
                'popularity_score': 9.1
            },
            {
                'title': 'The Subtle Art of Not Giving a F*ck',
                'author': 'Mark Manson',
                'genre': 'Psychology',
                'sub_genre': 'Self-Help',
                'description': 'A counterintuitive approach to living a good life.',
                'rating': 4.2,
                'difficulty_level': 'Beginner',
                'investment_level': 'Beginner',
                'financial_topics': '["Mindset", "Life Philosophy", "Personal Growth"]',
                'popularity_score': 8.0
            },
            
            # Self-Help / Personal Growth Books
            {
                'title': 'The 5 AM Club',
                'author': 'Robin Sharma',
                'genre': 'Self-Help / Personal Growth',
                'sub_genre': 'Productivity',
                'description': 'Own your morning, elevate your life. The morning routine of successful people.',
                'rating': 4.3,
                'difficulty_level': 'Beginner',
                'investment_level': 'Beginner',
                'financial_topics': '["Morning Routine", "Productivity", "Personal Development"]',
                'popularity_score': 8.3
            },
            {
                'title': 'Deep Work',
                'author': 'Cal Newport',
                'genre': 'Self-Help / Personal Growth',
                'sub_genre': 'Productivity',
                'description': 'Rules for focused success in a distracted world.',
                'rating': 4.4,
                'difficulty_level': 'Intermediate',
                'investment_level': 'Intermediate',
                'financial_topics': '["Focus", "Productivity", "Career Development"]',
                'popularity_score': 8.6
            },
            {
                'title': 'The Compound Effect',
                'author': 'Darren Hardy',
                'genre': 'Self-Help / Personal Growth',
                'sub_genre': 'Success',
                'description': 'Jumpstart your income, your life, your success.',
                'rating': 4.3,
                'difficulty_level': 'Beginner',
                'investment_level': 'Beginner',
                'financial_topics': '["Compound Effect", "Success Principles", "Personal Development"]',
                'popularity_score': 8.1
            },
            {
                'title': 'Who Moved My Cheese?',
                'author': 'Spencer Johnson',
                'genre': 'Self-Help / Personal Growth',
                'sub_genre': 'Change Management',
                'description': 'An amazing way to deal with change in your work and in your life.',
                'rating': 4.1,
                'difficulty_level': 'Beginner',
                'investment_level': 'Beginner',
                'financial_topics': '["Change Management", "Adaptability", "Personal Growth"]',
                'popularity_score': 7.8
            },
            {
                'title': 'The Alchemist',
                'author': 'Paulo Coelho',
                'genre': 'Self-Help / Personal Growth',
                'sub_genre': 'Inspiration',
                'description': 'A magical story about following your dreams and listening to your heart.',
                'rating': 4.5,
                'difficulty_level': 'Beginner',
                'investment_level': 'Beginner',
                'financial_topics': '["Dreams", "Personal Journey", "Inspiration"]',
                'popularity_score': 8.7
            },
            
            # Investment Books
            {
                'title': 'A Random Walk Down Wall Street',
                'author': 'Burton G. Malkiel',
                'genre': 'Business & Management',
                'sub_genre': 'Investment',
                'description': 'The time-tested strategy for successful investing.',
                'rating': 4.4,
                'difficulty_level': 'Intermediate',
                'investment_level': 'Intermediate',
                'financial_topics': '["Index Investing", "Market Efficiency", "Portfolio Management"]',
                'popularity_score': 8.5
            },
            {
                'title': 'The Total Money Makeover',
                'author': 'Dave Ramsey',
                'genre': 'Business & Management',
                'sub_genre': 'Personal Finance',
                'description': 'A proven plan for financial fitness.',
                'rating': 4.3,
                'difficulty_level': 'Beginner',
                'investment_level': 'Beginner',
                'financial_topics': '["Debt Management", "Budgeting", "Emergency Fund"]',
                'popularity_score': 8.2
            },
            {
                'title': 'Shoe Dog',
                'author': 'Phil Knight',
                'genre': 'Business & Management',
                'sub_genre': 'Entrepreneurship',
                'description': 'A memoir by the creator of Nike.',
                'rating': 4.5,
                'difficulty_level': 'Intermediate',
                'investment_level': 'Intermediate',
                'financial_topics': '["Entrepreneurship", "Business Building", "Leadership"]',
                'popularity_score': 8.8
            },
            {
                'title': 'Good to Great',
                'author': 'Jim Collins',
                'genre': 'Business & Management',
                'sub_genre': 'Leadership',
                'description': 'Why some companies make the leap and others don\'t.',
                'rating': 4.4,
                'difficulty_level': 'Advanced',
                'investment_level': 'Advanced',
                'financial_topics': '["Business Strategy", "Leadership", "Company Analysis"]',
                'popularity_score': 8.6
            },
            {
                'title': 'The Lean Startup',
                'author': 'Eric Ries',
                'genre': 'Business & Management',
                'sub_genre': 'Entrepreneurship',
                'description': 'How constant innovation creates radically successful businesses.',
                'rating': 4.3,
                'difficulty_level': 'Intermediate',
                'investment_level': 'Intermediate',
                'financial_topics': '["Startup Strategy", "Innovation", "Business Model"]',
                'popularity_score': 8.4
            }
        ]

        for book_data in books_data:
            # Get book cover from multiple sources with fallbacks
            book_data['cover_image_url'] = book_cover_service.get_book_cover(
                book_data['title'], 
                book_data['author'], 
                book_data['genre']
            )
            
            # Generate Amazon URL
            book_data['amazon_url'] = f"https://www.amazon.com/s?k={book_data['title'].replace(' ', '+')}+{book_data['author'].replace(' ', '+')}"
            
            # Set random price between 10 and 50
            book_data['price'] = round(random.uniform(10, 50), 2)
            
            # Set random pages between 200 and 500
            book_data['pages'] = random.randint(200, 500)
            
            # Set publication year between 1990 and 2023
            book_data['publication_year'] = random.randint(1990, 2023)
            
            # Generate ISBN
            book_data['isbn'] = f"978-{random.randint(100000000, 999999999)}"
            
            # Create or update book
            book, created = Book.objects.get_or_create(
                title=book_data['title'],
                author=book_data['author'],
                defaults=book_data
            )
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created book: {book.title}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Book already exists: {book.title}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully populated {len(books_data)} books')
        ) 