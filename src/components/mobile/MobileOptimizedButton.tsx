import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileOptimizedButtonProps extends ButtonProps {
  mobileText?: string;
  desktopText?: string;
  fullWidthOnMobile?: boolean;
}

export const MobileOptimizedButton: React.FC<MobileOptimizedButtonProps> = ({
  children,
  mobileText,
  desktopText,
  fullWidthOnMobile = false,
  className,
  ...props
}) => {
  return (
    <Button
      className={cn(
        "touch-target mobile-button",
        fullWidthOnMobile && "w-full sm:w-auto",
        "min-h-[48px] px-4 py-3 text-sm sm:text-base font-medium",
        "transition-all duration-200 hover:scale-105 active:scale-95",
        className
      )}
      {...props}
    >
      {mobileText && desktopText ? (
        <>
          <span className="sm:hidden">{mobileText}</span>
          <span className="hidden sm:inline">{desktopText}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
};