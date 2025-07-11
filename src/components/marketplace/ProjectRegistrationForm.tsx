import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProjectRegistrationData } from '@/services/marketplaceService';

interface ProjectRegistrationFormProps {
  onSubmit: (projectData: ProjectRegistrationData) => void;
  isLoading?: boolean;
}

export const ProjectRegistrationForm: React.FC<ProjectRegistrationFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ProjectRegistrationData>({
    project_id: '', // This will be auto-generated
    name: '',
    description: '',
    location: '',
    verification_standard: 'Gold Standard',
    project_type: 'Forest Conservation',
    expiry_date: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year from now
  });

  const verificationStandards = [
    'Gold Standard',
    'Verified Carbon Standard (VCS)',
    'American Carbon Registry',
    'Climate Action Reserve',
    'Plan Vivo',
    'CDM (Clean Development Mechanism)',
  ];

  const projectTypes = [
    'Forest Conservation',
    'Renewable Energy',
    'Ocean Conservation',
    'Waste Management',
    'Sustainable Agriculture',
    'Clean Technology',
    'Carbon Capture',
    'Energy Efficiency',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate a unique project ID based on timestamp and name
    const uniqueId = `project_${Date.now()}_${formData.name.replace(/\s+/g, '_').toLowerCase()}`;
    const projectDataWithId = { ...formData, project_id: uniqueId };
    onSubmit(projectDataWithId);
  };

  const handleInputChange = (field: keyof ProjectRegistrationData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="fade-in">
      <CardHeader>
        <h3 className="text-xl font-semibold text-green-900">Register Carbon Credit Project</h3>
        <p className="text-green-700">
          Register your project in the carbon credit registry to enable listing and trading.
        </p>
      </CardHeader>
      
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project ID Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-800 font-medium">Project ID Information</span>
            </div>
            <div className="text-green-700 text-sm">
              <p><strong>Project ID will be automatically generated</strong> when you register your project.</p>
              <p className="mt-1">The Project ID is the unique object ID of your registered project on the Sui blockchain.</p>
            </div>
          </div>

          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Amazon Rainforest Conservation Project"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed description of your carbon credit project..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Project Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Brazil, Amazon Basin"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Verification Standard */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Standard
            </label>
            <select
              value={formData.verification_standard}
              onChange={(e) => handleInputChange('verification_standard', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              {verificationStandards.map((standard) => (
                <option key={standard} value={standard}>
                  {standard}
                </option>
              ))}
            </select>
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Type
            </label>
            <select
              value={formData.project_type}
              onChange={(e) => handleInputChange('project_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Expiry Date
            </label>
            <input
              type="datetime-local"
              value={new Date(formData.expiry_date * 1000).toISOString().slice(0, 16)}
              onChange={(e) => handleInputChange('expiry_date', Math.floor(new Date(e.target.value).getTime() / 1000))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-800 font-medium">Project Registration Guide</span>
            </div>
            <div className="text-blue-700 text-sm space-y-1">
              <p><strong>Step 1:</strong> Register your project in the registry (this form)</p>
              <p><strong>Step 2:</strong> Purchase carbon credits from the treasury</p>
              <p><strong>Step 3:</strong> List your credits for sale on the marketplace</p>
              <p className="mt-2 text-xs">
                Note: Only registered projects can list carbon credits for sale. This ensures all credits come from verified, legitimate projects.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {isLoading ? 'Registering Project...' : 'Register Project'}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}; 