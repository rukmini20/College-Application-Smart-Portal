import React, { useState, useMemo } from 'react';
import { Search, Filter, SortAsc, FileText, Video, User } from 'lucide-react';
import { Application, SearchResult } from '../types';

interface SearchComponentProps {
  applications: Application[];
  onResultClick: (result: SearchResult) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({
  applications,
  onResultClick,
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'application' | 'video' | 'document'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'name'>('relevance');

  // Mock video tutorials and documents for demonstration
  const mockVideos = [
    {
      id: 'video1',
      title: 'How to Write a Compelling Personal Statement',
      description: 'Learn the key elements of a successful college application essay',
      url: '/tutorials/personal-statement',
    },
    {
      id: 'video2',
      title: 'Financial Aid Application Guide',
      description: 'Step-by-step guide to applying for financial aid and scholarships',
      url: '/tutorials/financial-aid',
    },
    {
      id: 'video3',
      title: 'Interview Preparation Tips',
      description: 'How to prepare for college admission interviews',
      url: '/tutorials/interviews',
    },
  ];

  const mockDocuments = [
    {
      id: 'doc1',
      title: 'Common Application Requirements',
      description: 'Complete list of requirements for Common App submissions',
      url: '/documents/common-app-requirements',
    },
    {
      id: 'doc2',
      title: 'Scholarship Opportunities 2024',
      description: 'Comprehensive list of available scholarships',
      url: '/documents/scholarships-2024',
    },
  ];

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const lowercaseQuery = query.toLowerCase();

    // Search applications
    if (filterType === 'all' || filterType === 'application') {
      applications.forEach((app) => {
        const searchableText = [
          app.collegeName,
          app.program,
          app.personalInfo?.firstName,
          app.personalInfo?.lastName,
          app.academicInfo?.currentSchool,
        ].filter(Boolean).join(' ').toLowerCase();

        if (searchableText.includes(lowercaseQuery)) {
          results.push({
            id: app.id,
            type: 'application',
            title: `${app.collegeName} - ${app.program}`,
            description: `Application status: ${app.status}`,
            url: `/applications/${app.id}`,
            relevanceScore: calculateRelevanceScore(searchableText, lowercaseQuery),
          });
        }
      });
    }

    // Search videos
    if (filterType === 'all' || filterType === 'video') {
      mockVideos.forEach((video) => {
        const searchableText = [video.title, video.description].join(' ').toLowerCase();
        
        if (searchableText.includes(lowercaseQuery)) {
          results.push({
            id: video.id,
            type: 'video',
            title: video.title,
            description: video.description,
            url: video.url,
            relevanceScore: calculateRelevanceScore(searchableText, lowercaseQuery),
          });
        }
      });
    }

    // Search documents
    if (filterType === 'all' || filterType === 'document') {
      mockDocuments.forEach((doc) => {
        const searchableText = [doc.title, doc.description].join(' ').toLowerCase();
        
        if (searchableText.includes(lowercaseQuery)) {
          results.push({
            id: doc.id,
            type: 'document',
            title: doc.title,
            description: doc.description,
            url: doc.url,
            relevanceScore: calculateRelevanceScore(searchableText, lowercaseQuery),
          });
        }
      });
    }

    // Sort results
    switch (sortBy) {
      case 'relevance':
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
      case 'name':
        return results.sort((a, b) => a.title.localeCompare(b.title));
      case 'date':
        return results; // Would sort by date if we had date info
      default:
        return results;
    }
  }, [query, filterType, sortBy, applications]);

  const calculateRelevanceScore = (text: string, query: string): number => {
    const words = query.split(' ').filter(word => word.length > 0);
    let score = 0;
    
    words.forEach(word => {
      if (text.includes(word)) {
        score += 1;
        // Boost score for exact matches at word boundaries
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(text)) {
          score += 2;
        }
      }
    });
    
    return score;
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'application':
        return <User className="h-5 w-5 text-primary-600" />;
      case 'video':
        return <Video className="h-5 w-5 text-green-600" />;
      case 'document':
        return <FileText className="h-5 w-5 text-blue-600" />;
      default:
        return <Search className="h-5 w-5 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex min-h-full items-start justify-center p-4 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
          <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            {/* Search Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Search College Portal
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close search"
              >
                ×
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search applications, tutorials, documents..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All</option>
                  <option value="application">Applications</option>
                  <option value="video">Videos</option>
                  <option value="document">Documents</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <SortAsc className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="name">Name</option>
                  <option value="date">Date</option>
                </select>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {query.trim() === '' ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Start typing to search through your applications, tutorials, and documents
                  </p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No results found for "{query}"
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Try using different keywords or check your spelling
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => onResultClick(result)}
                      className="w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getResultIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {result.title}
                            </p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 capitalize">
                              {result.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {result.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {query.trim() && searchResults.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{query}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};