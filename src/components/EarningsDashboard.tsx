import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Zap, 
  Target, 
  Gift,
  Clock,
  Star,
  Trophy,
  Flame
} from "lucide-react";

const EarningsDashboard = () => {
  const [totalEarnings, setTotalEarnings] = useState(1247.50);
  const [pendingEarnings, setPendingEarnings] = useState(89.25);
  const [thisMonthEarnings, setThisMonthEarnings] = useState(324.75);
  const [referralCount, setReferralCount] = useState(47);
  const [earningsGoal] = useState(2000);
  const [isAnimating, setIsAnimating] = useState(false);

  // Simulate real-time earnings updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of earnings update
        const increment = Math.random() * 25 + 5; // Random between $5-$30
        setTotalEarnings(prev => prev + increment);
        setThisMonthEarnings(prev => prev + increment);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = (thisMonthEarnings / earningsGoal) * 100;

  const hotOpportunities = [
    {
      id: 1,
      title: "2023 MacBook Pro M2",
      potential: "$125-$500",
      timeLeft: "2 hours",
      category: "Tech",
      multiplier: "2x",
      urgency: "HIGH"
    },
    {
      id: 2, 
      title: "Tesla Model 3 Lease Transfer",
      potential: "$2,000-$8,000",
      timeLeft: "1 day", 
      category: "Auto",
      multiplier: "3x",
      urgency: "ULTRA HIGH"
    },
    {
      id: 3,
      title: "Luxury Apartment Downtown",
      potential: "$5,000-$15,000",
      timeLeft: "3 days",
      category: "Real Estate", 
      multiplier: "5x",
      urgency: "MEDIUM"
    }
  ];

  const recentEarnings = [
    { user: "Sarah K.", amount: "$234", item: "MacBook Pro", time: "2 min ago" },
    { user: "Mike R.", amount: "$89", item: "Gaming Chair", time: "15 min ago" },
    { user: "Lisa M.", amount: "$456", item: "iPhone 15", time: "1 hour ago" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* MAIN EARNINGS COUNTER */}
      <Card className="bg-gradient-to-br from-green-600 to-emerald-700 text-white border-0 shadow-2xl">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="h-8 w-8 text-yellow-300" />
              <span className="text-sm font-semibold text-green-100 uppercase tracking-wider">
                💰 TOTAL EARNINGS
              </span>
            </div>
            <motion.div 
              className={`text-5xl sm:text-6xl lg:text-7xl font-bold ${isAnimating ? 'earnings-counter' : ''}`}
              animate={isAnimating ? { scale: [1, 1.1, 1], color: ["#fff", "#fbbf24", "#fff"] } : {}}
              transition={{ duration: 0.6 }}
            >
              ${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.div>
            <div className="flex justify-center gap-4 text-sm">
              <div className="text-green-200">
                <span className="font-semibold">Pending: </span>
                <span className="text-yellow-300">${pendingEarnings.toFixed(2)}</span>
              </div>
              <div className="text-green-200">
                <span className="font-semibold">This Month: </span>
                <span className="text-yellow-300">${thisMonthEarnings.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MONTHLY PROGRESS & MULTIPLIER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Target className="h-5 w-5" />
              Monthly Goal Progress
              <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                {Math.round(progressPercentage)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">${thisMonthEarnings.toFixed(2)}</span>
                <span className="font-semibold text-orange-600">${earningsGoal}</span>
              </div>
              <p className="text-xs text-gray-500">
                ${(earningsGoal - thisMonthEarnings).toFixed(2)} to reach your goal!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Zap className="h-5 w-5" />
              Active Multipliers
              <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                LIVE
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">New User Bonus</span>
                <Badge className="bg-purple-600">2x</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Weekend Special</span>
                <Badge className="bg-blue-600">1.5x</Badge>
              </div>
              <div className="text-xs text-purple-600 font-semibold">
                🔥 Stack multipliers for up to 5x earnings!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* HOT OPPORTUNITIES */}
      <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Flame className="h-5 w-5 text-red-500" />
            🔥 Hot Earning Opportunities
            <Badge variant="destructive" className="animate-pulse">
              URGENT
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotOpportunities.map((opportunity) => (
              <motion.div
                key={opportunity.id}
                className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-all cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={opportunity.urgency === "ULTRA HIGH" ? "destructive" : opportunity.urgency === "HIGH" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {opportunity.urgency}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                      {opportunity.multiplier}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm text-gray-800 line-clamp-2">
                    {opportunity.title}
                  </h4>
                  <div className="space-y-1">
                    <div className="text-green-600 font-bold text-lg">
                      {opportunity.potential}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>⏰ {opportunity.timeLeft}</span>
                      <span>{opportunity.category}</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full" variant="success">
                    💰 Share Now!
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* LIVE EARNINGS FEED */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            🎉 Live Earnings Feed
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Real-time
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence>
              {recentEarnings.map((earning, index) => (
                <motion.div
                  key={`${earning.user}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {earning.user} earned {earning.amount}
                      </div>
                      <div className="text-sm text-gray-600">
                        Shared: {earning.item}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {earning.time}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All Earnings 📊
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{referralCount}</div>
            <div className="text-sm text-gray-600">Successful Referrals</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">24</div>
            <div className="text-sm text-gray-600">Active Chains</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">3.8x</div>
            <div className="text-sm text-gray-600">Avg Multiplier</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">92%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EarningsDashboard;