import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { SecurityScanner } from "@/components/SecurityScanner";
import { SecurityScanHistory } from "@/components/SecurityScanHistory";
import { Shield, LogOut, Home, History, Globe, Search, LayoutDashboard } from "lucide-react";

export default function SecureScan() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

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
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px]" />
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
                  <Search className="h-4 w-4 mr-2" />
                  Phish Detect
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-sm text-primary"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Secure Scan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="font-mono text-sm text-muted-foreground hover:text-foreground"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/history")}
                  className="font-mono text-sm text-muted-foreground hover:text-foreground"
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
              <span className="text-primary cyber-text-glow">Secure</span> Scan
            </h1>
            <p className="text-muted-foreground font-mono max-w-lg mx-auto">
              Analyze websites for security vulnerabilities — SSL, headers, cookies, open redirects, and more
            </p>
          </div>

          {/* Scanner */}
          <SecurityScanner onScanComplete={() => setRefreshKey(k => k + 1)} />

          {/* Scan Features Info */}
          <section className="max-w-3xl mx-auto">
            <div className="cyber-border bg-card/50 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-mono text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Security Checks Performed
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm font-mono text-muted-foreground">
                {[
                  "🔒 SSL / TLS encryption",
                  "🛡️ Security headers analysis",
                  "🍪 Cookie security audit",
                  "⚡ Mixed content detection",
                  "🌐 Domain reputation check",
                  "⚙️ Technology fingerprinting",
                  "↪️ Open redirect testing",
                  "📄 Information disclosure scan",
                  "🔗 Subdomain structure analysis",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/20 transition-colors">
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Security Scan History */}
          <section className="w-full pt-8 border-t border-border/30">
            <SecurityScanHistory key={refreshKey} />
          </section>
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
              <Search className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">Phish</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Globe className="h-5 w-5 text-primary" />
              <span className="text-xs font-mono text-primary">Scan</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">Dash</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/history")}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <History className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">History</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
