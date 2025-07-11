import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface RemittanceFormProps {
  onSubmit: (recipient: string, amount: string) => Promise<void>;
  isLoading: boolean;
  balance: string;
}

export const RemittanceForm: React.FC<RemittanceFormProps> = ({
  onSubmit,
  isLoading,
  balance,
}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>({});

  const validateForm = () => {
    const newErrors: { recipient?: string; amount?: string } = {};

    if (!recipient.trim()) {
      newErrors.recipient = 'Recipient address is required';
    } else if (!recipient.startsWith('0x') || recipient.length < 10) {
      newErrors.recipient = 'Please enter a valid Sui address';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        newErrors.amount = 'Please enter a valid amount';
      } else {
        const userBalance = parseFloat(balance);
        if (numAmount > userBalance) {
          newErrors.amount = `Insufficient balance. You have ${balance} SUI`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await onSubmit(recipient, amount);
    }
  };

  const formatBalance = (balance: string) => {
    return parseFloat(balance).toFixed(4);
  };

  return (
    <Card className="fade-in">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-success rounded-xl flex items-center justify-center">
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Send Remittance</h2>
            <p className="text-sm text-gray-600">Transfer SUI to any address</p>
          </div>
        </div>
      </CardHeader>
      
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Available Balance</p>
                  <p className="text-lg font-bold text-success-600">
                    {formatBalance(balance)} SUI
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Zero Fees</p>
                <p className="text-sm font-medium text-success-600">Free Transfer</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Recipient Address"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              error={errors.recipient}
              leftIcon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />

            <Input
              label="Amount (SUI)"
              type="number"
              placeholder="0.1"
              step="0.000000001"
              min="0"
              max={formatBalance(balance)}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={errors.amount}
              leftIcon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              }
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              variant="success"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={!recipient || !amount}
            >
              {isLoading ? 'Processing...' : 'Send Remittance'}
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Transaction will be processed on the Sui blockchain
              </p>
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}; 