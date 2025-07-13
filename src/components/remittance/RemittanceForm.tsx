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

  return (
    <Card className="fade-in">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">Send Money</h2>
      </CardHeader>
      
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Balance: <span className="font-semibold">{parseFloat(balance).toFixed(4)} SUI</span>
          </div>

          <Input
            label="To"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            error={errors.recipient}
          />

          <Input
            label="Amount"
            type="number"
            placeholder="0.1"
            step="0.000000001"
            min="0"
            max={parseFloat(balance).toFixed(4)}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
          />

          <Button
            type="submit"
            variant="success"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={!recipient || !amount}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}; 