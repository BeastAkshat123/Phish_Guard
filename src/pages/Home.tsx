import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Search, History, ChevronRight, Zap, Eye, Database, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Search,
      title: "Phishing Detection",
      description: "Deep scan URLs & emails for phishing patterns, suspicious TLDs, and typosquatting attacks",
    },
    {
      icon: Shield,
      title: "Vulnerability Check",
      description: "Analyze safe websites for SSL, security headers, open redirects, and vulnerability indicators",
    },
    {
      icon: Zap,
      title: "Real-time Analysis",
      description: "Get instant results with confidence scores, security grades, and detailed findings",
    },
    {
      icon: Eye,
      title: "Email Inspection",
      description: "Detect phishing emails by analyzing urgency language and embedded links",
    },
    {
      icon: LayoutDashboard,
      title: "Analytics Dashboard",
      description: "Visualize your security data with charts, grade distributions, and trend analysis",
    },
    {
      icon: Database,
      title: "Scan History",
      description: "Track all phishing and vulnerability scans with detailed logs and management",
    },
  ];

  const detectionMethods = [
    "HTTPS protocol verification",
    "Suspicious keyword scanning",
    "Typosquatting pattern matching",
    "Email urgency language detection",
    "SSL / TLS encryption analysis",
    "Security headers assessment",
    "Open redirect detection",
    "Information disclosure scanning",
    "Cookie security audit",
    "Domain reputation checking",
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-border/50 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
          <div className="container px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">
                <span className="text-primary">Phish</span>Guard
              </span>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <Button
                  onClick={() => navigate("/detect")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono"
                >
                  Go to Scanner
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/auth")}
                    className="font-mono text-sm"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => navigate("/auth")}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Logo */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
                  <div className="relative p-6 rounded-3xl cyber-border bg-card/50 backdrop-blur-sm animate-pulse-glow">
                    <Shield className="h-20 w-20 text-primary cyber-text-glow" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  <span className="text-primary cyber-text-glow">Phish</span>
                  <span className="text-foreground">Guard</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-mono max-w-2xl mx-auto">
                  Phishing detection + website security scanning — powered by heuristic analysis
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => navigate(user ? "/detect" : "/auth")}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono font-semibold tracking-wider cyber-glow transition-all duration-300 hover:cyber-glow-strong px-8"
                >
                  <Lock className="mr-2 h-5 w-5" />
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                  className="font-mono border-border/50 hover:bg-card/50"
                >
                  Learn More
                </Button>
              </div>


            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 border-t border-border/50">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                <span className="text-primary">#</span> Features
              </h2>
              <p className="text-muted-foreground font-mono max-w-xl mx-auto">
                Comprehensive phishing detection with multiple analysis layers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="cyber-border bg-card/50 backdrop-blur-sm rounded-xl p-6 space-y-4 hover:bg-card/80 transition-all duration-300 group"
                >
                  <div className="p-3 rounded-lg bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detection Methods Section */}
        <section className="py-20 border-t border-border/50">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  <span className="text-primary">&gt;</span> Detection Methods
                </h2>
                <p className="text-muted-foreground font-mono">
                  Multi-layered heuristic analysis across phishing detection and website security scanning
                </p>
              </div>

              <div className="cyber-border bg-card/50 backdrop-blur-sm rounded-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detectionMethods.map((method, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors"
                    >
                      <span className="text-primary font-mono">•</span>
                      <span className="font-mono text-sm text-foreground/90">{method}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t border-border/50">
          <div className="container px-4">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <h2 className="text-3xl font-bold">
                Ready to <span className="text-primary">protect</span> yourself?
              </h2>
              <p className="text-muted-foreground font-mono">
                Start scanning URLs and emails for phishing threats today
              </p>
              <Button
                onClick={() => navigate(user ? "/detect" : "/auth")}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono font-semibold tracking-wider cyber-glow transition-all duration-300 hover:cyber-glow-strong px-8"
              >
                <Shield className="mr-2 h-5 w-5" />
                Start Scanning Now
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8">
          <div className="container px-4 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm">PhishGuard</span>
            </div>
            <p className="font-mono text-xs text-muted-foreground/60">
              Cybersecurity Platform — Phishing Detection + Vulnerability Analysis
            </p>
            <div className="flex items-center justify-center gap-4 text-xs font-mono text-muted-foreground/50">
              <span>React + TypeScript</span>
              <span className="text-border">|</span>
              <span>Supabase Backend</span>
              <span className="text-border">|</span>
              <span>Heuristic Analysis</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
