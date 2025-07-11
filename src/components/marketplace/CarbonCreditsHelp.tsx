'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

export const CarbonCreditsHelp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'projects' | 'pricing'>('tokens');

  return (
    <Card className="fade-in">
      <CardHeader>
        <h3 className="text-xl font-semibold text-green-900">How Carbon Credits Work</h3>
        <p className="text-green-700">
          Learn about carbon credits and how to participate in the marketplace
        </p>
      </CardHeader>
      
      <CardBody className="space-y-6">
        {/* What are Carbon Credits */}
        <div>
          <h4 className="text-lg font-semibold text-green-800 mb-3">What are Carbon Credits?</h4>
          <div className="text-gray-700 space-y-2">
            <p>
              Carbon credits represent 1 ton of CO2 that has been reduced, avoided, or removed from the atmosphere. 
              Each credit is a verified environmental asset that can be traded on the marketplace.
            </p>
            <p>
              Projects that generate carbon credits include forest conservation, renewable energy, ocean cleanup, 
              and other climate-positive initiatives.
            </p>
          </div>
        </div>

        {/* How to Get Started */}
        <div>
          <h4 className="text-lg font-semibold text-green-800 mb-3">How to Get Started</h4>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-semibold text-blue-800 mb-2">Step 1: Register Your Project</h5>
              <div className="text-blue-700 text-sm space-y-1">
                <p>• Click "Register New Project" to create your project in the registry</p>
                <p>• Fill out project details (name, description, location, verification standard)</p>
                <p>• Submit the registration - this creates a project object on the Sui blockchain</p>
                <p>• <strong>Save your Project ID</strong> - this is the unique object ID of your registered project</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-semibold text-green-800 mb-2">Step 2: Purchase Carbon Credits</h5>
              <div className="text-green-700 text-sm space-y-1">
                <p>• Use "Mint & List Carbon Credits" to purchase credits from the treasury</p>
                <p>• Enter your Project ID (from Step 1)</p>
                <p>• Set the amount of credits to mint and price per credit</p>
                <p>• Pay SUI to the treasury (0.1 SUI per credit)</p>
                <p>• Credits are automatically listed for sale on the marketplace</p>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h5 className="font-semibold text-purple-800 mb-2">Step 3: Trade Carbon Credits</h5>
              <div className="text-purple-700 text-sm space-y-1">
                <p>• Browse carbon credit listings by project type</p>
                <p>• Click "Buy Now" to purchase credits from other sellers</p>
                <p>• Credits are transferred to your wallet as Coin&lt;CARBON_CREDIT&gt;</p>
                <p>• You can hold, trade, or retire your carbon credits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Project ID Information */}
        <div>
          <h4 className="text-lg font-semibold text-green-800 mb-3">Understanding Project IDs</h4>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                         <div className="text-yellow-800 text-sm space-y-2">
               <p><strong>What is a Project ID?</strong></p>
               <p>• The Project ID is your wallet address that registered the project</p>
               <p>• It's automatically set to your connected wallet address when you register</p>
               <p>• Format: <code className="bg-yellow-100 px-1 rounded">0x...</code> (Sui wallet address)</p>
               <p>• Example: <code className="bg-yellow-100 px-1 rounded">0x1234567890abcdef1234567890abcdef12345678</code></p>
               
               <p className="mt-3"><strong>Why do you need a Project ID?</strong></p>
               <p>• Only registered projects can mint and list carbon credits</p>
               <p>• The Project ID links your carbon credits to your verified project</p>
               <p>• It ensures all credits come from legitimate, verified environmental projects</p>
               
               <p className="mt-3"><strong>How to find your Project ID:</strong></p>
               <p>• Your Project ID is your wallet address - you can see it in your wallet</p>
               <p>• After registering a project, the Project ID is shown in the success message</p>
               <p>• You can also find it in your transaction history on the Sui blockchain</p>
             </div>
          </div>
        </div>

        {/* Verification Standards */}
        <div>
          <h4 className="text-lg font-semibold text-green-800 mb-3">Verification Standards</h4>
          <div className="text-gray-700 space-y-2">
            <p>
              Carbon credits must meet recognized verification standards to ensure their environmental integrity:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Gold Standard:</strong> Premium standard for climate and development projects</li>
              <li><strong>Verified Carbon Standard (VCS):</strong> Most widely used carbon credit standard</li>
              <li><strong>American Carbon Registry:</strong> Rigorous standard for North American projects</li>
              <li><strong>Climate Action Reserve:</strong> High-quality standard for voluntary carbon markets</li>
              <li><strong>Plan Vivo:</strong> Community-based projects with social benefits</li>
              <li><strong>CDM:</strong> UN Clean Development Mechanism for international projects</li>
            </ul>
          </div>
        </div>

        {/* Project Types */}
        <div>
          <h4 className="text-lg font-semibold text-green-800 mb-3">Project Types</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-semibold text-green-700">Nature-Based Solutions</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Forest Conservation</li>
                <li>• Ocean Conservation</li>
                <li>• Sustainable Agriculture</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-semibold text-green-700">Technology Solutions</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Renewable Energy</li>
                <li>• Clean Technology</li>
                <li>• Carbon Capture</li>
                <li>• Energy Efficiency</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h4 className="text-lg font-semibold text-green-800 mb-3">Benefits of Carbon Credits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-semibold text-green-700">Environmental Impact</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Reduce greenhouse gas emissions</li>
                <li>• Protect and restore ecosystems</li>
                <li>• Support renewable energy development</li>
                <li>• Fund climate-positive projects</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-semibold text-green-700">Economic Benefits</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Trade verified environmental assets</li>
                <li>• Support sustainable development</li>
                <li>• Create new revenue streams</li>
                <li>• Build climate-positive portfolios</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-800 mb-3">💡 Pro Tips</h4>
          <div className="text-green-700 text-sm space-y-2">
            <p><strong>For Project Developers:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Register your project first before minting credits</li>
              <li>Choose appropriate verification standards for your project type</li>
              <li>Set competitive prices to attract buyers</li>
              <li>Provide detailed project descriptions</li>
            </ul>
            
            <p className="mt-3"><strong>For Carbon Credit Buyers:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Research project types and verification standards</li>
              <li>Consider the environmental impact of different projects</li>
              <li>Diversify your carbon credit portfolio</li>
              <li>Verify project legitimacy through the registry</li>
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}; 