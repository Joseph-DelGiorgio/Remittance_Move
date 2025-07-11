import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface QuickCarbonCreditData {
  project_name: string;
  project_description: string;
  project_location: string;
  verification_standard: string;
  project_type: string;
  credits_amount: number;
  price_per_credit: number;
}

interface QuickCarbonCreditFormProps {
  onSubmit: (data: QuickCarbonCreditData) => void;
  isLoading?: boolean;
}

export const QuickCarbonCreditForm: React.FC<QuickCarbonCreditFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const account = useCurrentAccount();
  
  const [formData, setFormData] = useState<QuickCarbonCreditData>({
    project_name: '',
    project_description: '',
    project_location: '',
    verification_standard: 'Gold Standard',
    project_type: 'Forest Conservation',
    credits_amount: 100,
    price_per_credit: 1000000000, // 1 SUI in MIST
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
    
    if (!account?.address) {
      alert('Please connect your wallet first');
      return;
    }
    
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof QuickCarbonCreditData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const presetProjects = [
    {
      name: 'Amazon Rainforest Protection',
      description: 'Protecting 50 hectares of Amazon rainforest from deforestation',
      location: 'Brazil, Amazon Basin',
      type: 'Forest Conservation',
      standard: 'Gold Standard',
      credits: 500,
      price: 1500000000, // 1.5 SUI
    },
    {
      name: 'Solar Farm Development',
      description: '50MW solar farm reducing fossil fuel dependency',
      location: 'California, USA',
      type: 'Renewable Energy',
      standard: 'Verified Carbon Standard (VCS)',
      credits: 1000,
      price: 1200000000, // 1.2 SUI
    },
    {
      name: 'Ocean Cleanup Initiative',
      description: 'Marine ecosystem restoration and plastic cleanup',
      location: 'Pacific Ocean',
      type: 'Ocean Conservation',
      standard: 'American Carbon Registry',
      credits: 200,
      price: 2000000000, // 2 SUI
    },
  ];

  const usePreset = (preset: typeof presetProjects[0]) => {
    setFormData({
      project_name: preset.name,
      project_description: preset.description,
      project_location: preset.location,
      verification_standard: preset.standard,
      project_type: preset.type,
      credits_amount: preset.credits,
      price_per_credit: preset.price,
    });
  };

  return (
    <Card className="fade-in">
      <CardHeader>
        <h3 className="text-xl font-semibold text-green-900">🚀 Quick Carbon Credit Creation</h3>
        <p className="text-green-700">
          Create and list carbon credits instantly - no complex registration needed!
        </p>
      </CardHeader>
      
      <CardBody>
        {/* Quick Presets */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-green-800 mb-3">Quick Start Templates</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {presetProjects.map((preset, index) => (
              <button
                key={index}
                onClick={() => usePreset(preset)}
                className="p-4 border border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-left"
              >
                <h5 className="font-semibold text-green-800 mb-1">{preset.name}</h5>
                <p className="text-sm text-green-700 mb-2">{preset.description}</p>
                <div className="text-xs text-green-600">
                  <p>📍 {preset.location}</p>
                  <p>🌱 {preset.type}</p>
                  <p>✅ {preset.standard}</p>
                  <p>💰 {preset.credits} credits @ {(preset.price / 1000000000).toFixed(1)} SUI</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={formData.project_name}
              onChange={(e) => handleInputChange('project_name', e.target.value)}
              placeholder="My Carbon Credit Project"
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
              value={formData.project_description}
              onChange={(e) => handleInputChange('project_description', e.target.value)}
              placeholder="Describe your environmental project..."
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
              value={formData.project_location}
              onChange={(e) => handleInputChange('project_location', e.target.value)}
              placeholder="City, Country"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Two Column Layout for Credits and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Credits Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Credits
              </label>
              <input
                type="number"
                value={formData.credits_amount}
                onChange={(e) => handleInputChange('credits_amount', parseInt(e.target.value))}
                min="1"
                max="10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Each credit represents 1 ton of CO2
              </p>
            </div>

            {/* Price per Credit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Credit (SUI)
              </label>
              <input
                type="number"
                value={(formData.price_per_credit / 1000000000).toFixed(2)}
                onChange={(e) => handleInputChange('price_per_credit', Math.floor(parseFloat(e.target.value) * 1000000000))}
                min="0.1"
                max="10"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Price in SUI (1 SUI = 1,000,000,000 MIST)
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">📊 Project Summary</h4>
            <div className="text-green-700 text-sm space-y-1">
              <p><strong>Total Credits:</strong> {formData.credits_amount.toLocaleString()}</p>
              <p><strong>Price per Credit:</strong> {(formData.price_per_credit / 1000000000).toFixed(2)} SUI</p>
              <p><strong>Total Value:</strong> {((formData.credits_amount * formData.price_per_credit) / 1000000000).toFixed(2)} SUI</p>
              <p><strong>Project Type:</strong> {formData.project_type}</p>
              <p><strong>Verification:</strong> {formData.verification_standard}</p>
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-800 font-medium">How It Works</span>
            </div>
            <div className="text-blue-700 text-sm space-y-1">
              <p>✅ <strong>One Click:</strong> Create and list carbon credits instantly</p>
              <p>✅ <strong>No Registration:</strong> Skip complex project registration</p>
              <p>✅ <strong>Instant Listing:</strong> Credits are immediately available for purchase</p>
              <p>✅ <strong>Real Trading:</strong> Other users can buy your credits right away</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading || !account?.address}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? 'Creating Carbon Credits...' : '🚀 Create & List Carbon Credits'}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}; 