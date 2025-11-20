import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Clock, CheckCircle, AlertCircle, TrendingUp, BookOpen, FileText, Video } from 'lucide-react';
import { Application } from '../types';

interface DashboardProps {
  applications: Application[];
  onViewApplication: (application: Application) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ applications, onViewApplication }) => {
  const stats = {
    total: applications.length,
    drafts: applications.filter(app => app.status === 'draft').length,
    submitted: applications.filter(app => app.status === 'submitted').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
  };

  const recentApplications = applications
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Welcome to Your College Portal
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your applications, access tutorials, and get help from our AI assistant.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Applications"
          value={stats.total}
          icon={FileText}
          textColor="text-blue-600"
          bgColor="bg-blue-100 dark:bg-blue-900"
        />
        <StatCard
          title="Drafts"
          value={stats.drafts}
          icon={Clock}
          textColor="text-yellow-600"
          bgColor="bg-yellow-100 dark:bg-yellow-900"
        />
        <StatCard
          title="Submitted"
          value={stats.submitted}
          icon={TrendingUp}
          textColor="text-green-600"
          bgColor="bg-green-100 dark:bg-green-900"
        />
        <StatCard
          title="Accepted"
          value={stats.accepted}
          icon={CheckCircle}
          textColor="text-purple-600"
          bgColor="bg-purple-100 dark:bg-purple-900"
        />
      </div>

      {/* Quick Actions */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/applications/new"
            className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group"
          >
            <div className="text-center">
              <Plus className="h-8 w-8 text-gray-400 group-hover:text-primary-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                Start New Application
              </p>
            </div>
          </Link>
          
          <Link
            to="/tutorials"
            className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
          >
            <div className="text-center">
              <Video className="h-8 w-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400">
                Watch Tutorials
              </p>
            </div>
          </Link>
          
          <button className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
            <div className="text-center">
              <BookOpen className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                View Resources
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Recent Applications
          </h2>
          <Link
            to="/applications"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
          >
            View all
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No applications yet
            </p>
            <Link
              to="/applications/new"
              className="btn btn-primary"
            >
              Create Your First Application
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onView={() => onViewApplication(application)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  textColor: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  textColor,
  bgColor,
}) => (
  <div className="card p-6">
    <div className="flex items-center">
      <div className={`${bgColor} p-3 rounded-lg`}>
        <Icon className={`h-6 w-6 text-white`} />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      </div>
    </div>
  </div>
);

// Application Card Component
interface ApplicationCardProps {
  application: Application;
  onView: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onView }) => {
  const getStatusIcon = () => {
    switch (application.status) {
      case 'submitted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'under-review':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'draft':
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (application.status) {
      case 'submitted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'under-review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'draft':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor()}`}>
            {application.status.replace('-', ' ')}
          </span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {application.collegeName} - {application.program}
          </h3>
          <p className="text-sm text-gray-500">
            Updated {new Date(application.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">
            {application.completionPercentage}% complete
          </div>
          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full"
              style={{ width: `${application.completionPercentage}%` }}
            />
          </div>
        </div>
        
        <button
          onClick={onView}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <Eye className="h-4 w-4" />
          <span>View</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;