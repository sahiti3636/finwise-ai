import requests
import time
import random
from typing import Optional

class BookCoverService:
    """Service to fetch book cover images from multiple sources with fallbacks"""
    
    def __init__(self):
        self.sources = [
            self._get_google_books_cover,  # Primary source - real book covers
            self._get_openlibrary_cover,   # Secondary source - OpenLibrary
            self._get_simple_placeholder   # Final fallback - simple text placeholder
        ]
    
    def get_book_cover(self, title: str, author: str, genre: str = "Business & Management") -> str:
        """Get book cover from multiple sources with fallbacks"""
        for source_func in self.sources[:-1]:  # Exclude simple placeholder as it's the final fallback
            try:
                cover_url = source_func(title, author, genre)
                if cover_url:
                    return cover_url
            except Exception as e:
                print(f"Error fetching cover from {source_func.__name__}: {e}")
                continue
        
        # Final fallback to simple placeholder
        return self._get_simple_placeholder(title, author, genre)
    
    def _get_google_books_cover(self, title: str, author: str, genre: str) -> Optional[str]:
        """Get book cover from Google Books API (free tier) - Primary source"""
        try:
            # Try exact title + author first
            search_query = f"{title} {author}".replace(' ', '+')
            search_url = f"https://www.googleapis.com/books/v1/volumes?q={search_query}&maxResults=1"
            
            response = requests.get(search_url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('items') and len(data['items']) > 0:
                    book = data['items'][0]
                    if 'volumeInfo' in book and 'imageLinks' in book['volumeInfo']:
                        cover_url = book['volumeInfo']['imageLinks'].get('thumbnail', '')
                        if cover_url:
                            # Convert to larger size for better quality
                            cover_url = cover_url.replace('zoom=1', 'zoom=3')
                            return cover_url
            
            # If exact match fails, try just title
            search_query = title.replace(' ', '+')
            search_url = f"https://www.googleapis.com/books/v1/volumes?q={search_query}&maxResults=3"
            
            response = requests.get(search_url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('items') and len(data['items']) > 0:
                    # Find the best match
                    for book in data['items']:
                        if 'volumeInfo' in book and 'imageLinks' in book['volumeInfo']:
                            cover_url = book['volumeInfo']['imageLinks'].get('thumbnail', '')
                            if cover_url:
                                # Convert to larger size
                                cover_url = cover_url.replace('zoom=1', 'zoom=3')
                                return cover_url
            
            time.sleep(0.2)  # Be respectful to the API
            return None
            
        except Exception as e:
            print(f"Google Books error for '{title}': {e}")
            return None
    
    def _get_openlibrary_cover(self, title: str, author: str, genre: str) -> Optional[str]:
        """Get book cover from OpenLibrary API - Secondary source"""
        try:
            # Try exact title + author first
            search_query = f"{title} {author}".replace(' ', '+')
            search_url = f"https://openlibrary.org/search.json?title={search_query}&limit=3"
            
            response = requests.get(search_url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('docs') and len(data['docs']) > 0:
                    # Find the best match
                    for book in data['docs']:
                        if 'cover_i' in book:
                            cover_id = book['cover_i']
                            cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
                            return cover_url
            
            # If exact match fails, try just title
            search_query = title.replace(' ', '+')
            search_url = f"https://openlibrary.org/search.json?title={search_query}&limit=3"
            
            response = requests.get(search_url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('docs') and len(data['docs']) > 0:
                    for book in data['docs']:
                        if 'cover_i' in book:
                            cover_id = book['cover_i']
                            cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
                            return cover_url
            
            time.sleep(0.2)  # Be respectful to the API
            return None
            
        except Exception as e:
            print(f"OpenLibrary error for '{title}': {e}")
            return None
    
    def _get_simple_placeholder(self, title: str, author: str, genre: str) -> str:
        """Generate a simple text-based placeholder as final fallback"""
        # Get genre-specific colors
        genre_colors = {
            'Business & Management': '1f2937',  # Dark blue-gray
            'Psychology': '7c3aed',  # Purple
            'Self-Help': '059669',  # Green
            'Finance': 'dc2626',  # Red
            'Investment': 'ea580c',  # Orange
            'Leadership': '2563eb',  # Blue
            'Entrepreneurship': '0891b2',  # Cyan
            'Personal Finance': '16a34a',  # Green
            'Mindset': '9333ea',  # Purple
            'Behavioral Economics': 'be185d',  # Pink
            'Behavioral Science': 'a855f7',  # Purple
            'Success': 'f59e0b',  # Yellow
            'Productivity': '0d9488',  # Teal
            'Personal Development': '059669',  # Green
            'Company Analysis': '1e40af',  # Blue
            'Startup Strategy': '0891b2',  # Cyan
            'Innovation': '7c2d12',  # Brown
            'Business Model': '1e293b',  # Slate
        }
        
        color = genre_colors.get(genre, '1f2937')
        title_words = title.split()[:3]  # Take first 3 words
        title_text = '+'.join(title_words)
        
        return f"https://placehold.co/400x600/{color}/ffffff?text={title_text}&font=montserrat"

# Global instance
book_cover_service = BookCoverService() 