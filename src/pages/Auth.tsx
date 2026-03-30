import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/detect");
    }
  }, [user, navigate]);

  const validateForm = () => {
    try {
      authSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "email") fieldErrors.email = err.message;
          if (err.path[0] === "password") fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          console.error('Login error details:', error);
          if (error.message?.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else if (error.message?.includes("Email not confirmed")) {
            toast.error("Please confirm your email first. Check your inbox for the confirmation link.");
          } else if (error.message?.includes("failed to fetch") || error.message?.includes("fetch")) {
            toast.error("Connection failed. Check your internet or Supabase configuration.");
          } else {
            toast.error(error.message || "Sign in failed");
          }
        } else {
          toast.success("Welcome back!");
          navigate("/detect");
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          console.error('Signup error details:', error);
          if (error.message?.includes("already registered")) {
            toast.error("This email is already registered. Please sign in.");
          } else if (error.message?.includes("failed to fetch") || error.message?.includes("fetch")) {
            toast.error("Connection failed. Check your internet or Supabase configuration.");
          } else {
            toast.error(error.message || "Sign up failed");
          }
        } else {
          toast.success("Account created successfully!");
          navigate("/detect");
        }
      }
    } catch (error) {
      console.error('Auth exception:', error);
      const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="font-mono text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150" />
              <div className="relative p-4 rounded-2xl cyber-border bg-card/50 backdrop-blur-sm animate-pulse-glow">
                <Shield className="h-12 w-12 text-primary cyber-text-glow" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-primary cyber-text-glow">Phish</span>
              <span className="text-foreground">Guard</span>
            </h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </p>
          </div>
        </div>

        {/* Auth Form */}
        <div className="cyber-border bg-card/80 backdrop-blur-sm rounded-xl p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono text-sm text-muted-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 bg-background/50 border-border/50 font-mono"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-xs font-mono">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-mono text-sm text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-background/50 border-border/50 font-mono"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs font-mono">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono font-semibold tracking-wider cyber-glow transition-all duration-300 hover:cyber-glow-strong"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground font-mono">OR</span>
            </div>
          </div>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs font-mono text-muted-foreground/60">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
}
