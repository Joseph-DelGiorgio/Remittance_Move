import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface RemittanceEvent {
  sender: string;
  recipient: string;
  amount: string;
  timestamp: string;
}

interface TransactionHistoryProps {
  events: RemittanceEvent[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ events }) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getTransactionIcon = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (numAmount > 1) {
      return (
        <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-4 h-4 text-success-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-4 h-4 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
      );
    }
  };

  if (events.length === 0) {
    return (
      <Card className="fade-in">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-warning rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
              <p className="text-sm text-gray-600">Your recent transfers</p>
            </div>
          </div>
        </CardHeader>
        
        <CardBody>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Transactions Yet
            </h3>
            <p className="text-gray-600">
              Your transaction history will appear here once you make your first transfer
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-warning rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
              <p className="text-sm text-gray-600">
                {events.length} recent transfer{events.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Badge variant="primary">{events.length}</Badge>
        </div>
      </CardHeader>
      
      <CardBody>
        <div className="space-y-3">
          {events.map((event, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start space-x-3">
                {getTransactionIcon(event.amount)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {event.amount} SUI
                      </span>
                      <Badge variant="success" size="sm">
                        Sent
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">From:</span>
                      <span className="font-mono text-gray-700">
                        {formatAddress(event.sender)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">To:</span>
                      <span className="font-mono text-gray-700">
                        {formatAddress(event.recipient)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {events.length > 5 && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Showing {events.length} most recent transactions
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}; 