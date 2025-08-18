import { ReactNode, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/AuthProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

interface SharedLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function SharedLayout({ children, showSidebar = true }: SharedLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // Theme toggle state
  // The site supports both light and dark modes. Persist the user's
  // preference to localStorage and apply it to the <html> element. When the
  // value changes we update the class on document.documentElement.  The
  // default is to read from localStorage if available, otherwise fallback
  // to 'light'.
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") ?? "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  
  const { user, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();
  
  const defaultSidebarOpen = typeof window !== "undefined" ? (localStorage.getItem("sidebar:open") ?? "true") === "true" : true;
  
  const sections = [
    { id: "listings", label: "Listings", path: "/listings" },
    { id: "admissions", label: "Admissions", path: "/admissions" },
    { id: "study-guides", label: "Study Guides", path: "/study-guides" },
    { id: "alumni", label: "Alumni", path: "/alumni" },
  ];

  // Navbar scrolled effect
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAuth = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = authTab === "signin" 
        ? await signIn(email, password)
        : await signUp(email, password);
      
      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setAuthModalOpen(false);
        toast({
          title: authTab === "signin" ? "Welcome back!" : "Account created!",
          description: authTab === "signin" 
            ? "You're now signed in." 
            : "Check your email for verification instructions.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
  };

  const layoutContent = (
    <div className="min-h-screen bg-background">
      {/* Top ribbon header with crest - Mobile Optimized */}
      <header className="w-full border-b">
        <div className="container py-2 sm:py-3 text-center">
          <div className="inline-flex items-center gap-2 sm:gap-3">
            <img src="/lovable-uploads/4c9e5e09-0cd6-4c8b-9085-5ffc8177d095.png" alt="University of Bacon crest logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain drop-shadow" loading="eager" decoding="async" />
            <div className="text-left">
              <div className="font-display text-base sm:text-lg leading-tight text-[hsl(var(--brand-academic))]">University of Bacon</div>
              <div className="text-xs italic text-muted-foreground hidden sm:block">Where Network = Net Worth</div>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky nav - Mobile Optimized */}
      <nav className={`sticky top-0 z-50 border-b bg-[hsl(var(--brand-academic))]/95 backdrop-blur ${navScrolled ? "nav-scrolled" : ""}`}>
        <div className="container flex items-center justify-between py-2 sm:py-3">
          <div className="flex items-center gap-2">
            {showSidebar && <SidebarTrigger className="hidden md:inline-flex text-background touch-target" />}
            <Link to="/" className="font-display text-accent inline-flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <span className="animate-[graduation-bob_3s_ease-in-out_infinite]">🎓</span> 
              <span className="hidden sm:inline">University of Bacon</span>
              <span className="sm:hidden">UofB</span>
            </Link>
          </div>
          
          {/* Mobile Menu Overlay */}
          {mobileOpen && (
            <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
          )}
          
          {/* Navigation Menu */}
          <div className={`
            md:flex md:items-center md:gap-6 md:font-semibold md:text-background md:static md:bg-transparent
            ${mobileOpen 
              ? "fixed top-0 right-0 h-full w-64 bg-[hsl(var(--brand-academic))] p-4 pt-16 z-50 animate-slide-in-right" 
              : "hidden"
            }
          `}>
            <ul className="flex flex-col md:flex-row gap-3 md:gap-6 font-semibold text-background">
              <li><Link className="mobile-nav-item md:story-link" to="/listings" onClick={() => setMobileOpen(false)}>Listings</Link></li>
              <li><Link className="mobile-nav-item md:story-link" to="/study-guides" onClick={() => setMobileOpen(false)}>Study Guides</Link></li>
              <li><Link className="mobile-nav-item md:story-link" to="/admissions" onClick={() => setMobileOpen(false)}>Admissions</Link></li>
              <li><Link className="mobile-nav-item md:story-link" to="/alumni" onClick={() => setMobileOpen(false)}>Alumni</Link></li>
              {user && <li><Link className="mobile-nav-item md:story-link" to="/account" onClick={() => setMobileOpen(false)}>Account</Link></li>}
              <li><Link className="mobile-nav-item md:story-link" to="/terms" onClick={() => setMobileOpen(false)}>Terms</Link></li>
            </ul>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-background text-xs sm:text-sm hidden sm:inline">
                  Welcome, {user.email?.split('@')[0]}!
                </span>
                <Button variant="secondary" size="sm" onClick={handleSignOut} className="mobile-button">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setAuthModalOpen(true)}
                className="mobile-button"
              >
                Sign In
              </Button>
            )}

            {/* Theme toggle button: shows a moon in light mode and a sun in dark mode. */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="mobile-button"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <div className="md:hidden">
              <Select onValueChange={(val) => navigate(val)}>
                <SelectTrigger className="w-20 sm:w-24 bg-background/90 text-foreground text-xs">
                  <SelectValue placeholder="Menu" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background border shadow-lg">
                  {sections.map((s) => (
                    <SelectItem key={s.id} value={s.path}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <button 
              className="md:hidden text-background text-xl sm:text-2xl touch-target flex items-center justify-center" 
              onClick={() => setMobileOpen((o) => !o)} 
              aria-label="Toggle navigation"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      {children}
      
      {/* Auth Modal */}
      <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Access Your Student Account</DialogTitle>
          </DialogHeader>
          
          <Tabs value={authTab} onValueChange={(value) => setAuthTab(value as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <AuthForm 
                title="Welcome Back!" 
                buttonText="Sign In"
                onSubmit={handleAuth}
                loading={loading}
              />
            </TabsContent>
            
            <TabsContent value="signup">
              <AuthForm 
                title="Join the University" 
                buttonText="Create Account"
                onSubmit={handleAuth}
                loading={loading}
                isSignup
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );

  if (showSidebar) {
    return (
      <SidebarProvider defaultOpen={defaultSidebarOpen}>
        <AppSidebar />
        <SidebarInset>
          {layoutContent}
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return layoutContent;
}

interface AuthFormProps {
  title: string;
  buttonText: string;
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
  isSignup?: boolean;
}

function AuthForm({ title, buttonText, onSubmit, loading, isSignup }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="font-display text-xl text-[hsl(var(--brand-academic))]">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {isSignup ? "Start earning bacon through your network" : "Continue your academic journey"}
        </p>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || !email || !password}
      >
        {loading ? "Loading..." : buttonText}
      </Button>
      
      {isSignup && (
        <p className="text-xs text-muted-foreground text-center">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      )}
    </form>
  );
}