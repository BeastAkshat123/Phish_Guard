import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { UserScanHistory } from "@/components/UserScanHistory";
import { Shield, LogOut, History, Home } from "lucide-react";

export default function HistoryPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background relative pb-20 md:pb-0">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-border/50 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
          <div className="container px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">
                  <span className="text-primary">Phish</span>Guard
                </span>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/")}
                  className="font-mono text-sm text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/detect")}
                  className="font-mono text-sm text-muted-foreground hover:text-foreground"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Detect
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-sm text-primary"
                >
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-muted-foreground hidden sm:block">
                {user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="font-mono text-sm text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container px-4 py-12 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">
              <span className="text-primary cyber-text-glow">Scan</span> History
            </h1>
            <p className="text-muted-foreground font-mono max-w-md mx-auto">
              View all your previous phishing detection scans
            </p>
          </div>

          {/* History Table */}
          <UserScanHistory />
        </main>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden border-t border-border/50 backdrop-blur-sm bg-background/90 p-2">
          <div className="flex items-center justify-around">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Home className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/detect")}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">Detect</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <History className="h-5 w-5 text-primary" />
              <span className="text-xs font-mono text-primary">History</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
