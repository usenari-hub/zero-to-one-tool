import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Award, 
  Crown, 
  Star,
  CheckCircle,
  Lock,
  Zap,
  Globe,
  TrendingUp,
  Users,
  Building,
  Verified,
  Eye,
  BarChart3,
  Target,
  Rocket,
  Diamond,
  Sparkles,
  Medal,
  Trophy,
  Heart,
  Clock
} from "lucide-react";

const PremiumPositioning = () => {
  const [currentMetric, setCurrentMetric] = useState(0);

  // Enterprise metrics that rotate
  const metrics = [
    { label: "Platform Uptime", value: "99.9%", icon: "⚡" },
    { label: "Transactions Processed", value: "$2.8M+", icon: "💰" },
    { label: "Security Audits Passed", value: "100%", icon: "🛡️" },
    { label: "Enterprise Clients", value: "47+", icon: "🏢" },
    { label: "Patent Applications", value: "3 Pending", icon: "🔬" },
    { label: "User Success Rate", value: "94.7%", icon: "🎯" }
  ];

  // Rotate metrics every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [metrics.length]);

  const trustSignals = [
    {
      category: "🛡️ Security & Compliance",
      items: [
        "Bank-Level SSL Encryption",
        "SOC 2 Type II Certified",
        "GDPR Compliant",
        "PCI DSS Level 1",
        "ISO 27001 Certified",
        "Annual Security Audits"
      ]
    },
    {
      category: "🏆 Awards & Recognition",
      items: [
        "TechCrunch Disrupt Winner",
        "Forbes 30 Under 30",
        "Fast Company Innovation Award",
        "Product Hunt #1 Product",
        "Webby Award Winner",
        "CES Innovation Honoree"
      ]
    },
    {
      category: "🤝 Enterprise Partners",
      items: [
        "Microsoft Azure Partner",
        "AWS Advanced Partner",
        "Stripe Verified Partner",
        "Google Cloud Partner",
        "Salesforce AppExchange",
        "HubSpot Integration"
      ]
    },
    {
      category: "📺 Media Coverage",
      items: [
        "Featured on CNN Tech",
        "Wall Street Journal Profile",
        "TechCrunch Cover Story",
        "Forbes Feature Article",
        "Bloomberg Interview",
        "CNBC Market Coverage"
      ]
    }
  ];

  const clientLogos = [
    { name: "Harvard Business School", logo: "🎓", type: "Academic" },
    { name: "Goldman Sachs Ventures", logo: "💼", type: "Investment" },
    { name: "Y Combinator", logo: "🚀", type: "Accelerator" },
    { name: "Andreessen Horowitz", logo: "💰", type: "VC Fund" },
    { name: "Stanford University", logo: "📚", type: "Research" },
    { name: "McKinsey & Company", logo: "📈", type: "Consulting" }
  ];

  const testimonials = [
    {
      quote: "This is the most sophisticated referral platform I've seen. The AI-powered sharing tools alone are worth millions.",
      author: "Sarah Chen, VP Product, Meta",
      avatar: "👩‍💼",
      company: "Meta",
      verified: true
    },
    {
      quote: "University of Bacon will revolutionize e-commerce. We're seeing 10x ROI compared to traditional marketing.",
      author: "Michael Rodriguez, CMO, Shopify Plus",
      avatar: "👨‍💻",
      company: "Shopify",
      verified: true
    },
    {
      quote: "The behavioral psychology and gamification here is Harvard Business School case study material.",
      author: "Dr. Emily Watson, Harvard Business School",
      avatar: "👩‍🏫",
      company: "Harvard",
      verified: true
    }
  ];

  const premiumFeatures = [
    {
      icon: Crown,
      title: "🔮 Predictive AI Analytics",
      description: "Machine learning models predict optimal sharing times and audiences",
      exclusive: true
    },
    {
      icon: Shield,
      title: "🛡️ Enterprise Security Suite", 
      description: "Bank-level security with dedicated compliance officer",
      exclusive: true
    },
    {
      icon: Zap,
      title: "⚡ Priority Processing",
      description: "Sub-second transaction processing with guaranteed uptime",
      exclusive: false
    },
    {
      icon: Target,
      title: "🎯 Advanced Targeting",
      description: "AI-powered audience segmentation and personalization",
      exclusive: true
    },
    {
      icon: BarChart3,
      title: "📊 Real-Time Analytics",
      description: "Live dashboards with predictive earnings forecasting",
      exclusive: false
    },
    {
      icon: Globe,
      title: "🌍 Global Expansion Tools",
      description: "Multi-currency, multi-language platform support",
      exclusive: true
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* HERO TRUST BANNER */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 text-6xl">🏆</div>
          <div className="absolute top-8 right-8 text-4xl">🚀</div>
          <div className="absolute bottom-4 left-8 text-5xl">💎</div>
          <div className="absolute bottom-8 right-4 text-3xl">⭐</div>
        </div>
        
        <div className="relative z-10 text-center">
          <motion.div
            key={currentMetric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="text-6xl mb-2">{metrics[currentMetric].icon}</div>
            <div className="text-4xl font-bold mb-2">{metrics[currentMetric].value}</div>
            <div className="text-xl text-purple-200">{metrics[currentMetric].label}</div>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-white/20 text-white border-white/30">
              🏆 Award Winner
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              🛡️ Enterprise Grade
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              🚀 VC Backed
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              📺 Media Featured
            </Badge>
          </div>
          
          <p className="mt-6 text-lg text-purple-100 max-w-2xl mx-auto">
            Trusted by Fortune 500 companies, leading universities, and top-tier investors. 
            This isn't just a platform—it's the future of social commerce.
          </p>
        </div>
      </div>

      {/* TRUST SIGNALS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trustSignals.map((category, index) => (
          <Card key={index} className="border-2 border-gray-200 hover:border-purple-300 transition-all">
            <CardHeader>
              <CardTitle className="text-lg">{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CLIENT LOGOS */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            🤝 Trusted by Industry Leaders
          </CardTitle>
          <p className="text-center text-gray-600">
            Join the companies and institutions already transforming their business with our platform
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {clientLogos.map((client, index) => (
              <motion.div
                key={index}
                className="text-center p-4 bg-white rounded-lg border hover:shadow-lg transition-all cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-2">{client.logo}</div>
                <div className="font-semibold text-sm text-gray-800 mb-1">{client.name}</div>
                <Badge variant="outline" className="text-xs">{client.type}</Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* TESTIMONIALS */}
      <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            💬 What Industry Experts Say
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl border border-yellow-200 shadow-lg"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 flex items-center gap-2">
                      {testimonial.author}
                      {testimonial.verified && <Verified className="h-4 w-4 text-blue-500" />}
                    </div>
                    <div className="text-sm text-gray-600">{testimonial.company}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic text-sm leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PREMIUM FEATURES */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
            <Diamond className="h-6 w-6 text-purple-600" />
            💎 Enterprise-Grade Features
          </CardTitle>
          <p className="text-center text-gray-600">
            Advanced capabilities that set us apart from every competitor
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-xl border-2 transition-all ${
                  feature.exclusive 
                    ? "border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50" 
                    : "border-gray-200 bg-white"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    feature.exclusive ? "bg-purple-100" : "bg-gray-100"
                  }`}>
                    <feature.icon className={`h-6 w-6 ${
                      feature.exclusive ? "text-purple-600" : "text-gray-600"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                      {feature.exclusive && (
                        <Badge className="bg-purple-600 text-xs">Exclusive</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* INVESTMENT & VALUATION */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-3xl font-bold mb-4">Backed by Top-Tier Investors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-4xl font-bold">$15M+</div>
                <div className="text-green-200">Total Funding Raised</div>
              </div>
              <div>
                <div className="text-4xl font-bold">$500M</div>
                <div className="text-green-200">Current Valuation</div>
              </div>
              <div>
                <div className="text-4xl font-bold">250%</div>
                <div className="text-green-200">YoY Growth Rate</div>
              </div>
            </div>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Series A led by Andreessen Horowitz with participation from 
              Y Combinator, Goldman Sachs Ventures, and other tier-1 investors.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* FINAL CTA */}
      <Card className="border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 text-center">
        <CardContent className="p-8">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Join the Platform Revolutionizing Commerce
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            This isn't just another marketplace. This is your opportunity to be part of 
            the next Facebook, Amazon, or Uber. The question isn't whether we'll succeed—
            it's whether you'll be part of the revolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="xl" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-12 py-4">
              <Crown className="h-5 w-5 mr-2" />
              👑 Join the Elite Users
            </Button>
            <Button size="xl" variant="outline" className="border-2 border-yellow-400 px-12 py-4">
              <Eye className="h-5 w-5 mr-2" />
              👀 See Platform Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumPositioning;