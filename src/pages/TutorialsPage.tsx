import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, BookOpen, Star, Search, Filter } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Essays' | 'Applications' | 'Interviews' | 'Financial Aid' | 'General';
  thumbnailUrl: string;
  videoUrl: string;
  isCompleted: boolean;
  rating: number;
  views: number;
}

const TutorialsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | Tutorial['category']>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | Tutorial['difficulty']>('all');
  const [sortBy, setSortBy] = useState<'title' | 'duration' | 'rating' | 'views'>('title');

  // Mock tutorial data
  const tutorials: Tutorial[] = [
    {
      id: 'personal-statement',
      title: 'How to Write a Compelling Personal Statement',
      description: 'Learn the key elements that make personal statements stand out to admissions committees. We\'ll cover structure, storytelling techniques, and common pitfalls to avoid.',
      duration: 25,
      difficulty: 'Intermediate',
      category: 'Essays',
      thumbnailUrl: '/thumbnails/personal-statement.jpg',
      videoUrl: '/videos/personal-statement.mp4',
      isCompleted: false,
      rating: 4.8,
      views: 1234,
    },
    {
      id: 'financial-aid',
      title: 'Financial Aid Application Guide',
      description: 'Step-by-step guide to applying for financial aid, scholarships, and understanding the FAFSA process.',
      duration: 30,
      difficulty: 'Beginner',
      category: 'Financial Aid',
      thumbnailUrl: '/thumbnails/financial-aid.jpg',
      videoUrl: '/videos/financial-aid.mp4',
      isCompleted: true,
      rating: 4.6,
      views: 892,
    },
    {
      id: 'interviews',
      title: 'College Interview Preparation',
      description: 'Master the art of college interviews with practical tips, common questions, and how to make a lasting impression.',
      duration: 20,
      difficulty: 'Intermediate',
      category: 'Interviews',
      thumbnailUrl: '/thumbnails/interviews.jpg',
      videoUrl: '/videos/interviews.mp4',
      isCompleted: false,
      rating: 4.7,
      views: 567,
    },
    {
      id: 'common-app',
      title: 'Common Application Walkthrough',
      description: 'Complete guide to filling out the Common Application, including tips for each section and avoiding common mistakes.',
      duration: 35,
      difficulty: 'Beginner',
      category: 'Applications',
      thumbnailUrl: '/thumbnails/common-app.jpg',
      videoUrl: '/videos/common-app.mp4',
      isCompleted: false,
      rating: 4.9,
      views: 2156,
    },
    {
      id: 'supplemental-essays',
      title: 'Writing Effective Supplemental Essays',
      description: 'Strategies for tackling school-specific essay prompts and demonstrating fit with your target colleges.',
      duration: 28,
      difficulty: 'Advanced',
      category: 'Essays',
      thumbnailUrl: '/thumbnails/supplemental-essays.jpg',
      videoUrl: '/videos/supplemental-essays.mp4',
      isCompleted: false,
      rating: 4.5,
      views: 743,
    },
    {
      id: 'college-research',
      title: 'How to Research Colleges Effectively',
      description: 'Learn how to research colleges beyond rankings to find schools that truly fit your goals and interests.',
      duration: 22,
      difficulty: 'Beginner',
      category: 'General',
      thumbnailUrl: '/thumbnails/college-research.jpg',
      videoUrl: '/videos/college-research.mp4',
      isCompleted: true,
      rating: 4.4,
      views: 1089,
    },
  ];

  const filteredTutorials = React.useMemo(() => {
    let filtered = tutorials;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tutorial =>
        tutorial.title.toLowerCase().includes(query) ||
        tutorial.description.toLowerCase().includes(query) ||
        tutorial.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.category === filterCategory);
    }

    // Filter by difficulty
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.difficulty === filterDifficulty);
    }

    // Sort tutorials
    switch (sortBy) {
      case 'title':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'duration':
        return filtered.sort((a, b) => a.duration - b.duration);
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'views':
        return filtered.sort((a, b) => b.views - a.views);
      default:
        return filtered;
    }
  }, [tutorials, searchQuery, filterCategory, filterDifficulty, sortBy]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Video Tutorials
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Learn everything you need to know about the college application process
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              <option value="Essays">Essays</option>
              <option value="Applications">Applications</option>
              <option value="Interviews">Interviews</option>
              <option value="Financial Aid">Financial Aid</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty:</span>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="title">Title</option>
              <option value="duration">Duration</option>
              <option value="rating">Rating</option>
              <option value="views">Popularity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tutorials Grid */}
      {filteredTutorials.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No tutorials found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria or check back later for new content
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredTutorials.length} of {tutorials.length} tutorials
          </div>
        </>
      )}
    </div>
  );
};

// Tutorial Card Component
interface TutorialCardProps {
  tutorial: Tutorial;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial }) => {
  const formatDuration = (minutes: number): string => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getDifficultyColor = (difficulty: Tutorial['difficulty']): string => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
            <Play className="h-6 w-6 text-gray-900 ml-1" />
          </div>
        </div>
        
        {tutorial.isCompleted && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
            Completed
          </div>
        )}
        
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
          {formatDuration(tutorial.duration)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
            {tutorial.difficulty}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {tutorial.category}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
          {tutorial.title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {tutorial.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {tutorial.rating}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {tutorial.views.toLocaleString()} views
            </span>
          </div>
        </div>

        <Link
          to={`/tutorials/${tutorial.id}`}
          className="btn btn-primary w-full flex items-center justify-center space-x-2"
        >
          <Play className="h-4 w-4" />
          <span>Watch Tutorial</span>
        </Link>
      </div>
    </div>
  );
};

export default TutorialsPage;