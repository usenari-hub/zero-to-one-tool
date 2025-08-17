import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Share2, Eye, GraduationCap, MapPin, Star } from 'lucide-react';

interface Course {
  id: string;
  item_title: string;
  item_description?: string;
  price_min?: number;
  price_max?: number;
  reward_percentage?: number;
  max_degrees: number;
  status: string;
  user_id: string;
  general_location?: string;
  verification_level: 'none' | 'professor_verified' | 'deans_list' | 'honor_roll';
  created_at: string;
  updated_at: string;
}

interface EnhancedCourseCardProps {
  course: Course;
  onShareClick?: (courseId: string, shareLink?: any) => void;
  onViewDetails: (courseId: string) => void;
  onExpressInterest?: (courseId: string) => void;
  showAnalytics?: boolean;
}

export const EnhancedCourseCard: React.FC<EnhancedCourseCardProps> = ({
  course,
  onShareClick,
  onViewDetails,
  onExpressInterest,
  showAnalytics = false
}) => {
  const { toast } = useToast();
  
  const formatPrice = (priceMin?: number, priceMax?: number) => {
    if (!priceMin && !priceMax) return 'Price TBD';
    if (priceMin === priceMax) return `$${priceMin?.toLocaleString()}`;
    if (priceMin && priceMax) return `$${priceMin?.toLocaleString()} - $${priceMax?.toLocaleString()}`;
    return `$${priceMin?.toLocaleString()}+`;
  };

  const handleShare = () => {
    if (onShareClick) {
      onShareClick(course.id);
      toast({
        title: "Share Link Created!",
        description: `Share ${course.item_title} to earn bacon!`,
      });
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <GraduationCap className="w-16 h-16 text-blue-500" />
        </div>
        <div className="absolute top-2 right-2">
          <Badge className="bg-amber-500 text-amber-900">
            🥓 ${Math.round(((course.price_min || 100) * (course.reward_percentage || 15)) / 100)} Pool
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg">{course.item_title}</h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{course.general_location || 'Online'}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            {formatPrice(course.price_min, course.price_max)}
          </div>
          <div className="text-sm text-green-600 font-medium">
            {course.reward_percentage || 15}% Reward
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share This Course!
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => onViewDetails(course.id)}>
              <Eye className="w-4 h-4 mr-2" />
              Details
            </Button>
            {onExpressInterest && (
              <Button variant="outline" onClick={() => onExpressInterest(course.id)}>
                Interest
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};