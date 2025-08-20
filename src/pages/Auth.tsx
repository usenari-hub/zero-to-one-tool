import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { SharedLayout } from "@/components/SharedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const { user, signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password reset state
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  useEffect(() => {
    // Redirect authenticated users to home
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    document.title = "Sign In | University of Bacon";
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(loginEmail, loginPassword);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error("Invalid email or password. Please check your credentials and try again.");
        } else if (error.message.includes('Email not confirmed')) {
          toast.error("Please check your email and click the verification link before logging in.");
        } else {
          toast.error(`Login failed: ${error.message}`);
        }
      } else {
        toast.success("Welcome back!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (signupPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(signupEmail, signupPassword);
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast.error("An account with this email already exists. Please try logging in instead.");
        } else {
          toast.error(`Signup failed: ${error.message}`);
        }
      } else {
        toast.success("Account created! Please check your email to verify your account before logging in.");
        // Switch to login tab
        setLoginEmail(signupEmail);
        setSignupEmail("");
        setSignupPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await resetPassword(resetEmail);
      
      if (error) {
        toast.error(`Password reset failed: ${error.message}`);
      } else {
        toast.success("Password reset email sent! Check your inbox.");
        setShowResetForm(false);
        setResetEmail("");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return null; // Will redirect
  }

  return (
    <SharedLayout showSidebar={false}>
      <main className="container max-w-md mx-auto py-16">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-[hsl(var(--brand-academic))] mb-4">
            University of Bacon
          </h1>
          <p className="text-muted-foreground">
            Access your student account or create a new one
          </p>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-center text-[hsl(var(--brand-academic))]">
              Student Portal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="loginEmail">Email</Label>
                    <Input
                      id="loginEmail"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="loginPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="loginPassword"
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowResetForm(true)}
                      className="text-sm text-[hsl(var(--brand-academic))] hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signupPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="signupPassword"
                        type={showSignupPassword ? "text" : "password"}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Create a password (min 6 characters)"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                      >
                        {showSignupPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            {/* Password Reset Form */}
            {showResetForm && (
              <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                <h3 className="font-medium text-[hsl(var(--brand-academic))] mb-4">
                  Reset Password
                </h3>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <Label htmlFor="resetEmail">Email Address</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Reset Email"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowResetForm(false);
                        setResetEmail("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Want the full registration experience?{" "}
                <a href="/admissions" className="text-[hsl(var(--brand-academic))] hover:underline">
                  Visit Admissions
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </SharedLayout>
  );
}