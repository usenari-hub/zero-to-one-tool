import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface MobileInputProps extends React.ComponentProps<typeof Input> {
  preventZoom?: boolean;
  touchOptimized?: boolean;
}

export const MobileInput: React.FC<MobileInputProps> = ({
  preventZoom = true,
  touchOptimized = true,
  className,
  ...props
}) => {
  return (
    <Input
      className={cn(
        touchOptimized && "touch-target min-h-[48px] px-4 py-3",
        preventZoom && "text-base sm:text-sm", // Prevents zoom on iOS
        "border-2 border-border rounded-lg transition-all duration-200",
        "focus:border-primary focus:ring-2 focus:ring-primary/20",
        "bg-background/50 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
};

interface MobileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  preventZoom?: boolean;
  touchOptimized?: boolean;
}

export const MobileTextarea: React.FC<MobileTextareaProps> = ({
  preventZoom = true,
  touchOptimized = true,
  className,
  ...props
}) => {
  return (
    <Textarea
      className={cn(
        touchOptimized && "touch-target min-h-[120px] px-4 py-3",
        preventZoom && "text-base sm:text-sm", // Prevents zoom on iOS
        "border-2 border-border rounded-lg transition-all duration-200",
        "focus:border-primary focus:ring-2 focus:ring-primary/20",
        "bg-background/50 backdrop-blur-sm resize-none",
        className
      )}
      {...props}
    />
  );
};