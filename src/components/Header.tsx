import { Shield, Terminal } from "lucide-react";

export function Header() {
  return (
    <header className="relative py-12 text-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150" />
            <div className="relative p-4 rounded-2xl cyber-border bg-card/50 backdrop-blur-sm animate-pulse-glow">
              <Shield className="h-16 w-16 text-primary cyber-text-glow" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-primary cyber-text-glow">Phish</span>
            <span className="text-foreground">Guard</span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm md:text-base max-w-lg mx-auto">
            Advanced phishing detection system powered by heuristic analysis
          </p>
        </div>

        {/* Terminal Style Info */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50 font-mono text-xs text-muted-foreground">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span className="text-primary">v1.0.0</span>
          <span className="text-border">|</span>
          <span>URL & Email Analysis</span>
          <span className="text-border">|</span>
          <span className="text-success">● Online</span>
        </div>
      </div>
    </header>
  );
}
