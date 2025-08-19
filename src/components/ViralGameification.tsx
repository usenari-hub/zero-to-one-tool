import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Users, Gift } from "lucide-react";

const ViralGameification = () => {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            🎮 Viral Gaming Hub
            <Badge variant="secondary" className="bg-white/20 text-white">
              Level 5
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Streak Multiplier: 2.5x</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-300" />
                <span>Team Bonus: Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-pink-300" />
                <span>Daily Reward: Ready!</span>
              </div>
            </div>
            <div className="text-center">
              <Button variant="secondary" className="w-full">
                🏆 Claim Rewards
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViralGameification;