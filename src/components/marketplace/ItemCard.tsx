import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number; // in MIST
  seller: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  isForSale: boolean;
}

interface ItemCardProps {
  item: MarketplaceItem;
  onBuy: (itemId: string, price: number) => void;
  onRemove?: (itemId: string) => void;
  currentUser?: string;
  isLoading?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onBuy,
  onRemove,
  currentUser,
  isLoading = false,
}) => {
  const priceInSui = item.price / 1000000000; // Convert MIST to SUI
  const isOwner = currentUser === item.seller;

  return (
    <Card className="fade-in hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{item.category}</span>
            <span className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardBody>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-success-600">
                {priceInSui.toFixed(4)} SUI
              </div>
              <div className="text-xs text-gray-500">
                Seller: {item.seller.slice(0, 6)}...{item.seller.slice(-4)}
              </div>
            </div>
            
            {item.isForSale ? (
              <div className="flex items-center space-x-2">
                {isOwner && onRemove && (
                  <Button
                    variant="error"
                    size="sm"
                    onClick={() => onRemove(item.id)}
                    disabled={isLoading}
                  >
                    Remove
                  </Button>
                )}
                
                {!isOwner && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => onBuy(item.id, item.price)}
                    disabled={isLoading}
                    loading={isLoading}
                  >
                    Buy Now
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Sold
              </div>
            )}
          </div>
          
          {isOwner && (
            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              Your item
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}; 