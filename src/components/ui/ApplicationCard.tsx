import React from 'react';
import { Eye, Edit, Trash2, Download, CheckCircle, Clock, AlertCircle, User } from 'lucide-react';
import { Application } from '../../types';

interface ApplicationCardProps {
  application: Application;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  showActions?: boolean;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onView,
  onEdit,
  onDelete,
  onDownload,
  showActions = false,
}) => {
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
    <div className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {application.collegeName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {application.program}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor()}`}>
                {application.status.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Applicant</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {application.personalInfo?.firstName} {application.personalInfo?.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Created</p>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {new Date(application.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {application.completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${application.completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Submission Info */}
          {application.status === 'submitted' && application.submittedAt && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">
                <CheckCircle className="h-4 w-4 inline mr-2" />
                Submitted on {new Date(application.submittedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onView}
          className="btn btn-secondary flex items-center space-x-2 text-sm"
        >
          <Eye className="h-4 w-4" />
          <span>View</span>
        </button>

        {showActions && (
          <>
            {onEdit && application.status === 'draft' && (
              <button
                onClick={onEdit}
                className="btn btn-secondary flex items-center space-x-2 text-sm"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
            )}

            {onDownload && (
              <button
                onClick={onDownload}
                className="btn btn-secondary flex items-center space-x-2 text-sm"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            )}

            {onDelete && application.status === 'draft' && (
              <button
                onClick={onDelete}
                className="btn text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 flex items-center space-x-2 text-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};