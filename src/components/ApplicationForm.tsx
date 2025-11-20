import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Upload, FileText, User, GraduationCap, Save } from 'lucide-react';
import { Application, PersonalInfo, AcademicInfo, Document } from '../types';
import { useApplicationDraft } from '../hooks/useApplicationDraft';

interface ApplicationFormProps {
  onSubmit: (application: Application) => void;
  initialData?: Partial<Application>;
}

const STEPS = [
  { id: 'personal', title: 'Personal Information', icon: User },
  { id: 'academic', title: 'Academic Information', icon: GraduationCap },
  { id: 'documents', title: 'Documents', icon: FileText },
  { id: 'review', title: 'Review & Submit', icon: Upload },
];

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmit, initialData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Application>>(
    initialData || {
      personalInfo: {} as PersonalInfo,
      academicInfo: {} as AcademicInfo,
      documents: [],
      essays: [],
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { saveDraft, isLoading: isSaving } = useApplicationDraft();

  const updateFormData = useCallback((section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...(prev[section as keyof Application] as any), ...data }
    }));
    // Clear errors for updated fields
    const newErrors = { ...errors };
    Object.keys(data).forEach(key => {
      delete newErrors[`${section}.${key}`];
    });
    setErrors(newErrors);
  }, [errors]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Personal Information
        const personal = formData.personalInfo || {} as PersonalInfo;
        if (!personal.firstName) newErrors['personalInfo.firstName'] = 'First name is required';
        if (!personal.lastName) newErrors['personalInfo.lastName'] = 'Last name is required';
        if (!personal.email) newErrors['personalInfo.email'] = 'Email is required';
        if (!personal.phone) newErrors['personalInfo.phone'] = 'Phone is required';
        break;
      
      case 1: // Academic Information
        const academic = formData.academicInfo || {} as AcademicInfo;
        if (!academic.currentSchool) newErrors['academicInfo.currentSchool'] = 'Current school is required';
        if (!academic.gpa || academic.gpa < 0 || academic.gpa > 4.0) {
          newErrors['academicInfo.gpa'] = 'Valid GPA (0-4.0) is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSaveDraft = async () => {
    try {
      await saveDraft(formData);
      alert('Draft saved successfully!');
    } catch (error) {
      alert('Failed to save draft. Please try again.');
    }
  };

  const calculateProgress = (): number => {
    let completed = 0;
    const total = 4;

    // Personal info completion
    const personal = formData.personalInfo || {} as PersonalInfo;
    if (personal.firstName && personal.lastName && personal.email) completed += 0.25;

    // Academic info completion
    const academic = formData.academicInfo || {} as AcademicInfo;
    if (academic.currentSchool && academic.gpa) completed += 0.25;

    // Documents completion
    if (formData.documents && formData.documents.length > 0) completed += 0.25;

    // Review step (always available)
    completed += 0.25;

    return Math.round((completed / total) * 100);
  };

  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              First Name *
            </label>
            <input
              type="text"
              className={`form-input ${errors['personalInfo.firstName'] ? 'border-red-500' : ''}`}
              value={formData.personalInfo?.firstName || ''}
              onChange={(e) => updateFormData('personalInfo', { firstName: e.target.value })}
              aria-describedby={errors['personalInfo.firstName'] ? 'firstName-error' : undefined}
            />
            {errors['personalInfo.firstName'] && (
              <p id="firstName-error" className="text-red-500 text-sm mt-1">
                {errors['personalInfo.firstName']}
              </p>
            )}
          </div>
          
          <div>
            <label className="form-label">
              Last Name *
            </label>
            <input
              type="text"
              className={`form-input ${errors['personalInfo.lastName'] ? 'border-red-500' : ''}`}
              value={formData.personalInfo?.lastName || ''}
              onChange={(e) => updateFormData('personalInfo', { lastName: e.target.value })}
            />
            {errors['personalInfo.lastName'] && (
              <p className="text-red-500 text-sm mt-1">{errors['personalInfo.lastName']}</p>
            )}
          </div>

          <div>
            <label className="form-label">
              Email *
            </label>
            <input
              type="email"
              className={`form-input ${errors['personalInfo.email'] ? 'border-red-500' : ''}`}
              value={formData.personalInfo?.email || ''}
              onChange={(e) => updateFormData('personalInfo', { email: e.target.value })}
            />
            {errors['personalInfo.email'] && (
              <p className="text-red-500 text-sm mt-1">{errors['personalInfo.email']}</p>
            )}
          </div>

          <div>
            <label className="form-label">
              Phone *
            </label>
            <input
              type="tel"
              className={`form-input ${errors['personalInfo.phone'] ? 'border-red-500' : ''}`}
              value={formData.personalInfo?.phone || ''}
              onChange={(e) => updateFormData('personalInfo', { phone: e.target.value })}
            />
            {errors['personalInfo.phone'] && (
              <p className="text-red-500 text-sm mt-1">{errors['personalInfo.phone']}</p>
            )}
          </div>

          <div>
            <label className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              className="form-input"
              value={formData.personalInfo?.dateOfBirth || ''}
              onChange={(e) => updateFormData('personalInfo', { dateOfBirth: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">
              Citizenship
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.personalInfo?.citizenship || ''}
              onChange={(e) => updateFormData('personalInfo', { citizenship: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAcademicInfoStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Academic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              Current School *
            </label>
            <input
              type="text"
              className={`form-input ${errors['academicInfo.currentSchool'] ? 'border-red-500' : ''}`}
              value={formData.academicInfo?.currentSchool || ''}
              onChange={(e) => updateFormData('academicInfo', { currentSchool: e.target.value })}
            />
            {errors['academicInfo.currentSchool'] && (
              <p className="text-red-500 text-sm mt-1">{errors['academicInfo.currentSchool']}</p>
            )}
          </div>

          <div>
            <label className="form-label">
              GPA (4.0 scale) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="4.0"
              className={`form-input ${errors['academicInfo.gpa'] ? 'border-red-500' : ''}`}
              value={formData.academicInfo?.gpa || ''}
              onChange={(e) => updateFormData('academicInfo', { gpa: parseFloat(e.target.value) })}
            />
            {errors['academicInfo.gpa'] && (
              <p className="text-red-500 text-sm mt-1">{errors['academicInfo.gpa']}</p>
            )}
          </div>

          <div>
            <label className="form-label">
              Expected Graduation
            </label>
            <input
              type="date"
              className="form-input"
              value={formData.academicInfo?.expectedGraduation || ''}
              onChange={(e) => updateFormData('academicInfo', { expectedGraduation: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="form-label">
            Relevant Coursework (comma-separated)
          </label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="e.g. AP Calculus, AP Chemistry, Honors English"
            value={formData.academicInfo?.coursework?.join(', ') || ''}
            onChange={(e) => updateFormData('academicInfo', { 
              coursework: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            })}
          />
        </div>
      </div>
    </div>
  );

  const renderDocumentsStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Documents Upload
        </h3>
        <div className="space-y-4">
          <DocumentUpload
            title="Official Transcript"
            description="Upload your official high school transcript (PDF only)"
            onUpload={(file) => {
              const doc: Document = {
                id: Date.now().toString(),
                name: 'Official Transcript',
                type: 'transcript',
                fileName: file.name,
                fileSize: file.size,
                uploadedAt: new Date(),
                url: URL.createObjectURL(file),
              };
              updateFormData('documents', [...(formData.documents || []), doc]);
            }}
          />
          
          <DocumentUpload
            title="Letters of Recommendation"
            description="Upload recommendation letters (PDF only)"
            onUpload={(file) => {
              const doc: Document = {
                id: Date.now().toString(),
                name: 'Recommendation Letter',
                type: 'recommendation',
                fileName: file.name,
                fileSize: file.size,
                uploadedAt: new Date(),
                url: URL.createObjectURL(file),
              };
              updateFormData('documents', [...(formData.documents || []), doc]);
            }}
          />
        </div>

        {formData.documents && formData.documents.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Uploaded Documents</h4>
            <div className="space-y-2">
              {formData.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.fileName} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const updatedDocs = formData.documents?.filter(d => d.id !== doc.id) || [];
                      updateFormData('documents', updatedDocs);
                    }}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Remove ${doc.name}`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Review Your Application
        </h3>
        <div className="space-y-6">
          <div className="card p-6">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Name:</span> {formData.personalInfo?.firstName} {formData.personalInfo?.lastName}
              </div>
              <div>
                <span className="text-gray-500">Email:</span> {formData.personalInfo?.email}
              </div>
              <div>
                <span className="text-gray-500">Phone:</span> {formData.personalInfo?.phone}
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Academic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">School:</span> {formData.academicInfo?.currentSchool}
              </div>
              <div>
                <span className="text-gray-500">GPA:</span> {formData.academicInfo?.gpa}/4.0
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Documents</h4>
            <div className="space-y-2">
              {formData.documents?.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-2 text-sm">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>{doc.name}</span>
                </div>
              )) || <p className="text-gray-500 text-sm">No documents uploaded</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const progress = calculateProgress();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">College Application</h2>
          <span className="text-sm text-gray-500">{progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                isActive ? 'bg-primary-100 dark:bg-primary-900' : 
                isCompleted ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs text-center font-medium hidden sm:block">{step.title}</span>
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="card p-6 mb-6">
        {currentStep === 0 && renderPersonalInfoStep()}
        {currentStep === 1 && renderAcademicInfoStep()}
        {currentStep === 2 && renderDocumentsStep()}
        {currentStep === 3 && renderReviewStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="btn btn-secondary flex items-center space-x-2 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="btn btn-primary flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                const application = {
                  ...formData,
                  id: Date.now().toString(),
                  userId: 'user1',
                  status: 'submitted' as const,
                  submittedAt: new Date(),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  completionPercentage: progress,
                } as Application;
                onSubmit(application);
              }}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Submit Application</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Document Upload Component
interface DocumentUploadProps {
  title: string;
  description: string;
  onUpload: (file: File) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ title, description, onUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file only.');
        return;
      }
      onUpload(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
      <div className="text-center">
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{title}</h4>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <label className="btn btn-primary cursor-pointer">
          Choose File
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};