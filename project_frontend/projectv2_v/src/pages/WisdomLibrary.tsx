import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Star, 
  Search, 
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  Heart,
  ShoppingCart,
  ExternalLink,
  Bookmark,
  User,
  Target,
  BarChart3
} from 'lucide-react';
import { wisdomLibraryAPI, booksAPI, readingHistoryAPI } from '../utils/api';

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  sub_genre: string;
  rating: number;
  cover_image_url: string;
  difficulty_level: string;
  investment_level: string;
  amazon_url?: string;
}

interface Recommendation {
  book: Book;
  score: number;
  reason: string;
}

interface ReadingStats {
  total_books: number;
  completed_books: number;
  currently_reading: number;
  want_to_read: number;
  average_rating: number;
  completion_rate: number;
}

const WisdomLibrary = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [readingStats, setReadingStats] = useState<ReadingStats | null>(null);
  const [recentBooks, setRecentBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookModal, setShowBookModal] = useState(false);

  useEffect(() => {
    loadWisdomLibrary();
  }, []);

  const loadWisdomLibrary = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await wisdomLibraryAPI.get();
      setRecommendations(data.recommendations || []);
      setReadingStats(data.reading_stats);
      setRecentBooks(data.recent_books || []);
    } catch (err: any) {
      console.error('Failed to load wisdom library:', err);
      setError('Failed to load wisdom library. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setShowBookModal(true);
  };

  const handleReadingStatus = async (bookId: number, status: string) => {
    try {
      await readingHistoryAPI.update({
        book_id: bookId,
        status: status
      });
      // Refresh the library data
      loadWisdomLibrary();
    } catch (err) {
      console.error('Failed to update reading status:', err);
    }
  };

  const getStarRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvestmentLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-blue-100 text-blue-800';
      case 'Intermediate': return 'bg-purple-100 text-purple-800';
      case 'Advanced': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your personalized wisdom library...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <BookOpen className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Library</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadWisdomLibrary}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Wisdom Library</h1>
          </div>
          <p className="text-gray-600">Discover personalized financial books and build your knowledge</p>
        </motion.div>

        {/* Reading Statistics */}
        {readingStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-blue-600 text-sm font-medium">Total Books</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{readingStats.total_books}</h3>
              <p className="text-blue-600">In your library</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <span className="text-green-600 text-sm font-medium">Completed</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{readingStats.completed_books}</h3>
              <p className="text-green-600">{readingStats.completion_rate}% completion rate</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
                <span className="text-yellow-600 text-sm font-medium">Reading</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{readingStats.currently_reading}</h3>
              <p className="text-yellow-600">Currently reading</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Star className="h-8 w-8 text-purple-600" />
                <span className="text-purple-600 text-sm font-medium">Avg Rating</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{readingStats.average_rating}</h3>
              <p className="text-purple-600">Your average rating</p>
            </div>
          </motion.div>
        )}

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">AI-Powered Recommendations</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => handleBookClick(rec.book)}
              >
                                  <div className="relative mb-4">
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden shadow-lg">
                      <img
                        src={rec.book.cover_image_url}
                        alt={rec.book.title}
                        className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // Create a better fallback with genre-based colors
                          const genreColors = {
                            'Business & Management': '1f2937',
                            'Psychology': '7c3aed',
                            'Self-Help': '059669',
                            'Finance': 'dc2626',
                            'Investment': 'ea580c',
                            'Leadership': '2563eb',
                            'Entrepreneurship': '0891b2',
                            'Personal Finance': '16a34a',
                            'Mindset': '9333ea',
                            'Behavioral Economics': 'be185d',
                            'Behavioral Science': 'a855f7',
                            'Success': 'f59e0b',
                            'Productivity': '0d9488',
                            'Personal Development': '059669',
                            'Company Analysis': '1e40af',
                            'Startup Strategy': '0891b2',
                            'Innovation': '7c2d12',
                            'Business Model': '1e293b',
                          };
                          const color = genreColors[rec.book.genre as keyof typeof genreColors] || '1f2937';
                          const titleWords = rec.book.title.split(' ').slice(0, 3).join(' ');
                          target.src = `https://placehold.co/400x600/${color}/ffffff?text=${encodeURIComponent(titleWords)}&font=montserrat`;
                        }}
                        onLoad={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.opacity = '1';
                        }}
                        style={{ opacity: 0 }}
                      />
                      {/* Loading placeholder */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-gray-400" />
                      </div>
                      
                      {/* Book cover overlay with gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                    {rec.score.toFixed(1)}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-lg line-clamp-2" title={rec.book.title}>
                    {rec.book.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{rec.book.author}</p>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {getStarRating(rec.book.rating)}
                      <span className="ml-2 text-sm text-gray-600">{rec.book.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(rec.book.difficulty_level)}`}>
                      {rec.book.difficulty_level}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInvestmentLevelColor(rec.book.investment_level)}`}>
                      {rec.book.investment_level}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{rec.reason}</p>

                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReadingStatus(rec.book.id, 'want_to_read');
                      }}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Want to Read
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(rec.book.amazon_url || `https://www.amazon.com/s?k=${encodeURIComponent(rec.book.title)}`, '_blank');
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recently Viewed */}
        {recentBooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentBooks.map((bookHistory, index) => (
                <motion.div
                  key={bookHistory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleBookClick(bookHistory.book)}
                >
                  <div className="relative mb-4">
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden shadow-lg">
                      <img
                        src={bookHistory.book.cover_image_url}
                        alt={bookHistory.book.title}
                        className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const genreColors = {
                            'Business & Management': '1f2937',
                            'Psychology': '7c3aed',
                            'Self-Help': '059669',
                            'Finance': 'dc2626',
                            'Investment': 'ea580c',
                            'Leadership': '2563eb',
                            'Entrepreneurship': '0891b2',
                            'Personal Finance': '16a34a',
                            'Mindset': '9333ea',
                            'Behavioral Economics': 'be185d',
                            'Behavioral Science': 'a855f7',
                            'Success': 'f59e0b',
                            'Productivity': '0d9488',
                            'Personal Development': '059669',
                            'Company Analysis': '1e40af',
                            'Startup Strategy': '0891b2',
                            'Innovation': '7c2d12',
                            'Business Model': '1e293b',
                          };
                          const color = genreColors[bookHistory.book.genre as keyof typeof genreColors] || '1f2937';
                          const titleWords = bookHistory.book.title.split(' ').slice(0, 3).join(' ');
                          target.src = `https://placehold.co/400x600/${color}/ffffff?text=${encodeURIComponent(titleWords)}&font=montserrat`;
                        }}
                        onLoad={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.opacity = '1';
                        }}
                        style={{ opacity: 0 }}
                      />
                      {/* Loading placeholder */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-gray-400" />
                      </div>
                      
                      {/* Book cover overlay with gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                      {bookHistory.status.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-lg line-clamp-2">{bookHistory.book.title}</h3>
                    <p className="text-gray-600 text-sm">{bookHistory.book.author}</p>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {getStarRating(bookHistory.book.rating)}
                        <span className="ml-2 text-sm text-gray-600">{bookHistory.book.rating}</span>
                      </div>
                    </div>

                    {bookHistory.user_rating && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Your rating:</span>
                        <div className="flex items-center">
                          {getStarRating(bookHistory.user_rating)}
                          <span className="ml-2 text-sm text-gray-600">{bookHistory.user_rating}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Book Detail Modal */}
      {showBookModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedBook.title}</h2>
                <button
                  onClick={() => setShowBookModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="relative">
                    <img
                      src={selectedBook.cover_image_url}
                      alt={selectedBook.title}
                      className="w-full rounded-lg shadow-xl transition-all duration-300 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const genreColors = {
                          'Business & Management': '1f2937',
                          'Psychology': '7c3aed',
                          'Self-Help': '059669',
                          'Finance': 'dc2626',
                          'Investment': 'ea580c',
                          'Leadership': '2563eb',
                          'Entrepreneurship': '0891b2',
                          'Personal Finance': '16a34a',
                          'Mindset': '9333ea',
                          'Behavioral Economics': 'be185d',
                          'Behavioral Science': 'a855f7',
                          'Success': 'f59e0b',
                          'Productivity': '0d9488',
                          'Personal Development': '059669',
                          'Company Analysis': '1e40af',
                          'Startup Strategy': '0891b2',
                          'Innovation': '7c2d12',
                          'Business Model': '1e293b',
                        };
                        const color = genreColors[selectedBook.genre as keyof typeof genreColors] || '1f2937';
                        const titleWords = selectedBook.title.split(' ').slice(0, 3).join(' ');
                        target.src = `https://placehold.co/400x600/${color}/ffffff?text=${encodeURIComponent(titleWords)}&font=montserrat`;
                      }}
                    />
                    {/* Genre badge */}
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-lg">
                      {selectedBook.genre}
                    </div>
                    
                    {/* Book cover overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Author</h3>
                    <p className="text-gray-600">{selectedBook.author}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Genre</h3>
                    <p className="text-gray-600">{selectedBook.genre} • {selectedBook.sub_genre}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Rating</h3>
                    <div className="flex items-center space-x-2">
                      {getStarRating(selectedBook.rating)}
                      <span className="text-gray-600">{selectedBook.rating} out of 5</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedBook.difficulty_level)}`}>
                      {selectedBook.difficulty_level}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getInvestmentLevelColor(selectedBook.investment_level)}`}>
                      {selectedBook.investment_level}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        handleReadingStatus(selectedBook.id, 'want_to_read');
                        setShowBookModal(false);
                      }}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Want to Read
                    </button>
                    <button
                      onClick={() => {
                        handleReadingStatus(selectedBook.id, 'currently_reading');
                        setShowBookModal(false);
                      }}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Start Reading
                    </button>
                    <button
                      onClick={() => {
                        window.open(`https://www.amazon.com/s?k=${encodeURIComponent(selectedBook.title)}`, '_blank');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WisdomLibrary; 