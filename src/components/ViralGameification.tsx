import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Crown, 
  Zap, 
  Target,
  Users,
  TrendingUp,
  Award,
  Star,
  Flame,
  DollarSign,
  Medal,
  Gift,
  Rocket,
  Heart,
  Share2,
  Eye,
  ThumbsUp,
  Activity,
  CheckCircle
} from "lucide-react";

const ViralGameification = () => {
  const [userLevel, setUserLevel] = useState(24);
  const [currentXP, setCurrentXP] = useState(2847);
  const [nextLevelXP] = useState(3000);
  const [streak, setStreak] = useState(12);
  const [totalEarnings, setTotalEarnings] = useState(4567.89);

  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState([
    {
      rank: 1,
      user: "ChainMaster_Sarah",
      earnings: "$15,847",
      referrals: 234,
      streak: 45,
      level: 67,
      badge: "👑 Chain Royalty",
      multiplier: "5.2x",
      trend: "up"
    },
    {
      rank: 2, 
      user: "ViralVince_92",
      earnings: "$12,394",
      referrals: 189,
      streak: 38,
      level: 52,
      badge: "🚀 Viral Legend",
      multiplier: "4.8x",
      trend: "up"
    },
    {
      rank: 3,
      user: "ShareQueen_Lisa",
      earnings: "$11,225",
      referrals: 167,
      streak: 29,
      level: 48,
      badge: "⚡ Lightning Sharer",
      multiplier: "4.3x",
      trend: "stable"
    },
    {
      rank: 4,
      user: "ReferralRocket",
      earnings: "$9,876",
      referrals: 145,
      streak: 22,
      level: 41,
      badge: "🎯 Precision Master",
      multiplier: "3.9x",
      trend: "down"
    },
    {
      rank: 5,
      user: "YOU",
      earnings: `$${totalEarnings.toFixed(2)}`,
      referrals: 89,
      streak: streak,
      level: userLevel,
      badge: "🔥 Rising Star",
      multiplier: "2.1x",
      trend: "up"
    }
  ]);

  // Achievements system
  const achievements = [
    {
      id: "first_share",
      title: "First Share",
      description: "Complete your first successful share",
      icon: "🎯",
      progress: 100,
      maxProgress: 100,
      reward: "$5 bonus",
      unlocked: true,
      rarity: "common"
    },
    {
      id: "chain_master",
      title: "Chain Master",
      description: "Create a 6-degree referral chain",
      icon: "⛓️",
      progress: 4,
      maxProgress: 6,
      reward: "$100 bonus + 2x multiplier",
      unlocked: false,
      rarity: "legendary"
    },
    {
      id: "viral_sensation",
      title: "Viral Sensation",
      description: "Get 1000+ views on a single share",
      icon: "🌟",
      progress: 847,
      maxProgress: 1000,
      reward: "$50 + Viral Master badge",
      unlocked: false,
      rarity: "epic"
    },
    {
      id: "money_magnet",
      title: "Money Magnet",
      description: "Earn $1000 in a single month",
      icon: "💰",
      progress: 456,
      maxProgress: 1000,
      reward: "$200 bonus + exclusive features",
      unlocked: false,
      rarity: "epic"
    },
    {
      id: "streak_master",
      title: "Streak Master",
      description: "Maintain 30-day sharing streak",
      icon: "🔥",
      progress: streak,
      maxProgress: 30,
      reward: "Permanent 1.5x multiplier",
      unlocked: false,
      rarity: "legendary"
    },
    {
      id: "helping_hand",
      title: "Helping Hand",
      description: "Help 100 people find what they want",
      icon: "🤝",
      progress: 67,
      maxProgress: 100,
      reward: "$75 + Community Hero badge",
      unlocked: false,
      rarity: "rare"
    }
  ];

  // Live activity feed
  const [liveActivity, setLiveActivity] = useState([
    {
      id: 1,
      user: "Sarah M.",
      action: "earned $234",
      item: "MacBook Pro",
      time: "2 minutes ago",
      type: "earning"
    },
    {
      id: 2,
      user: "Mike R.",
      action: "completed 6-degree chain",
      item: "Gaming Setup",
      time: "5 minutes ago",
      type: "achievement"
    },
    {
      id: 3,
      user: "Lisa K.",
      action: "reached Level 50",
      item: "",
      time: "8 minutes ago",
      type: "levelup"
    },
    {
      id: 4,
      user: "Anonymous_847",
      action: "earned $89",
      item: "iPhone 15",
      time: "12 minutes ago", 
      type: "earning"
    }
  ]);

  // Social proof metrics
  const socialProof = {
    totalUsers: 47892,
    activeNow: 2847,
    successRate: 94.7,
    avgEarningsPerShare: 87.50,
    totalPaidOut: 2847592,
    chainsCompleted: 15847
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update activity feed
      const newActivity = {
        id: Date.now(),
        user: `User_${Math.floor(Math.random() * 1000)}`,
        action: `earned $${Math.floor(Math.random() * 500) + 25}`,
        item: ["MacBook", "iPhone", "Car", "Furniture", "Gaming PC"][Math.floor(Math.random() * 5)],
        time: "Just now",
        type: "earning"
      };
      
      setLiveActivity(prev => [newActivity, ...prev.slice(0, 9)]);

      // Occasionally update user progress
      if (Math.random() > 0.7) {
        setCurrentXP(prev => Math.min(prev + Math.floor(Math.random() * 50), nextLevelXP));
        setTotalEarnings(prev => prev + (Math.random() * 50));
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [nextLevelXP]);

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case "legendary": return "from-purple-500 to-pink-500";
      case "epic": return "from-blue-500 to-purple-500";
      case "rare": return "from-green-500 to-blue-500";
      default: return "from-gray-400 to-gray-600";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch(rarity) {
      case "legendary": return "border-purple-400 shadow-purple-500/25";
      case "epic": return "border-blue-400 shadow-blue-500/25";
      case "rare": return "border-green-400 shadow-green-500/25";
      default: return "border-gray-400";
    }
  };

  return (
    <div className="space-y-6 p-4">
      
      {/* PLAYER STATS HEADER */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
            
            {/* Level & XP */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">Level {userLevel}</div>
                  <div className="text-sm text-gray-600">🔥 Rising Star</div>
                </div>
              </div>
              <div className="space-y-1">
                <Progress value={(currentXP / nextLevelXP) * 100} className="h-2" />
                <div className="text-xs text-gray-600">{currentXP}/{nextLevelXP} XP</div>
              </div>
            </div>

            {/* Earnings */}
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">${totalEarnings.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Earnings</div>
              <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% this week
              </div>
            </div>

            {/* Streak */}
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 flex items-center justify-center gap-2">
                <Flame className="h-8 w-8" />
                {streak}
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
              <div className="text-xs text-orange-600">Keep it going!</div>
            </div>

            {/* Multiplier */}
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2.1x</div>
              <div className="text-sm text-gray-600">Earning Multiplier</div>
              <div className="text-xs text-blue-600">+0.1x from streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MAIN GAMIFICATION TABS */}
      <Tabs defaultValue="leaderboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leaderboard">🏆 Leaderboard</TabsTrigger>
          <TabsTrigger value="achievements">🏅 Achievements</TabsTrigger>
          <TabsTrigger value="social">📊 Social Proof</TabsTrigger>
          <TabsTrigger value="challenges">🎯 Challenges</TabsTrigger>
        </TabsList>

        {/* LEADERBOARD TAB */}
        <TabsContent value="leaderboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Leaderboard */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    🏆 Monthly Leaderboard
                    <Badge className="bg-yellow-500">Live Rankings</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard.map((player) => (
                      <motion.div
                        key={player.rank}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          player.user === "YOU" 
                            ? "border-purple-400 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg" 
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-4">
                          
                          {/* Rank */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                            player.rank === 1 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" :
                            player.rank === 2 ? "bg-gradient-to-r from-gray-400 to-gray-600" :
                            player.rank === 3 ? "bg-gradient-to-r from-orange-400 to-orange-600" :
                            "bg-gradient-to-r from-purple-400 to-purple-600"
                          }`}>
                            {player.rank === 1 ? "👑" : player.rank}
                          </div>

                          {/* User Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-800">{player.user}</span>
                              <Badge variant="outline" className="text-xs">{player.badge}</Badge>
                              {player.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600">
                              <div>💰 {player.earnings}</div>
                              <div>🔗 {player.referrals} referrals</div>
                              <div>🔥 {player.streak} streak</div>
                              <div>⚡ {player.multiplier}</div>
                            </div>
                          </div>

                          {/* Level */}
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{player.level}</div>
                            <div className="text-xs text-gray-600">Level</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Button variant="outline">
                      View Full Leaderboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  📈 Live Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {liveActivity.map((activity) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          activity.type === "earning" ? "bg-green-100 text-green-600" :
                          activity.type === "achievement" ? "bg-purple-100 text-purple-600" :
                          "bg-blue-100 text-blue-600"
                        }`}>
                          {activity.type === "earning" ? "💰" : 
                           activity.type === "achievement" ? "🏆" : "⬆️"}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">
                            <strong>{activity.user}</strong> {activity.action}
                          </div>
                          {activity.item && (
                            <div className="text-xs text-gray-600">{activity.item}</div>
                          )}
                          <div className="text-xs text-gray-500">{activity.time}</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ACHIEVEMENTS TAB */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.02 }}
                className={`relative overflow-hidden`}
              >
                <Card className={`h-full border-2 ${getRarityBorder(achievement.rarity)} ${
                  achievement.unlocked ? "bg-white" : "bg-gray-50"
                }`}>
                  {achievement.unlocked && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                  )}
                  
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <div className={`text-4xl mb-2 ${achievement.unlocked ? "" : "grayscale"}`}>
                        {achievement.icon}
                      </div>
                      <h3 className={`font-bold ${achievement.unlocked ? "text-gray-800" : "text-gray-500"}`}>
                        {achievement.title}
                      </h3>
                      <Badge className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white text-xs mt-1`}>
                        {achievement.rarity.toUpperCase()}
                      </Badge>
                    </div>

                    <p className={`text-sm text-center mb-4 ${
                      achievement.unlocked ? "text-gray-600" : "text-gray-400"
                    }`}>
                      {achievement.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className={achievement.unlocked ? "text-green-600" : "text-gray-600"}>
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-2"
                      />
                      <div className={`text-xs text-center ${
                        achievement.unlocked ? "text-green-600" : "text-gray-500"
                      }`}>
                        Reward: {achievement.reward}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* SOCIAL PROOF TAB */}
        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Community Stats */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-500" />
                  🌍 Global Community Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {socialProof.totalUsers.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {socialProof.activeNow.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Active Now</div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">
                      {socialProof.successRate}%
                    </div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">
                      ${socialProof.avgEarningsPerShare}
                    </div>
                    <div className="text-sm text-gray-600">Avg per Share</div>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">
                      ${(socialProof.totalPaidOut / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-gray-600">Total Paid Out</div>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">
                      {socialProof.chainsCompleted.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Chains Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Stories */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  🎉 Recent Success Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">$2,847</div>
                      <div className="text-sm text-gray-600 mb-2">Sarah's Best Month</div>
                      <p className="text-xs text-gray-700 italic">
                        "I shared one Tesla listing and earned more than my part-time job!"
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">6-Chain</div>
                      <div className="text-sm text-gray-600 mb-2">Mike's Record</div>
                      <p className="text-xs text-gray-700 italic">
                        "Complete 6-degree chain earned me $1,200 from one MacBook!"
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">Level 85</div>
                      <div className="text-sm text-gray-600 mb-2">Lisa's Achievement</div>
                      <p className="text-xs text-gray-700 italic">
                        "Reached max level and now earn 5x multiplier on everything!"
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CHALLENGES TAB */}
        <TabsContent value="challenges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-orange-500" />
                🎯 Weekly Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Complete challenges to earn bonus XP and exclusive rewards!</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <h4 className="font-bold text-orange-800 mb-2">🔥 Hot Streak Challenge</h4>
                  <p className="text-sm text-gray-700 mb-3">Share one item every day for 7 days</p>
                  <div className="space-y-2">
                    <Progress value={57} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span>4/7 days</span>
                      <span className="text-orange-600">Reward: 500 XP + 2x multiplier</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <h4 className="font-bold text-green-800 mb-2">💰 Earnings Goal</h4>
                  <p className="text-sm text-gray-700 mb-3">Earn $500 this week</p>
                  <div className="space-y-2">
                    <Progress value={73} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span>$365/$500</span>
                      <span className="text-green-600">Reward: $100 bonus</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViralGameification;