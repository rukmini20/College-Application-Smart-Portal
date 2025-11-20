import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, SortAsc } from 'lucide-react';
import { Application } from '../types';
import { ApplicationCard } from '../components/ui/ApplicationCard';

interface ApplicationsPageProps {
  applications: Application[];
  onViewApplication: (application: Application) => void;
}

const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  applications,
  onViewApplication,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | Application['status']>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'name' | 'status'>('updated');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedApplications = React.useMemo(() => {
    let filtered = applications;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.collegeName.toLowerCase().includes(query) ||
        app.program.toLowerCase().includes(query) ||
        `${app.personalInfo?.firstName} ${app.personalInfo?.lastName}`.toLowerCase().includes(query)
      );
    }

    // Sort applications
    switch (sortBy) {
      case 'updated':
        return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      case 'created':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'name':
        return filtered.sort((a, b) => a.collegeName.localeCompare(b.collegeName));
      case 'status':
        return filtered.sort((a, b) => a.status.localeCompare(b.status));
      default:
        return filtered;
    }
  }, [applications, filterStatus, sortBy, searchQuery]);

  const statusCounts = React.useMemo(() => {
    return {
      all: applications.length,
      draft: applications.filter(app => app.status === 'draft').length,
      submitted: applications.filter(app => app.status === 'submitted').length,
      'under-review': applications.filter(app => app.status === 'under-review').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
    };
  }, [applications]);

  const handleDeleteApplication = (id: string) => {
    if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      // In a real app, this would call a delete function
      console.log('Delete application:', id);
    }
  };

  const handleDownloadApplication = (application: Application) => {
    // In a real app, this would generate and download a PDF
    console.log('Download application:', application.id);
    alert('Download functionality would be implemented here');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            My Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your college applications
          </p>
        </div>
        <Link to="/applications/new" className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Application</span>
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filterStatus === status
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                  {count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search applications by college name, program, or your name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full form-input"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="under-review">Under Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <SortAsc className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="name">College Name</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Grid/List */}
      {filteredAndSortedApplications.length === 0 ? (
        <div className="text-center py-12">
          {applications.length === 0 ? (
            <>
              <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Get started by creating your first college application
              </p>
              <Link to="/applications/new" className="btn btn-primary">
                Create Your First Application
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No applications match your filters
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search criteria or create a new application
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
                className="btn btn-secondary mr-3"
              >
                Clear Filters
              </button>
              <Link to="/applications/new" className="btn btn-primary">
                New Application
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onView={() => onViewApplication(application)}
              onEdit={() => {
                // Navigate to edit form
                console.log('Edit application:', application.id);
              }}
              onDelete={() => handleDeleteApplication(application.id)}
              onDownload={() => handleDownloadApplication(application)}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* Results Summary */}
      {filteredAndSortedApplications.length > 0 && (
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
          Showing {filteredAndSortedApplications.length} of {applications.length} applications
          {searchQuery && ` matching "${searchQuery}"`}
          {filterStatus !== 'all' && ` with status "${filterStatus}"`}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;