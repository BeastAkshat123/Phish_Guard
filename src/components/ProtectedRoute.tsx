import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Shield } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150" />
            <div className="relative p-4 rounded-2xl cyber-border bg-card/50 backdrop-blur-sm">
              <Shield className="h-12 w-12 text-primary animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground font-mono text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Authenticating...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
