import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SharedLayout } from "@/components/SharedLayout";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  location: string;
  terms: boolean;
}

const Admissions = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm<RegistrationForm>({
    mode: "onChange"
  });

  const watchedValues = watch();

  useEffect(() => {
    document.title = "Admissions | University of Bacon";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Join University of Bacon - Start earning through your network today!");
  }, []);

  const onSubmit = async (data: RegistrationForm) => {
    setIsSubmitting(true);
    
    try {
      // Actually create the Supabase account
      const { error } = await signUp(data.email, data.password);
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast.error("An account with this email already exists. Please try logging in instead.");
        } else {
          toast.error(`Account creation failed: ${error.message}`);
        }
        return;
      }
      
      toast.success("🎉 Welcome to University of Bacon!\n\nYour student account has been created successfully!\n\nCheck your email to verify your account.");
      
      // Redirect to auth page for login
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
      
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = isValid && watchedValues.terms;

  return (
    <SharedLayout showSidebar={false}>
      <main className="min-h-screen bg-background">
      {/* University Header */}
      <header className="bg-gradient-to-br from-[hsl(var(--brand-academic))] to-[hsl(var(--foreground))] text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(var(--primary))_0%,transparent_50%)] opacity-10"></div>
        <div className="container text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src="/lovable-uploads/4c9e5e09-0cd6-4c8b-9085-5ffc8177d095.png" 
              alt="University of Bacon crest logo"
              className="h-16 w-16 object-contain drop-shadow-lg"
              loading="eager" 
              decoding="async" 
            />
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white">University of Bacon</h1>
              <p className="text-lg opacity-90 italic text-white">Where Your Network Becomes Your Net Worth</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
          
          {/* Left Column - Information */}
          <div className="bg-card rounded-3xl p-8 shadow-elegant">
            <h1 className="font-display text-4xl text-[hsl(var(--brand-academic))] mb-4">Join the University</h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Start earning bacon from your network today! Share any item with unlimited earning potential - no caps, no limits, just pure networking rewards.
            </p>
            
            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="text-center p-6 bg-secondary/30 rounded-2xl hover-scale">
                <span className="text-5xl block mb-4">🔓</span>
                <h3 className="font-display text-[hsl(var(--brand-academic))] mb-2">Unlimited Sharing</h3>
                <p className="text-muted-foreground text-sm">Share any item of any value - no earning caps or restrictions</p>
              </div>
              
              <div className="text-center p-6 bg-secondary/30 rounded-2xl hover-scale">
                <span className="text-5xl block mb-4">⚡</span>
                <h3 className="font-display text-[hsl(var(--brand-academic))] mb-2">Instant Start</h3>
                <p className="text-muted-foreground text-sm">Start sharing immediately with just email verification</p>
              </div>
              
              <div className="text-center p-6 bg-secondary/30 rounded-2xl hover-scale">
                <span className="text-5xl block mb-4">🔒</span>
                <h3 className="font-display text-[hsl(var(--brand-academic))] mb-2">Secure Withdrawals</h3>
                <p className="text-muted-foreground text-sm">Easy verification when you're ready to cash out your bacon</p>
              </div>
              
              <div className="text-center p-6 bg-secondary/30 rounded-2xl hover-scale">
                <span className="text-5xl block mb-4">🎯</span>
                <h3 className="font-display text-[hsl(var(--brand-academic))] mb-2">Smart Matching</h3>
                <p className="text-muted-foreground text-sm">AI helps suggest perfect items for your network</p>
              </div>
            </div>
            
            {/* How It Works */}
            <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] p-8 rounded-2xl text-white mb-8">
              <h2 className="font-display text-3xl mb-6 text-center text-white">How It Works</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-white text-[hsl(var(--brand-academic))] font-display text-xl font-bold flex items-center justify-center mx-auto mb-4">1</div>
                  <div className="font-semibold mb-2 text-white">Create Account</div>
                  <p className="text-sm opacity-90 text-white">Quick email/phone verification to get started</p>
                </div>
                
                <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-white text-[hsl(var(--brand-academic))] font-display text-xl font-bold flex items-center justify-center mx-auto mb-4">2</div>
                  <div className="font-semibold mb-2 text-white">Share Items</div>
                  <p className="text-sm opacity-90 text-white">Find items your network would love and share them</p>
                </div>
                
                <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-white text-[hsl(var(--brand-academic))] font-display text-xl font-bold flex items-center justify-center mx-auto mb-4">3</div>
                  <div className="font-semibold mb-2 text-white">Build Chains</div>
                  <p className="text-sm opacity-90 text-white">Your contacts can share too, creating referral chains</p>
                </div>
                
                <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-white text-[hsl(var(--brand-academic))] font-display text-xl font-bold flex items-center justify-center mx-auto mb-4">4</div>
                  <div className="font-semibold mb-2 text-white">Earn Bacon</div>
                  <p className="text-sm opacity-90 text-white">Get paid when someone purchases through your chain</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Registration Form */}
          <div className="bg-card rounded-3xl p-6 shadow-elegant sticky top-8">
            <div className="text-center mb-6">
              <h2 className="font-display text-3xl text-[hsl(var(--brand-academic))] mb-2">Student Registration</h2>
              <p className="text-muted-foreground text-sm">Join 75,000+ students already earning bacon</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstName" className="text-[hsl(var(--brand-academic))] font-semibold">First Name</Label>
                  <Input {...register("firstName", { required: "First name is required" })} className="mt-1" />
                  {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>}
                </div>
                
                <div>
                  <Label htmlFor="lastName" className="text-[hsl(var(--brand-academic))] font-semibold">Last Name</Label>
                  <Input {...register("lastName", { required: "Last name is required" })} className="mt-1" />
                  {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>}
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-[hsl(var(--brand-academic))] font-semibold">Email Address</Label>
                  <Input type="email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} className="mt-1" />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-[hsl(var(--brand-academic))] font-semibold">Phone Number</Label>
                  <Input type="tel" {...register("phone", { required: "Phone number is required" })} className="mt-1" />
                  {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-[hsl(var(--brand-academic))] font-semibold">Password</Label>
                  <Input type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} className="mt-1" />
                  {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
                </div>
                
                <div>
                  <Label htmlFor="location" className="text-[hsl(var(--brand-academic))] font-semibold">Location</Label>
                  <Select onValueChange={(value) => setValue("location", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dallas-tx">Dallas, TX</SelectItem>
                      <SelectItem value="austin-tx">Austin, TX</SelectItem>
                      <SelectItem value="houston-tx">Houston, TX</SelectItem>
                      <SelectItem value="san-antonio-tx">San Antonio, TX</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Account Creation Notice */}
              <div className="bg-secondary/30 p-6 rounded-xl">
                <h3 className="font-display text-[hsl(var(--brand-academic))] mb-4 flex items-center gap-2">
                  🎓 Account Setup
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-[hsl(var(--brand-academic))]">Create Account</div>
                      <div className="text-sm text-muted-foreground">We'll create your student account instantly</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-[hsl(var(--brand-academic))]">Email Verification</div>
                      <div className="text-sm text-muted-foreground">Check your email to verify your account</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-[hsl(var(--brand-academic))]">Start Earning</div>
                      <div className="text-sm text-muted-foreground">Begin sharing and earning bacon immediately!</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Withdrawal Notice */}
              <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] p-6 rounded-xl text-white text-center">
                <div className="font-display text-lg mb-2 text-white">💰 Ready to Cash Out?</div>
                <p className="text-sm opacity-90 leading-relaxed text-white">
                  Start sharing immediately! When you're ready to withdraw your bacon earnings, 
                  we'll guide you through quick ID and bank verification for secure payouts.
                </p>
              </div>
              
              {/* Terms and Conditions */}
              <div className="flex items-start gap-3">
                <Checkbox {...register("terms", { required: "You must agree to the terms" })} className="mt-1" />
                <label className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the <a href="#" className="text-[hsl(var(--brand-academic))] hover:underline">Terms of Service</a> and{" "}
                  <a href="#" className="text-[hsl(var(--brand-academic))] hover:underline">Privacy Policy</a>. I understand that additional 
                  verification will be required to withdraw earnings.
                </label>
              </div>
              {errors.terms && <p className="text-destructive text-sm">{errors.terms.message}</p>}
              
              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-display bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] hover:opacity-90 rounded-full shadow-lg text-white"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "🎓 Create My Student Account"}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <a href="/auth" className="text-[hsl(var(--brand-academic))] font-semibold hover:underline">Sign In</a>
              </div>
            </form>
          </div>
          </div>
        </div>
      </main>
    </SharedLayout>
  );

};

export default Admissions;
