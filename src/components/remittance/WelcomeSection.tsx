import React from 'react';
import { Card, CardBody } from '@/components/ui/Card';

export const WelcomeSection: React.FC = () => {
  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6 text-success-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      title: 'Zero Fees',
      description: 'No platform charges',
      color: 'success',
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: 'Instant',
      description: 'Real-time transfers',
      color: 'primary',
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-warning-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: 'Secure',
      description: 'Blockchain security',
      color: 'warning',
    },
  ];

  return (
    <Card className="fade-in">
      <CardBody className="text-center py-12 sm:py-16">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Welcome to Sui Remittance
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
          Connect your Sui wallet to start sending zero-fee remittances to anyone, anywhere in the world.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                {feature.icon}
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">{feature.title}</p>
              <p className="text-xs text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-primary-50 to-success-50 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Why Choose Sui Remittance?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span>No hidden fees or charges</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span>Instant global transfers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span>Secure blockchain technology</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span>24/7 availability</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}; 