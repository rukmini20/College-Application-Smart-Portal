import React, { useState } from 'react';
import { Eye, Download, Share2, Edit, CheckCircle, Clock, AlertCircle, FileText, User, GraduationCap } from 'lucide-react';
import { Application } from '../types';

interface ApplicationPreviewProps {
  application: Application;
  onEdit?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  isReadOnly?: boolean;
}

export const ApplicationPreview: React.FC<ApplicationPreviewProps> = ({
  application,
  onEdit,
  onDownload,
  onShare,
  isReadOnly = false,
}) => {
  const [activeSection, setActiveSection] = useState<'personal' | 'academic' | 'documents' | 'essays'>('personal');

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
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
        return <Edit className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
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

  const sections = [
    { id: 'personal', title: 'Personal Information', icon: User },
    { id: 'academic', title: 'Academic Information', icon: GraduationCap },
    { id: 'documents', title: 'Documents', icon: FileText },
    { id: 'essays', title: 'Essays', icon: Edit },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {application.collegeName} - {application.program}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(application.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(application.status)}`}>
                  {application.status.replace('-', ' ')}
                </span>
              </div>
              {application.submittedAt && (
                <span className="text-sm text-gray-500">
                  Submitted on {new Date(application.submittedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {onDownload && (
              <button
                onClick={onDownload}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            )}
            
            {onShare && (
              <button
                onClick={onShare}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            )}

            {onEdit && !isReadOnly && application.status === 'draft' && (
              <button
                onClick={onEdit}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Application Progress
            </span>
            <span className="text-sm text-gray-500">
              {application.completionPercentage}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${application.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                isActive
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{section.title}</span>
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      <div className="space-y-6">
        {activeSection === 'personal' && (
          <PersonalInfoSection personalInfo={application.personalInfo} />
        )}
        
        {activeSection === 'academic' && (
          <AcademicInfoSection academicInfo={application.academicInfo} />
        )}
        
        {activeSection === 'documents' && (
          <DocumentsSection documents={application.documents} />
        )}
        
        {activeSection === 'essays' && (
          <EssaysSection essays={application.essays} />
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            <span>Application ID: {application.id}</span>
            <span className="mx-2">•</span>
            <span>Created: {new Date(application.createdAt).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>Updated: {new Date(application.updatedAt).toLocaleDateString()}</span>
          </div>
          {application.status === 'submitted' && (
            <div className="flex items-center space-x-2 text-green-600">
              <Eye className="h-4 w-4" />
              <span>Preview Mode</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Section Components
interface PersonalInfoSectionProps {
  personalInfo: Application['personalInfo'];
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ personalInfo }) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
      Personal Information
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <InfoItem label="Full Name" value={`${personalInfo?.firstName} ${personalInfo?.lastName}`} />
      <InfoItem label="Email" value={personalInfo?.email} />
      <InfoItem label="Phone" value={personalInfo?.phone} />
      <InfoItem label="Date of Birth" value={personalInfo?.dateOfBirth} />
      <InfoItem label="Citizenship" value={personalInfo?.citizenship} />
      
      {personalInfo?.address && (
        <div className="md:col-span-2 lg:col-span-3">
          <InfoItem 
            label="Address" 
            value={`${personalInfo.address.street}, ${personalInfo.address.city}, ${personalInfo.address.state} ${personalInfo.address.zipCode}, ${personalInfo.address.country}`} 
          />
        </div>
      )}
      
      {personalInfo?.emergencyContact && (
        <div className="md:col-span-2 lg:col-span-3">
          <InfoItem 
            label="Emergency Contact" 
            value={`${personalInfo.emergencyContact.name} (${personalInfo.emergencyContact.relationship}) - ${personalInfo.emergencyContact.phone}`} 
          />
        </div>
      )}
    </div>
  </div>
);

interface AcademicInfoSectionProps {
  academicInfo: Application['academicInfo'];
}

const AcademicInfoSection: React.FC<AcademicInfoSectionProps> = ({ academicInfo }) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
      Academic Information
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoItem label="Current School" value={academicInfo?.currentSchool} />
      <InfoItem label="GPA" value={academicInfo?.gpa ? `${academicInfo.gpa}/4.0` : undefined} />
      <InfoItem label="Expected Graduation" value={academicInfo?.expectedGraduation} />
      
      {academicInfo?.coursework && academicInfo.coursework.length > 0 && (
        <div className="md:col-span-2">
          <InfoItem 
            label="Relevant Coursework" 
            value={academicInfo.coursework.join(', ')} 
          />
        </div>
      )}
      
      {academicInfo?.honors && academicInfo.honors.length > 0 && (
        <div className="md:col-span-2">
          <InfoItem 
            label="Honors & Awards" 
            value={academicInfo.honors.join(', ')} 
          />
        </div>
      )}
      
      {academicInfo?.extracurriculars && academicInfo.extracurriculars.length > 0 && (
        <div className="md:col-span-2">
          <InfoItem 
            label="Extracurricular Activities" 
            value={academicInfo.extracurriculars.join(', ')} 
          />
        </div>
      )}
    </div>
  </div>
);

interface DocumentsSectionProps {
  documents: Application['documents'];
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents }) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
      Uploaded Documents
    </h3>
    {documents && documents.length > 0 ? (
      <div className="space-y-3">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{doc.name}</p>
                <div className="text-sm text-gray-500">
                  <span>{doc.fileName}</span>
                  <span className="mx-2">•</span>
                  <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  <span className="mx-2">•</span>
                  <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
        No documents uploaded yet
      </p>
    )}
  </div>
);

interface EssaysSectionProps {
  essays: Application['essays'];
}

const EssaysSection: React.FC<EssaysSectionProps> = ({ essays }) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
      Application Essays
    </h3>
    {essays && essays.length > 0 ? (
      <div className="space-y-6">
        {essays.map((essay) => (
          <div key={essay.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Essay Prompt</h4>
              <span className="text-sm text-gray-500">
                {essay.wordCount}/{essay.maxWords} words
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 italic">
              {essay.prompt}
            </p>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                {essay.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
        No essays submitted yet
      </p>
    )}
  </div>
);

// Helper Component
interface InfoItemProps {
  label: string;
  value?: string | number;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
      {label}
    </dt>
    <dd className="text-sm text-gray-900 dark:text-gray-100">
      {value || 'Not provided'}
    </dd>
  </div>
);