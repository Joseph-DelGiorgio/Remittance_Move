'use client';

import React, { useState } from 'react';

export function CarbonCreditsHelp() {
  const [activeTab, setActiveTab] = useState<'tokens' | 'projects' | 'pricing'>('tokens');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">How to List Carbon Credits</h3>
          <p className="text-sm text-gray-600">Step-by-step guide to finding your tokens and project information</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('tokens')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'tokens'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Finding Tokens
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'projects'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Project Information
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pricing'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pricing Guide
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'tokens' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">🔍 Creating Carbon Credit Tokens</h4>
            <p className="text-sm text-blue-800 mb-3">
              Carbon credits are minted directly on the Sui blockchain when you create a project listing.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-800">1</span>
                </div>
                <div>
                  <h5 className="font-medium text-blue-900">Define Your Project</h5>
                  <p className="text-sm text-blue-800">Provide project details, location, and verification standards</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-800">2</span>
                </div>
                <div>
                  <h5 className="font-medium text-blue-900">Specify Credit Amount</h5>
                  <p className="text-sm text-blue-800">Choose how many carbon credits to mint (each represents 1 ton of CO2)</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-800">3</span>
                </div>
                <div>
                  <h5 className="font-medium text-blue-900">Set Your Price</h5>
                  <p className="text-sm text-blue-800">Determine the price per credit in MIST (Sui's smallest unit)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">💡 Minting Process</h4>
            <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
              <li>Fill out the project information form</li>
              <li>Choose verification standards and project type</li>
              <li>Specify the number of credits to mint</li>
              <li>Set your listing price</li>
              <li>Submit the transaction to mint and list simultaneously</li>
            </ol>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">🏗️ Creating Carbon Credit Projects</h4>
            <p className="text-sm text-yellow-800 mb-3">
              Carbon credit projects are created directly on the marketplace when you mint new credits. Each project represents a verified environmental initiative.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-yellow-800">1</span>
                </div>
                <div>
                  <h5 className="font-medium text-yellow-900">Project Information</h5>
                  <p className="text-sm text-yellow-800">Provide project name, description, and location details</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-yellow-800">2</span>
                </div>
                <div>
                  <h5 className="font-medium text-yellow-900">Verification Standards</h5>
                  <p className="text-sm text-yellow-800">Choose appropriate verification standards (Gold Standard, VCS, etc.)</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-yellow-800">3</span>
                </div>
                <div>
                  <h5 className="font-medium text-yellow-900">Project Type</h5>
                  <p className="text-sm text-yellow-800">Select the type of environmental project (forest conservation, renewable energy, etc.)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">🔍 Project Requirements</h4>
            <p className="text-sm text-blue-800 mb-2">To create a carbon credit project, you need:</p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Valid environmental project with measurable impact</li>
              <li>Appropriate verification standards</li>
              <li>Clear project documentation</li>
              <li>SUI for gas fees and minting costs</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">💰 Setting the Right Price</h4>
            <p className="text-sm text-green-800 mb-3">
              Carbon credit prices vary based on project quality, verification standards, and market demand.
            </p>
            
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-green-900 mb-1">Price Conversion</h5>
                <p className="text-sm text-green-800">1 SUI = 1,000,000,000 MIST</p>
                <p className="text-sm text-green-800">Example: 1.5 SUI = 1,500,000,000 MIST</p>
              </div>
              
              <div>
                <h5 className="font-medium text-green-900 mb-1">Typical Price Ranges</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Basic projects: 500,000,000 - 1,000,000,000 MIST (0.5-1 SUI)</li>
                  <li>• Verified projects: 1,000,000,000 - 1,500,000,000 MIST (1-1.5 SUI)</li>
                  <li>• Premium projects: 1,500,000,000 - 2,000,000,000 MIST (1.5-2 SUI)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">💡 Pricing Factors</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• <strong>Verification Standard:</strong> Gold Standard, VCS, etc.</li>
              <li>• <strong>Project Type:</strong> Forest conservation, renewable energy, etc.</li>
              <li>• <strong>Location:</strong> Geographic region and local regulations</li>
              <li>• <strong>Market Demand:</strong> Current buyer interest</li>
              <li>• <strong>Project Age:</strong> Newer projects may command higher prices</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">📊 Market Research</h4>
            <p className="text-sm text-blue-800 mb-2">Before setting your price:</p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Browse existing listings to see current market prices</li>
              <li>Check the verification standards of similar projects</li>
              <li>Consider your project's unique benefits</li>
              <li>Start with a competitive price and adjust if needed</li>
            </ul>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <a
            href="https://suiexplorer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Open Sui Explorer
          </a>
          <button
            onClick={() => window.open('https://sui.io/ecosystem', '_blank')}
            className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Learn About Sui
          </button>
        </div>
      </div>
    </div>
  );
} 