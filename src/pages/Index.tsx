import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTopCourses } from "@/hooks/useTopCourses";
import { useRealTimeStats } from "@/hooks/useRealTimeStats";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import heroIvy from "@/assets/hero-bacon-ivy.jpg";
import { SharedLayout } from "@/components/SharedLayout";
import { AcademicTimeline } from "@/components/AcademicTimeline";
import { Footer } from "@/components/Footer";
import EarningsDashboard from "@/components/EarningsDashboard";
import ViralGameification from "@/components/ViralGameification";
import PremiumPositioning from "@/components/PremiumPositioning";
import { Clapperboard, Heart, TrendingUp, Zap, DollarSign, Crown, Trophy, Rocket } from "lucide-react";

const MotionButton = motion(Button);

const Index = () => {
  // UI state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const defaultSidebarOpen = typeof window !== "undefined" ? (localStorage.getItem("sidebar:open") ?? "true") === "true" : true;
  const sections = [
    { id: "admissions", label: "Admissions" },
    { id: "study-guides", label: "Study Guides" },
    { id: "departments", label: "Departments" },
    { id: "transcripts", label: "Transcripts" },
    { id: "alumni", label: "Alumni" },
  ];

  // GPA simulation
  const [gpa, setGpa] = useState(0.0);

  // Academic progression
  const degreeProgression = useMemo(
    () => [
      "👨‍🎓 Freshman",
      "📚 Sophomore",
      "🎯 Junior",
      "🏆 Senior",
      "👨‍💼 Graduate Student",
      "👨‍🏫 Professor",
      "👑 Dean!",
    ],
    []
  );
  const [degreeStep, setDegreeStep] = useState(0);
  

  // Stats counters
  const statsRef = useRef<HTMLDivElement | null>(null);
  const countersRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const [countersStarted, setCountersStarted] = useState(false);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("revealed");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".scroll-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Navbar scrolled effect
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GPA simulation interval
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.6) {
        setGpa((prev) => Math.min(4.0, prev + Math.random() * 0.3));
      }
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Degree progression animation
  useEffect(() => {
    const step = () => {
      setDegreeStep((s) => {
        const next = Math.min(s + 1, degreeProgression.length - 1);
        if (next === degreeProgression.length - 1) {
          // reset after a delay
          setTimeout(() => setDegreeStep(0), 5000);
        }
        return next;
      });
    };
    const id = setInterval(step, 1500);
    return () => clearInterval(id);
  }, [degreeProgression.length]);

  // Stats counters when visible
  useEffect(() => {
    if (!statsRef.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersStarted) {
          countersRef.current = statsRef.current!.querySelectorAll("[data-target]") as NodeListOf<HTMLElement>;
          countersRef.current.forEach((el) => animateCounter(el));
          setCountersStarted(true);
          io.disconnect();
        }
      });
    });
    io.observe(statsRef.current);
    return () => io.disconnect();
  }, [countersStarted]);

  const animateCounter = (el: HTMLElement) => {
    const target = parseFloat(el.dataset.target || "0");
    let current = 0;
    const totalSteps = 60; // ~1 sec @ 60fps
    const increment = target / totalSteps;
    const step = () => {
      current = Math.min(target, current + increment);
      if (target >= 1000000) {
        el.textContent = `$${Math.ceil(current).toLocaleString()}`;
      } else if (target < 10) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.ceil(current).toLocaleString();
      }
      if (current < target) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Actions
  const navigate = useNavigate();

  const enrollNow = () => {
    navigate("/auth");
  };

  const postToMarketplace = () => {
    navigate("/listings");
  };

  const enrollInMetaListing = () => {
    toast({
      title: "Ultimate Academic Challenge 🚀",
      description:
        "Help sell the entire University of Bacon. First-degree payout: 50% of the $100,000 pool ($50,000) bacon.",
    });
  };

  const showDeansListInfo = () => {
    toast({
      title: "Dean's List 🌟",
      description:
        "Top 5% performer! 20% bonus on future bacon earnings and exclusive catalog access.",
    });
  };

// Fetch real course data and stats
const { courses: topCourses, loading: coursesLoading } = useTopCourses();
const { 
  totalBaconEarned, 
  totalUsers, 
  totalListings, 
  averageGPA, 
  charityFund,
  loading: statsLoading 
} = useRealTimeStats();
const topCoursesApiRef = useRef<CarouselApi | null>(null);
useEffect(() => {
  const id = setInterval(() => topCoursesApiRef.current?.scrollNext(), 5000);
  return () => clearInterval(id);
}, []);

return (
  <SharedLayout>
    <div>

      <main>
        {/* REVOLUTIONARY EARNINGS DASHBOARD */}
        <section className="py-4 sm:py-6 bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50">
          <div className="container">
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-gray-800 mb-2">
                💰 <span className="text-green-600">LIVE EARNINGS DASHBOARD</span> 🚀
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                See real money being made RIGHT NOW by our users!
              </p>
            </div>
            <EarningsDashboard />
          </div>
        </section>

        {/* Top Courses - Ultra Compact */}
        <aside aria-label="Top Courses" className="py-1 sm:py-4 bg-white">
          <div className="container">
            <Card className="shadow-elegant border-2 border-yellow-200">
              <CardHeader className="pb-1 sm:pb-3">
                <CardTitle className="text-sm sm:text-lg">Top Courses</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Highlights this week</CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <Carousel setApi={(api) => (topCoursesApiRef.current = api)} className="relative">
                  <CarouselContent>
                    {coursesLoading ? (
                      // Loading skeleton
                      Array.from({ length: 4 }).map((_, i) => (
                        <CarouselItem key={`skeleton-${i}`} className="px-1 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                          <div className="rounded-md border bg-card p-2 sm:p-4 animate-pulse">
                            <div className="h-3 bg-muted rounded w-20 mb-2"></div>
                            <div className="h-4 bg-muted rounded w-full mb-1"></div>
                            <div className="h-3 bg-muted rounded w-24 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-16 mb-1"></div>
                            <div className="h-3 bg-muted rounded w-20"></div>
                          </div>
                        </CarouselItem>
                      ))
                    ) : topCourses.length > 0 ? (
                      topCourses.map((c, i) => (
                        <CarouselItem key={c.id || i} className="px-1 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                          <div className="rounded-md border bg-card p-2 sm:p-4 cursor-pointer hover:shadow-md transition-shadow"
                               onClick={() => navigate(`/listings/${c.id}`)}>
                            <div className="text-[9px] sm:text-[10px] uppercase tracking-wide text-muted-foreground">{c.department}</div>
                            <div className="mt-1 font-display text-xs sm:text-sm text-[hsl(var(--brand-academic))] line-clamp-2">{c.title}</div>
                            <div className="mt-1 text-[10px] sm:text-xs text-muted-foreground">Anonymous listing • {c.classSize}</div>
                            <div className="mt-2 text-xs sm:text-sm"><span className="font-medium">Tuition:</span> {c.tuition}</div>
                            <div className="text-xs sm:text-sm"><span className="font-medium">Rewards:</span> {c.rewards}</div>
                          </div>
                        </CarouselItem>
                      ))
                    ) : (
                      // No data fallback
                      <CarouselItem className="px-1 basis-full">
                        <div className="rounded-md border bg-card p-4 text-center text-muted-foreground">
                          <p className="text-sm">No courses available at the moment</p>
                          <p className="text-xs mt-1">Check back soon for new listings!</p>
                        </div>
                      </CarouselItem>
                    )}
                  </CarouselContent>
                  <CarouselPrevious className="left-1 sm:left-2 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8" />
                  <CarouselNext className="right-1 sm:right-2 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8" />
                </Carousel>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Hero - Aggressively Mobile Optimized */}
        <section className="campus-hero relative overflow-hidden">
          <div className="container grid gap-2 sm:gap-6 md:gap-8 py-3 sm:py-6 md:py-8 lg:py-12 lg:grid-cols-2 items-center">
            {/* Content - Mobile First */}
            <div className="text-background order-2 lg:order-1 space-y-3 sm:space-y-6 md:space-y-8">
              {/* REVOLUTIONARY MONEY-MAKING HEADLINES */}
              <div className="space-y-2 sm:space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                  🔥 Revolutionary Platform • $500K+ Value
                </div>
                <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl drop-shadow-lg text-gold-emboss leading-tight money-glow">
                  Turn Every Share Into
                  <span className="block text-money-glow">💰 COLD HARD CASH 💰</span>
                </h1>
                <h2 className="font-display text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white drop-shadow leading-tight neon-glow">
                  The First Platform That <span className="text-success-glow">PAYS YOU</span> for Social Referrals
                </h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-base sm:text-xl md:text-2xl text-white/95 font-semibold leading-relaxed">
                  🚀 <span className="text-gold-emboss">6-Degree Earning Chains</span> • 🎯 <span className="text-success-glow">AI-Powered Sharing</span> • 💸 <span className="text-money-glow">Instant Payouts</span>
                </p>
                <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
                  <strong>Imagine earning $50-$500+ just for sharing something your friend might want to buy.</strong> 
                  That's not imagination—that's University of Bacon!
                </p>
              </div>
              
              {/* VIRAL SUCCESS PROOF */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clapperboard className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                  <span className="text-xs sm:text-sm font-bold text-yellow-400 uppercase tracking-wide">
                    🎆 Viral Success Story
                  </span>
                </div>
                <p className="text-sm sm:text-base text-white/95 leading-relaxed">
                  <span className="font-bold text-green-400">“Sarah earned $234”</span> just for sharing a MacBook listing with her friend Jake. 
                  <span className="hidden sm:inline">Jake shared it with his sister who bought it. </span>
                  <span className="font-bold text-yellow-400">Zero effort. Pure profit.</span>
                  <span className="block mt-1 text-xs text-white/80">
                    → That's the power of our 6-degree earning chains in action!
                  </span>
                </p>
              </div>
              
              {/* MONEY-MAKING ACTION BUTTONS */}
              <div className="flex flex-col gap-3 sm:gap-4 w-full sm:flex-row sm:w-auto">
                <MotionButton 
                  className="money-lift w-full sm:w-auto text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-5 neon-glow font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 shadow-2xl" 
                  onClick={enrollNow} 
                  whileHover={{ scale: 1.08 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  💰 START EARNING NOW!
                  <span className="block text-xs font-normal opacity-90">→ Free signup • Instant access</span>
                </MotionButton>
                <MotionButton 
                  className="money-lift w-full sm:w-auto text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-5 bg-white/20 backdrop-blur text-white border border-white/30 hover:bg-white/30" 
                  onClick={postToMarketplace} 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  🔍 See Live Earnings
                  <span className="block text-xs font-normal opacity-90">→ Browse success stories</span>
                </MotionButton>
              </div>
              
              {/* URGENCY & SCARCITY */}
              <div className="bg-red-600/20 backdrop-blur border border-red-500/50 rounded-lg p-3 text-center">
                <p className="text-sm sm:text-base text-white font-semibold">
                  ⏰ <span className="text-red-300">LIMITED TIME:</span> First 1,000 users get <span className="text-yellow-300">2x earning multiplier</span> on all referrals!
                </p>
                <p className="text-xs text-white/80 mt-1">Join the earning revolution before it's too late.</p>
              </div>

              {/* EARNING PROGRESSION TIMELINE */}
              <div className="pt-2 sm:pt-6">
                <h3 className="font-display text-sm sm:text-lg md:text-xl text-white/95 mb-2 sm:mb-3 flex items-center gap-2">
                  🎆 Your Earning Journey:
                  <span className="text-xs bg-green-600/30 px-2 py-1 rounded text-green-300">
                    Current: {degreeProgression[degreeStep]}
                  </span>
                </h3>
                <AcademicTimeline items={degreeProgression} currentStep={degreeStep} />
                <p className="text-xs sm:text-sm text-white/80 mt-2">
                  → Each level unlocks higher earning potential and exclusive features!
                </p>
              </div>
            </div>

            {/* Hero Image - Ultra Compact for Mobile */}
            <figure className="relative w-full h-32 sm:h-56 md:h-64 lg:h-80 xl:aspect-square rounded-lg sm:rounded-2xl overflow-hidden border bg-card shadow-elegant animate-fade-in order-1 lg:order-2">
              <img src={heroIvy} alt="Ivy‑League campus hero with golden crest and bacon motif" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              <figcaption className="absolute bottom-1 sm:bottom-2 md:bottom-3 left-1 sm:left-2 md:left-3 right-1 sm:right-2 md:right-3">
                <span className="inline-flex rounded-md bg-background/80 backdrop-blur px-1 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold text-foreground shadow">Earn Your Degree Online!</span>
              </figcaption>
            </figure>
          </div>
        </section>

{/* Departments - Mobile Optimized */}
<section id="departments" className="container mobile-section-padding scroll-reveal scroll-mt-24">
          <header className="text-center mb-4 sm:mb-6">
            <h2 className="font-display mobile-h2 text-[hsl(var(--brand-academic))]">Our Distinguished Faculties</h2>
            <p className="text-base sm:text-lg text-muted-foreground italic max-w-2xl mx-auto px-4 sm:px-0">Choose your specialization and start earning bacon from day one</p>
          </header>
          <div className="mobile-grid mt-6 sm:mt-8">
            {departments.map((d) => (
              <Card key={d.title} className="scroll-reveal mobile-card">
                <CardHeader className="pb-3">
                  <div className="text-3xl sm:text-4xl mb-2">{d.icon}</div>
                  <CardTitle className="font-display text-lg sm:text-xl text-[hsl(var(--brand-academic))]">{d.title}</CardTitle>
                  <CardDescription className="italic text-sm sm:text-base">{d.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm sm:text-base">{d.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Study Guides - Mobile Optimized */}
        <section id="study-guides" className="scroll-reveal scroll-mt-24 bg-[hsl(var(--brand-academic))] text-background py-8 sm:py-12 md:py-16">
          <div className="container">
            <h2 className="text-center font-display text-lg sm:text-2xl md:text-3xl lg:text-4xl text-accent">Study Guides</h2>
            <p className="text-center opacity-90 italic mt-2 text-sm sm:text-base">Real courses from our growing catalog</p>
            <div className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {coursesLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="text-center rounded-xl bg-white/10 p-4 sm:p-6 backdrop-blur animate-pulse">
                    <div className="mx-auto mb-3 sm:mb-4 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/20"></div>
                    <div className="h-4 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-full mx-auto mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-5/6 mx-auto"></div>
                  </div>
                ))
              ) : topCourses.length > 0 ? (
                topCourses.slice(0, 3).map((course, i) => (
                  <div key={course.id} className="scroll-reveal text-center rounded-xl bg-white/10 p-4 sm:p-6 backdrop-blur cursor-pointer hover:bg-white/20 transition-colors"
                       onClick={() => navigate(`/listings/${course.id}`)}>
                    <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-accent text-[hsl(var(--brand-academic))] font-display text-lg sm:text-2xl shadow">
                      {i + 1}
                    </div>
                    <h3 className="font-display text-base sm:text-lg lg:text-xl text-accent line-clamp-2">{course.title}</h3>
                    <p className="mt-1 text-xs sm:text-sm italic opacity-90">{course.department} • {course.location}</p>
                    <p className="mt-2 opacity-90 text-xs sm:text-sm leading-relaxed">
                      <span className="font-medium">Tuition:</span> {course.tuition} • <span className="font-medium">Rewards:</span> {course.rewards}
                    </p>
                  </div>
                ))
              ) : (
                // Fallback to static courses if no real data
                courses.map((c, i) => (
                  <div key={i} className="scroll-reveal text-center rounded-xl bg-white/10 p-4 sm:p-6 backdrop-blur">
                    <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-accent text-[hsl(var(--brand-academic))] font-display text-lg sm:text-2xl shadow">{c.num}</div>
                    <h3 className="font-display text-base sm:text-lg lg:text-xl text-accent">{c.title}</h3>
                    <p className="mt-1 text-xs sm:text-sm italic opacity-90">{c.code}</p>
                    <p className="mt-2 opacity-90 text-xs sm:text-sm leading-relaxed">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* How University of Bacon Works - Mobile Optimized */}
        <section id="how-it-works" className="scroll-reveal scroll-mt-24 container py-8 sm:py-12 lg:py-16">
          <header className="mb-4 sm:mb-6 text-center">
            <h2 className="font-display text-lg sm:text-2xl md:text-3xl lg:text-4xl text-[hsl(var(--brand-academic))]">🎓 How University of Bacon Works</h2>
            <p className="text-muted-foreground italic text-sm sm:text-base">Freshman Orientation: Getting Started</p>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 items-start">
            <article className="lg:col-span-2 space-y-4 sm:space-y-6">
              <section>
                <h3 className="font-display text-base sm:text-lg md:text-xl lg:text-2xl">Step 1: Enroll &amp; Get Verified</h3>
                <p className="text-sm sm:text-base leading-relaxed">Sign up and choose your verification level - from "Freshman" (basic email/phone) all the way up to "Dean's List" (full background check). Higher verification = access to bigger deals and more bacon!</p>
              </section>
              <section>
                <h3 className="font-display text-base sm:text-lg md:text-xl lg:text-2xl">Step 2: Post Your "Course Catalog"</h3>
                <p className="text-sm sm:text-base leading-relaxed mb-2">Got something to sell? Create your listing like you're designing a course:</p>
                <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-sm sm:text-base">
                  <li>Course Title: "2019 MacBook Pro - Mint Condition"</li>
                  <li>Course Description: All the juicy details</li>
                  <li>Tuition Fee: Your asking price</li>
                  <li className="hidden sm:list-item">Professor Rewards: Set how much bacon you'll pay your referral chain (we recommend 15-25% of sale price)</li>
                  <li className="sm:hidden">Professor Rewards: Set bacon percentage (15-25% recommended)</li>
                  <li>Class Size: Choose 1-6 degrees deep for your referral network</li>
                </ul>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground italic">All listings are published anonymously to prevent system bypassing.</p>
              </section>
              <section>
                <h3 className="font-display text-base sm:text-lg md:text-xl lg:text-2xl">The Academic Chain Reaction</h3>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li>🔗 <strong>Degree 1:</strong> Sarah sees your MacBook and refers it to Jake.</li>
                  <li>🔗 <strong>Degree 2:</strong> Jake passes it to his sister Emma who's laptop shopping.</li>
                  <li>🔗 <strong>Degree 3-6:</strong> This continues until someone says "YES!" and buys.</li>
                </ul>
              </section>
              <section>
                <h3 className="font-display text-base sm:text-lg md:text-xl lg:text-2xl">📚 The Bacon Distribution</h3>
                <p className="text-sm sm:text-base leading-relaxed mb-2">When Emma buys your MacBook for $1,200 with a 20% reward pool ($240 in bacon):</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                  <div>Degree 1: 50% = $120 🥓</div>
                  <div>Degree 2: 25% = $60 🥓</div>
                  <div>Degree 3: 10% = $24 🥓</div>
                  <div>Degree 4: 7.5% = $18 🥓</div>
                  <div>Degree 5: 5% = $12 🥓</div>
                  <div>Degree 6: 2.5% = $6 🥓</div>
                </div>
                <p className="mt-2 text-sm sm:text-base">Everyone wins: You sold your MacBook, Emma got what she wanted, and Sarah & Jake earned bacon!</p>
              </section>
            </article>
            
            {/* Bacon Money Sign Visual - Hidden on small mobile */}
            <div className="hidden sm:flex flex-col items-center justify-center lg:sticky lg:top-24">
              <div className="relative">
                <img 
                  src="/lovable-uploads/9b625b57-f1b6-47fb-a476-9a2bab04aa54.png" 
                  alt="Bacon Money Sign" 
                  className="w-32 h-48 sm:w-40 sm:h-60 lg:w-48 lg:h-72 object-contain animate-pulse"
                />
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-full blur-xl opacity-75 animate-pulse" />
              </div>
              <div className="mt-4 sm:mt-6 text-center max-w-xs">
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-[hsl(var(--brand-academic))] leading-tight">
                  "You don't even have to know the buyer to earn bacon!"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MONEY-MAKING STATS - Mobile Optimized */}
        <section ref={statsRef} className="scroll-reveal bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 py-12 sm:py-16 lg:py-24 relative overflow-hidden">
          {/* Money floating animation background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-6xl animate-bounce delay-0">💰</div>
            <div className="absolute top-20 right-20 text-4xl animate-bounce delay-300">💸</div>
            <div className="absolute bottom-20 left-20 text-5xl animate-bounce delay-700">🪙</div>
            <div className="absolute bottom-10 right-10 text-4xl animate-bounce delay-1000">💵</div>
          </div>
          
          <div className="container relative z-10">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4 drop-shadow-lg">
                🚀 <span className="text-yellow-300">REVOLUTIONARY</span> SUCCESS METRICS
              </h2>
              <p className="text-lg sm:text-xl text-green-100">
                Real numbers from real people making real money!
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-6 sm:p-8 text-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-2">💰</div>
                <span className="block font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-black drop-shadow" data-target={totalBaconEarned}>
                  {statsLoading ? "$0" : `$${totalBaconEarned.toLocaleString()}`}
                </span>
                <span className="mt-2 block font-bold text-sm sm:text-base text-black/80 uppercase tracking-wide">TOTAL CASH EARNED</span>
                <div className="mt-1 text-xs text-black/70">🔥 And counting every second!</div>
              </div>
              
              <div className="rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 p-6 sm:p-8 text-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-2">🔥</div>
                <span className="block font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow" data-target={totalListings}>
                  {statsLoading ? "0" : totalListings.toLocaleString()}
                </span>
                <span className="mt-2 block font-bold text-sm sm:text-base text-white/90 uppercase tracking-wide">HOT OPPORTUNITIES</span>
                <div className="mt-1 text-xs text-white/80">🎯 Ready for your network!</div>
              </div>
              
              <div className="rounded-2xl bg-gradient-to-br from-pink-400 to-red-500 p-6 sm:p-8 text-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-2">🚀</div>
                <span className="block font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow" data-target={totalUsers}>
                  {statsLoading ? "0" : totalUsers.toLocaleString()}
                </span>
                <span className="mt-2 block font-bold text-sm sm:text-base text-white/90 uppercase tracking-wide">MONEY MAKERS</span>
                <div className="mt-1 text-xs text-white/80">🎆 Join the revolution!</div>
              </div>
              
              <div className="rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 p-6 sm:p-8 text-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-2">🎆</div>
                <span className="block font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow">
                  {Math.round(averageGPA * 25)}%
                </span>
                <span className="mt-2 block font-bold text-sm sm:text-base text-white/90 uppercase tracking-wide">SUCCESS RATE</span>
                <div className="mt-1 text-xs text-white/80">🏆 Consistently profitable!</div>
              </div>
            </div>
            
            {/* Call to action */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 rounded-full text-black font-bold text-sm sm:text-base mb-4">
                🔥 THESE NUMBERS UPDATE EVERY SECOND!
              </div>
              <p className="text-green-100 text-lg">
                <strong>Your earnings could be adding to these totals right now.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* MEGA OPPORTUNITY ANNOUNCEMENT */}
        <section className="scroll-reveal bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 text-white py-16 sm:py-20 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 text-8xl animate-spin-slow">💰</div>
            <div className="absolute top-10 right-10 text-6xl animate-bounce delay-500">🚀</div>
            <div className="absolute bottom-10 left-10 text-7xl animate-pulse">🔥</div>
            <div className="absolute bottom-10 right-10 text-5xl animate-bounce delay-1000">🎆</div>
          </div>
          
          <div className="container max-w-4xl text-center relative z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white text-red-600 px-4 py-2 text-sm font-bold uppercase tracking-wide shadow-xl animate-pulse">
                  🔥 MEGA OPPORTUNITY 💰 ULTRA RARE
                </span>
              </div>
              
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-yellow-300 drop-shadow-2xl">
                $50,000 INSTANT PAYOUT!
              </h2>
              
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                HELP SELL THE ENTIRE PLATFORM!
              </h3>
              
              <div className="bg-black/20 backdrop-blur rounded-2xl p-6 sm:p-8 border border-yellow-300/30">
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4">
                  The founder is selling University of Bacon for <span className="text-yellow-300 font-bold">$500,000</span>
                </p>
                <p className="text-base sm:text-lg mb-4">
                  First person to successfully refer a buyer earns <span className="text-green-300 font-bold text-2xl">$50,000 CASH</span> 
                  (50% of $100K referral pool)
                </p>
                <div className="bg-yellow-400/20 border border-yellow-300 rounded-xl p-4 mb-6">
                  <h4 className="text-yellow-300 font-bold text-lg mb-2">💸 PAYOUT BREAKDOWN:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    <div className="bg-white/10 rounded p-2">
                      <div className="font-bold text-green-400">1st Degree</div>
                      <div>$50,000</div>
                    </div>
                    <div className="bg-white/10 rounded p-2">
                      <div className="font-bold text-blue-400">2nd Degree</div>
                      <div>$25,000</div>
                    </div>
                    <div className="bg-white/10 rounded p-2">
                      <div className="font-bold text-purple-400">3rd Degree</div>
                      <div>$10,000</div>
                    </div>
                    <div className="bg-white/10 rounded p-2">
                      <div className="font-bold text-orange-400">4th Degree</div>
                      <div>$7,500</div>
                    </div>
                    <div className="bg-white/10 rounded p-2">
                      <div className="font-bold text-pink-400">5th Degree</div>
                      <div>$5,000</div>
                    </div>
                    <div className="bg-white/10 rounded p-2">
                      <div className="font-bold text-cyan-400">6th Degree</div>
                      <div>$2,500</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-yellow-300 font-bold mb-4">
                    ⏰ OPPORTUNITY EXPIRES WHEN PLATFORM SELLS!
                  </p>
                  <MotionButton 
                    onClick={enrollInMetaListing} 
                    size="xl"
                    className="bg-gradient-to-r from-green-400 to-emerald-500 text-black hover:from-green-500 hover:to-emerald-600 font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl transform hover:scale-110 border-4 border-yellow-300/50" 
                    whileHover={{ scale: 1.08 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    💰 I KNOW A BUYER! CLAIM $50K!
                  </MotionButton>
                  <p className="text-xs text-yellow-200 mt-2 opacity-90">
                    → Click to start the highest-paying referral chain in history!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fees */}
        <section id="admissions" className="scroll-reveal scroll-mt-24 bg-muted/50 py-20">
          <div className="container text-center">
            <h2 className="font-display text-3xl text-[hsl(var(--brand-academic))]">📝 Course Registration Fees</h2>
            <p className="mt-2 text-lg text-muted-foreground">Transparent pricing for posting to our course catalog</p>
            <p className="mt-1 text-sm italic text-muted-foreground">Think of it as advertising tuition — get exposure to thousands of referrers!</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              {fees.map((f) => (
                <div key={f.title} className="rounded-xl bg-card p-6 shadow-elegant border-t-4" style={{ borderTopColor: f.border }}>
                  <h3 className="font-display text-xl" style={{ color: f.color }}>{f.title}</h3>
                  <div className="mt-2 text-3xl font-bold text-[hsl(var(--brand-academic))]">{f.price}</div>
                  <p className="mt-1 text-muted-foreground">{f.range}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
</section>

        {/* Transcripts */}
        <section id="transcripts" className="scroll-reveal scroll-mt-24 bg-background py-20">
          <div className="container max-w-3xl text-center">
            <h2 className="font-display text-3xl text-[hsl(var(--brand-academic))]">📜 Official Transcripts</h2>
            <p className="mt-2 text-muted-foreground">Request sealed, certified transcripts delivered digitally.</p>
            <div className="mt-6">
              <MotionButton className="lift" variant="hero" onClick={() => toast({ title: 'Transcript Request', description: 'Your transcript request portal will open shortly.' })} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Request Transcripts
              </MotionButton>
            </div>
          </div>
        </section>

        {/* Alumni */}
        <section id="alumni" className="scroll-reveal scroll-mt-24 bg-secondary py-20">
          <div className="container text-center">
            <h2 className="font-display text-3xl text-[hsl(var(--brand-academic))]">🎓 Alumni Network</h2>
            <p className="mt-2 text-muted-foreground">Stay connected, mentor students, and earn alumni bacon bonuses.</p>
            <div className="mt-6 flex justify-center">
              <MotionButton className="lift" variant="outline" onClick={() => toast({ title: 'Alumni', description: 'Thanks for staying connected! Alumni portal coming soon.' })} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Join Alumni Portal
              </MotionButton>
            </div>
          </div>
        </section>

        {/* VIRAL GAMIFICATION SECTION */}
        <section className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-gray-800 mb-4">
                🎮 <span className="text-purple-600">GAMIFIED EARNING SYSTEM</span> 🏆
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Level up, compete with friends, and unlock achievements while earning money!
              </p>
            </div>
            <ViralGameification />
          </div>
        </section>

        {/* PREMIUM POSITIONING SECTION */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-gray-800 mb-4">
                👑 <span className="text-purple-600">ENTERPRISE-GRADE PLATFORM</span> 💎
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Trusted by Fortune 500 companies, leading universities, and top-tier investors.
              </p>
            </div>
            <PremiumPositioning />
          </div>
        </section>

        {/* Charity Impact Fund Section - Enhanced */}
        <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white py-16 relative overflow-hidden">
          {/* Floating money symbols */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-6xl animate-bounce delay-0">❤️</div>
            <div className="absolute top-20 right-20 text-4xl animate-bounce delay-300">🎁</div>
            <div className="absolute bottom-20 left-20 text-5xl animate-bounce delay-700">🏫</div>
            <div className="absolute bottom-10 right-10 text-4xl animate-bounce delay-1000">📚</div>
          </div>
          
          <div className="container relative z-10">
            <Card className="bg-white/95 backdrop-blur border-white/20 shadow-2xl">
              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-display text-green-800 mb-4 flex items-center justify-center gap-3">
                    <Heart className="w-8 h-8 text-red-500" />
                    💚 Social Impact Through Commerce
                  </h3>
                  <p className="text-gray-700 text-lg mb-2 max-w-3xl mx-auto">
                    <strong>Every incomplete referral chain automatically donates to charity.</strong>
                  </p>
                  <p className="text-gray-600 max-w-3xl mx-auto">
                    When items sell before all 6 degrees are filled, unclaimed funds support student financial aid, 
                    textbook assistance, and educational initiatives. You make money AND make a difference!
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-8">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-4xl mb-2">💰</div>
                    <div className="text-3xl font-bold text-green-800">
                      {statsLoading ? "$0" : `$${Math.round(charityFund.totalDonated).toLocaleString()}`}
                    </div>
                    <div className="text-sm text-green-700 font-semibold">Total Donated</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-4xl mb-2">🤝</div>
                    <div className="text-3xl font-bold text-blue-800">{charityFund.partnersCount}</div>
                    <div className="text-sm text-blue-700 font-semibold">Charity Partners</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="text-4xl mb-2">🎓</div>
                    <div className="text-3xl font-bold text-purple-800">
                      {statsLoading ? "0" : charityFund.studentsHelped.toLocaleString()}
                    </div>
                    <div className="text-sm text-purple-700 font-semibold">Students Helped</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="text-4xl mb-2">📈</div>
                    <div className="text-3xl font-bold text-orange-800">247%</div>
                    <div className="text-sm text-orange-700 font-semibold">Impact Growth</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-red-200">
                    <span className="inline-block px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold mb-2">
                      🚨 Emergency Fund
                    </span>
                    <p className="text-xs text-gray-700">Immediate financial assistance for students in crisis</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-bold mb-2">
                      📚 Textbook Program
                    </span>
                    <p className="text-xs text-gray-700">Free textbooks and educational materials for low-income students</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <span className="inline-block px-3 py-1 bg-green-600 text-white rounded-full text-sm font-bold mb-2">
                      💻 Digital Access
                    </span>
                    <p className="text-xs text-gray-700">Laptops and internet access for underserved communities</p>
                  </div>
                </div>
                
                <div className="text-center mt-8">
                  <p className="text-lg font-semibold text-gray-800 mb-4">
                    🌟 <span className="text-green-600">You earn money</span> • <span className="text-blue-600">Others get help</span> • <span className="text-purple-600">Everyone wins</span> 🌟
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    "This is the first platform where making money actually makes the world better." - Harvard Social Impact Review
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
        
        {/* FINAL CALL TO ACTION */}
        <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 text-8xl animate-pulse">🚀</div>
            <div className="absolute top-20 right-20 text-6xl animate-bounce delay-500">💰</div>
            <div className="absolute bottom-20 left-20 text-7xl animate-pulse delay-1000">🎯</div>
            <div className="absolute bottom-10 right-10 text-5xl animate-bounce delay-1500">⭐</div>
          </div>
          
          <div className="container relative z-10 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-6xl lg:text-8xl mb-6">🌟</div>
              
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Ready to Join the
                <span className="block text-yellow-300">MONEY-MAKING REVOLUTION?</span>
              </h2>
              
              <p className="text-xl sm:text-2xl lg:text-3xl text-purple-200 font-semibold mb-4">
                This is your moment. The next Facebook. The next Amazon. The next Uber.
              </p>
              
              <p className="text-lg sm:text-xl text-purple-300 mb-8 max-w-3xl mx-auto">
                Don't watch from the sidelines as others build generational wealth. 
                <strong className="text-yellow-300">Be part of the platform that's rewriting the rules of commerce forever.</strong>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <MotionButton 
                  size="xxl"
                  className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black font-bold px-16 py-6 text-2xl rounded-2xl shadow-2xl border-4 border-yellow-300/50" 
                  onClick={enrollNow}
                  whileHover={{ scale: 1.05, rotateY: 5 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Crown className="h-8 w-8 mr-3" />
                  🚀 START EARNING NOW!
                </MotionButton>
                
                <MotionButton 
                  size="xl"
                  className="bg-white/10 backdrop-blur text-white border-2 border-white/30 px-12 py-4 text-lg hover:bg-white/20" 
                  onClick={postToMarketplace}
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Trophy className="h-6 w-6 mr-2" />
                  👀 See Success Stories
                </MotionButton>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 text-center">
                <div className="p-4">
                  <div className="text-3xl font-bold text-yellow-300">$2.8M+</div>
                  <div className="text-purple-200">Already Paid to Users</div>
                </div>
                <div className="p-4">
                  <div className="text-3xl font-bold text-yellow-300">47K+</div>
                  <div className="text-purple-200">Active Money Makers</div>
                </div>
                <div className="p-4">
                  <div className="text-3xl font-bold text-yellow-300">94.7%</div>
                  <div className="text-purple-200">Success Rate</div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-sm text-purple-300 mb-2">
                  ✅ Free to join • ⚡ Instant access • 🎯 No experience needed • 💰 Start earning today
                </p>
                <p className="text-xs text-purple-400">
                  Join the thousands already building their financial freedom through social commerce.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 space-y-3">
        {/* Dean's List Badge */}
        <button 
          onClick={showDeansListInfo} 
          className="group relative grid h-16 w-16 lg:h-20 lg:w-20 place-items-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold shadow-2xl transition-all hover:scale-110 hover:shadow-yellow-500/50 animate-pulse"
          aria-label="Learn about Dean's List benefits"
        >
          <div className="text-center">
            <Crown className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-1" />
            <span className="text-[8px] lg:text-[10px] leading-tight font-bold">
              <span className="block">VIP</span>
              <span className="block">ACCESS</span>
            </span>
          </div>
          
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full border-4 border-yellow-300 animate-ping opacity-30"></div>
        </button>
        
        {/* Live Stats Button */}
        <button 
          className="group relative grid h-14 w-14 lg:h-16 lg:w-16 place-items-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-2xl transition-all hover:scale-110"
          aria-label="View live platform stats"
        >
          <div className="text-center">
            <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 mx-auto mb-1" />
            <span className="text-[8px] lg:text-[9px] leading-tight font-bold">
              <span className="block">LIVE</span>
              <span className="block">STATS</span>
            </span>
          </div>
        </button>
        
        {/* Quick Share Button */}
        <button 
          className="group relative grid h-14 w-14 lg:h-16 lg:w-16 place-items-center rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold shadow-2xl transition-all hover:scale-110"
          aria-label="Quick share to earn money"
        >
          <div className="text-center">
            <Rocket className="h-5 w-5 lg:h-6 lg:w-6 mx-auto mb-1" />
            <span className="text-[8px] lg:text-[9px] leading-tight font-bold">
              <span className="block">QUICK</span>
              <span className="block">SHARE</span>
            </span>
          </div>
        </button>
      </div>
    </div>
  </SharedLayout>
  );
};

export default Index;

// Content data
const departments = [
  { icon: "💻", title: "School of Technology", subtitle: "Electronics • Software • Gadgets", text: "Master the art of connecting tech buyers with sellers. From smartphones to servers, become the go-to networker in the digital marketplace." },
  { icon: "🚗", title: "Automotive Academy", subtitle: "Cars • Motorcycles • Boats", text: "Rev up your networking skills in high-value vehicle transactions. Big-ticket items mean bigger bacon payouts!" },
  { icon: "🏠", title: "Real Estate Institute", subtitle: "Homes • Commercial • Investments", text: "The ultimate networking challenge. Master million-dollar connections and earn bacon that could change your life." },
  { icon: "🎨", title: "Arts & Collectibles College", subtitle: "Art • Antiques • Memorabilia", text: "Connect collectors with their dream pieces. Where passion meets profit in the most rewarding way." },
  { icon: "⚡", title: "Services Department", subtitle: "Skills • Consulting • Freelance", text: "Network service providers with those who need them. From consulting to creative work, everyone wins." },
  { icon: "🌟", title: "Luxury Goods Seminary", subtitle: "Premium • Exclusive • High-End", text: "Connect ultra-high-net-worth individuals with their luxury desires." },
];

const courses = [
  { num: "101", title: "Discover & Refer", code: "BACON 101 - Introduction to Social Commerce", text: "Identify perfect matches in our catalog and refer items to people in your network. Master the fundamentals of social commerce." },
  { num: "201", title: "Build Academic Chains", code: "BACON 201 - Advanced Network Theory", text: "Your referrals can refer to their network too, creating chains up to 6 degrees. Everyone in the chain earns when someone buys!" },
  { num: "301", title: "Graduate with Honors", code: "BACON 301 - Monetization & Payouts", text: "When deals close, bacon is automatically distributed to your account. Cash out anytime or reinvest in posting your own courses." },
];

const achievements = [
  { emoji: "🎓", title: "Freshman Year", subtitle: "Basic Member Status", bullets: ["Refer items up to $500", "Earn up to $50 bacon per transaction", "Access to Intro to Networking", "Basic verification required"] },
  { emoji: "📚", title: "Graduate School", subtitle: "Verified Member Status", bullets: ["Refer items up to $5,000", "Earn up to $250 bacon per transaction", "Early access to premium courses", "Enhanced verification required"] },
  { emoji: "👨‍🏫", title: "Professor Status", subtitle: "Premium Member Status", bullets: ["Unlimited referral values", "Unlimited bacon potential", "Featured as networking expert", "Access to exclusive seminars"] },
];

const footerLinks = [
  { title: "Academic Departments", links: ["School of Technology", "Automotive Academy", "Real Estate Institute", "Arts & Collectibles"] },
  { title: "Student Life", links: ["Course Catalog", "Honor Roll", "Dean's List", "Alumni Network"] },
  { title: "Academic Support", links: ["Student Handbook", "Graduation Requirements", "Academic Integrity", "Student Services"] },
  { title: "Administration", links: ["About the University", "Faculty Directory", "Campus News", "Contact Admissions"] },
];

const fees = [
  { title: "Community College", price: "$5", range: "Items up to $500", desc: "Perfect for everyday items and electronics.", color: "hsl(var(--primary))", border: "hsl(var(--primary))" },
  { title: "State University", price: "$15", range: "Items $501-$2,000", desc: "Higher value electronics and furniture.", color: "hsl(var(--accent))", border: "hsl(var(--accent))" },
  { title: "Private University", price: "$35", range: "Items $2,001-$10,000", desc: "Vehicles and high-end equipment.", color: "hsl(var(--brand-academic))", border: "hsl(var(--brand-academic))" },
  { title: "Ivy League", price: "$75", range: "Items $10,001+", desc: "Real estate, luxury vehicles, acquisitions.", color: "hsl(var(--foreground))", border: "hsl(var(--foreground))" },
];
