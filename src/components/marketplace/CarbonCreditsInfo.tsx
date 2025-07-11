'use client';

import React from 'react';

export function CarbonCreditsInfo() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-8">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            How Carbon Credits Work on Sui
          </h3>
          
          <div className="space-y-4 text-sm text-green-800">
            <div>
              <h4 className="font-medium mb-2">🎯 What are Carbon Credits?</h4>
              <p className="text-green-700">
                Carbon credits represent 1 ton of CO2 sequestered or avoided. Each credit is a tokenized asset 
                that can be traded on the blockchain, enabling transparent and efficient carbon markets.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">🔗 Smart Contract Integration</h4>
              <p className="text-green-700">
                This marketplace uses Move smart contracts on Sui blockchain. Carbon credits are stored as 
                <code className="bg-green-100 px-1 rounded">Coin&lt;CARBON_CREDIT&gt;</code> objects that can be listed and traded.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">📋 To List Carbon Credits:</h4>
              <ol className="list-decimal list-inside space-y-1 text-green-700 ml-4">
                <li>Connect your Sui wallet</li>
                <li>Have verified carbon credit tokens (Coin&lt;CARBON_CREDIT&gt;)</li>
                <li>Provide the project registry object ID</li>
                <li>Set your price per credit in MIST</li>
                <li>Submit the listing transaction</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">💰 To Buy Carbon Credits:</h4>
              <ol className="list-decimal list-inside space-y-1 text-green-700 ml-4">
                <li>Connect your Sui wallet</li>
                <li>Browse available carbon credit listings</li>
                <li>Click "Buy Now" on desired credits</li>
                <li>Approve the transaction in your wallet</li>
                <li>Receive the carbon credit tokens</li>
              </ol>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-xs">
                <strong>Note:</strong> Mock listings shown cannot be purchased. You must list real carbon credit tokens 
                first. The marketplace uses real Sui blockchain transactions with gas fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 