'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface CarbonCreditMintingData {
  project_name: string;
  project_description: string;
  project_location: string;
  verification_standard: string;
  project_type: string;
  credits_amount: number;
  price_per_credit: number;
}

interface ListItemFormProps {
  onSubmit: (data: CarbonCreditMintingData) => Promise<void>;
  isLoading?: boolean;
}

type FormStep = 'intro' | 'project' | 'verification' | 'minting' | 'pricing' | 'review';

export function ListItemForm({ onSubmit, isLoading = false }: ListItemFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('intro');
  const [formData, setFormData] = useState<CarbonCreditMintingData>({
    project_name: '',
    project_description: '',
    project_location: '',
    verification_standard: '',
    project_type: '',
    credits_amount: 0,
    price_per_credit: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project_name || !formData.project_description || formData.credits_amount <= 0 || formData.price_per_credit <= 0) {
      alert('Please fill in all required fields with valid values');
      return;
    }
    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof CarbonCreditMintingData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    const steps: FormStep[] = ['intro', 'project', 'verification', 'minting', 'pricing', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: FormStep[] = ['intro', 'project', 'verification', 'minting', 'pricing', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const renderIntroStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Create & List Carbon Credits</h3>
        <p className="text-gray-600">Mint new carbon credits and list them for sale on the marketplace</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">What You'll Need:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Project details and verification information</li>
          <li>• Number of carbon credits to purchase</li>
          <li>• SUI for purchasing credits (0.1 SUI per credit)</li>
          <li>• SUI for gas fees</li>
        </ul>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">How It Works:</h4>
        <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
          <li>Define your carbon credit project</li>
          <li>Provide verification details</li>
          <li>Specify amount to purchase</li>
          <li>Purchase carbon credits from treasury</li>
          <li>Receive carbon credit tokens in your wallet</li>
          <li>List credits for sale on the marketplace</li>
        </ol>
      </div>

      <Button
        onClick={nextStep}
        variant="success"
        size="lg"
        fullWidth
      >
        Get Started
      </Button>
    </div>
  );

  const renderProjectStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 1: Project Information</h3>
        <p className="text-sm text-gray-600 mb-4">
          Define your carbon credit project details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Project Name"
          placeholder="e.g., Amazon Rainforest Conservation"
          value={formData.project_name}
          onChange={(e) => handleInputChange('project_name', e.target.value)}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />

        <Input
          label="Project Location"
          placeholder="e.g., Brazil, Amazon Basin"
          value={formData.project_location}
          onChange={(e) => handleInputChange('project_location', e.target.value)}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
          rows={3}
          placeholder="Describe your carbon credit project, environmental impact, and verification process..."
          value={formData.project_description}
          onChange={(e) => handleInputChange('project_description', e.target.value)}
        />
      </div>

      <div className="flex justify-between">
        <Button onClick={prevStep} variant="secondary" size="sm">
          Back
        </Button>
        <Button 
          onClick={nextStep} 
          variant="success" 
          size="sm"
          disabled={!formData.project_name || !formData.project_location || !formData.project_description}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderVerificationStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 2: Verification & Standards</h3>
        <p className="text-sm text-gray-600 mb-4">
          Specify your project's verification standards and type.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Verification Standard</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
            value={formData.verification_standard}
            onChange={(e) => handleInputChange('verification_standard', e.target.value)}
          >
            <option value="">Select verification standard</option>
            <option value="Gold Standard">Gold Standard</option>
            <option value="Verified Carbon Standard (VCS)">Verified Carbon Standard (VCS)</option>
            <option value="American Carbon Registry">American Carbon Registry</option>
            <option value="Climate Action Reserve">Climate Action Reserve</option>
            <option value="Plan Vivo">Plan Vivo</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
            value={formData.project_type}
            onChange={(e) => handleInputChange('project_type', e.target.value)}
          >
            <option value="">Select project type</option>
            <option value="Forest Conservation">Forest Conservation</option>
            <option value="Renewable Energy">Renewable Energy</option>
            <option value="Ocean Conservation">Ocean Conservation</option>
            <option value="Waste Management">Waste Management</option>
            <option value="Sustainable Agriculture">Sustainable Agriculture</option>
            <option value="Clean Technology">Clean Technology</option>
            <option value="Carbon Capture">Carbon Capture</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">💡 Verification Standards</h4>
        <p className="text-sm text-yellow-800">
          Choose the verification standard that applies to your project. This helps buyers understand the quality and credibility of your carbon credits.
        </p>
      </div>

      <div className="flex justify-between">
        <Button onClick={prevStep} variant="secondary" size="sm">
          Back
        </Button>
        <Button 
          onClick={nextStep} 
          variant="success" 
          size="sm"
          disabled={!formData.verification_standard || !formData.project_type}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderMintingStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 3: Purchase Carbon Credits</h3>
        <p className="text-sm text-gray-600 mb-4">
          Specify how many carbon credits you want to purchase from the treasury.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-blue-900 mb-2">💰 Purchase Costs</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 0.1 SUI per carbon credit</li>
          <li>• Gas fees: ~0.001-0.01 SUI for transaction</li>
          <li>• Each credit represents 1 ton of CO2 sequestered/avoided</li>
          <li>• Credits are immediately available in your wallet</li>
        </ul>
      </div>

      <Input
        label="Number of Carbon Credits to Purchase"
        type="number"
        placeholder="10"
        value={formData.credits_amount}
        onChange={(e) => handleInputChange('credits_amount', parseInt(e.target.value) || 0)}
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        }
      />

      {formData.credits_amount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            <strong>Purchase Preview:</strong> {formData.credits_amount.toLocaleString()} carbon credits 
            (representing {formData.credits_amount.toLocaleString()} tons of CO2) for {(formData.credits_amount * 0.1).toFixed(2)} SUI
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Button onClick={prevStep} variant="secondary" size="sm">
          Back
        </Button>
        <Button 
          onClick={nextStep} 
          variant="success" 
          size="sm"
          disabled={formData.credits_amount <= 0}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderPricingStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 4: Set Your Price</h3>
        <p className="text-sm text-gray-600 mb-4">
          Set the price per carbon credit in MIST (Sui's smallest unit).
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-yellow-900 mb-2">💰 Price Guidelines:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• 1 SUI = 1,000,000,000 MIST</li>
          <li>• Typical range: 500,000,000 - 2,000,000,000 MIST per credit</li>
          <li>• Consider market demand and project quality</li>
          <li>• You can always adjust later by relisting</li>
        </ul>
      </div>

      <Input
        label="Price per Credit (in MIST)"
        type="number"
        placeholder="1000000000"
        value={formData.price_per_credit}
        onChange={(e) => handleInputChange('price_per_credit', parseFloat(e.target.value) || 0)}
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        }
      />

      {formData.price_per_credit > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            <strong>Price Preview:</strong> {formData.price_per_credit.toLocaleString()} MIST per credit 
            (≈ {(formData.price_per_credit / 1000000000).toFixed(2)} SUI)
          </p>
          {formData.credits_amount > 0 && (
            <p className="text-sm text-green-800 mt-1">
              <strong>Total Value:</strong> {(formData.price_per_credit * formData.credits_amount / 1000000000).toFixed(2)} SUI
            </p>
          )}
        </div>
      )}

      <div className="flex justify-between">
        <Button onClick={prevStep} variant="secondary" size="sm">
          Back
        </Button>
        <Button 
          onClick={nextStep} 
          variant="success" 
          size="sm"
          disabled={formData.price_per_credit <= 0}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 5: Review & Purchase</h3>
        <p className="text-sm text-gray-600 mb-4">
          Review your carbon credit project details before purchasing from the treasury.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-700">Project Name:</span>
          <p className="text-sm text-gray-900">{formData.project_name}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700">Location:</span>
          <p className="text-sm text-gray-900">{formData.project_location}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700">Description:</span>
          <p className="text-sm text-gray-900">{formData.project_description}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700">Verification Standard:</span>
          <p className="text-sm text-gray-900">{formData.verification_standard}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700">Project Type:</span>
          <p className="text-sm text-gray-900">{formData.project_type}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700">Credits to Purchase:</span>
          <p className="text-sm text-gray-900">{formData.credits_amount.toLocaleString()} credits ({(formData.credits_amount * 0.1).toFixed(2)} SUI)</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700">Price per Credit:</span>
          <p className="text-sm text-gray-900">
            {formData.price_per_credit.toLocaleString()} MIST (≈ {(formData.price_per_credit / 1000000000).toFixed(2)} SUI)
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Purchase Transaction:</strong> This will purchase {formData.credits_amount} carbon credits from the treasury 
          at 0.1 SUI per credit (total: {(formData.credits_amount * 0.1).toFixed(2)} SUI). You'll need to approve it in your wallet and pay gas fees (typically 0.001-0.01 SUI).
        </p>
      </div>

      <div className="flex justify-between">
        <Button onClick={prevStep} variant="secondary" size="sm">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          variant="success"
          size="lg"
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Purchasing Credits...' : 'Purchase Carbon Credits'}
        </Button>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'intro':
        return renderIntroStep();
      case 'project':
        return renderProjectStep();
      case 'verification':
        return renderVerificationStep();
      case 'minting':
        return renderMintingStep();
      case 'pricing':
        return renderPricingStep();
      case 'review':
        return renderReviewStep();
      default:
        return renderIntroStep();
    }
  };

  const getStepProgress = () => {
    const steps = ['intro', 'project', 'verification', 'minting', 'pricing', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <Card className="fade-in">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-success rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Mint & List Carbon Credits</h2>
            <p className="text-sm text-gray-600">Create new carbon credits and list them for sale</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        {currentStep !== 'intro' && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Step {['intro', 'project', 'verification', 'minting', 'pricing', 'review'].indexOf(currentStep)} of 5</span>
              <span>{Math.round(getStepProgress())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${getStepProgress()}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardBody>
        <form onSubmit={handleSubmit}>
          {renderStepContent()}
        </form>
      </CardBody>
    </Card>
  );
} 