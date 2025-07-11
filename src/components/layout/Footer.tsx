import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16 safe-area-bottom">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
            <span>Built on Sui Blockchain</span>
            <span className="hidden sm:inline">•</span>
            <span>Zero Platform Fees</span>
            <span className="hidden sm:inline">•</span>
            <span>Secure Transfers</span>
          </div>
          
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
            <a href="#" className="hover:text-primary-600 transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-primary-600 transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-primary-600 transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}; 