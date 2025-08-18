import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MobileCardProps extends React.ComponentProps<typeof Card> {
  touchOptimized?: boolean;
  compactOnMobile?: boolean;
  children: React.ReactNode;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  touchOptimized = true,
  compactOnMobile = true,
  className,
  ...props
}) => {
  return (
    <Card
      className={cn(
        "transition-all duration-200",
        touchOptimized && "hover:shadow-lg active:scale-[0.98] cursor-pointer",
        compactOnMobile && "p-3 sm:p-4 lg:p-6",
        "rounded-lg sm:rounded-xl border bg-card/70 backdrop-blur-sm",
        "shadow-sm hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};