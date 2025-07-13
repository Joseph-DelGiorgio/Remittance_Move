import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

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

  if (events.length === 0) {
    return (
      <Card className="fade-in">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">History</h2>
        </CardHeader>
        
        <CardBody>
          <div className="text-center py-8">
            <p className="text-gray-600">No transactions yet</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="fade-in">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">History</h2>
      </CardHeader>
      
      <CardBody>
        <div className="space-y-3">
          {events.map((event, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {event.amount} SUI
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatAddress(event.sender)} → {formatAddress(event.recipient)}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(event.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}; 