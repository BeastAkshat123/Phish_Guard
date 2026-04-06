import { useState, useEffect } from "react";
import { Shield, AlertTriangle, CheckCircle, Loader2, Search, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { performSecurityScan, type SecurityScanResult, type SeverityLevel, type GradeLevel } from "@/lib/secureScan";

interface SecurityScannerProps {
  onScanComplete?: () => void;
  prefillUrl?: string;
  autoStart?: boolean;
}

const GRADE_COLORS: Record<GradeLevel, string> = {
  A: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  B: "text-lime-400 border-lime-400/40 bg-lime-400/10",
  C: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  D: "text-orange-400 border-orange-400/40 bg-orange-400/10",
  F: "text-red-400 border-red-400/40 bg-red-400/10",
};

const GRADE_GLOW: Record<GradeLevel, string> = {
  A: "shadow-[0_0_40px_rgba(52,211,153,0.3)]",
  B: "shadow-[0_0_40px_rgba(163,230,53,0.3)]",
  C: "shadow-[0_0_40px_rgba(250,204,21,0.3)]",
  D: "shadow-[0_0_40px_rgba(251,146,60,0.3)]",
  F: "shadow-[0_0_40px_rgba(248,113,113,0.3)]",
};

const SEVERITY_BADGE: Record<SeverityLevel, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  info: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const STATUS_ICON: Record<string, string> = {
  pass: "✅",
  warn: "⚠️",
  fail: "❌",
};

const SCAN_STEPS = [
  "Checking SSL / TLS encryption...",
  "Analyzing security headers...",
  "Inspecting cookie security...",
  "Scanning for mixed content...",
  "Evaluating domain reputation...",
  "Fingerprinting technologies...",
  "Testing for open redirects...",
  "Checking information disclosure...",
  "Analyzing subdomain structure...",
];

export function SecurityScanner({ onScanComplete, prefillUrl, autoStart }: SecurityScannerProps) {
  const [targetUrl, setTargetUrl] = useState(prefillUrl || "");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<SecurityScanResult | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  const { user } = useAuth();

  // Auto-start scan when prefillUrl is provided
  useEffect(() => {
    if (autoStart && prefillUrl && !hasAutoStarted) {
      setHasAutoStarted(true);
      setTargetUrl(prefillUrl);
      // Small delay to allow component to mount
      setTimeout(() => handleScan(prefillUrl), 100);
    }
  }, [autoStart, prefillUrl]);

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleScan = async (urlOverride?: string) => {
    const url = urlOverride || targetUrl;
    if (!url.trim()) {
      toast.error("Please enter a URL to scan");
      return;
    }

    setIsScanning(true);
    setResult(null);
    setScanStep(0);
    setExpandedCategories(new Set());

    // Simulate step-by-step scanning for dramatic effect
    for (let i = 0; i < SCAN_STEPS.length; i++) {
      setScanStep(i);
      await new Promise(r => setTimeout(r, 350 + Math.random() * 300));
    }

    try {
      const scanResult = performSecurityScan(url.trim());

      // Save to database
      if (user?.id) {
        const { error: dbError } = await supabase
          .from("security_scans" as any)
          .insert({
            user_id: user.id,
            target_url: scanResult.targetUrl.substring(0, 2000),
            overall_grade: scanResult.overallGrade,
            overall_score: scanResult.overallScore,
            findings: scanResult.findings as any,
            scan_categories: scanResult.categories as any,
          } as any);

        if (dbError) {
          console.error("Error saving security scan:", dbError);
          // Don't block the scan result — just log it
        }
      }

      setResult(scanResult);
      toast.success("Vulnerability check completed");
      onScanComplete?.();
    } catch (error) {
      console.error("Scan error:", error);
      toast.error("Failed to complete the scan. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Input — hidden if prefillUrl is provided */}
      {!prefillUrl && (
        <div className="relative">
          <div className="absolute inset-0 bg-primary/5 blur-xl rounded-3xl" />
          <div className="relative cyber-border bg-card/80 backdrop-blur-sm rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
              <Globe className="h-4 w-4 text-primary" />
              <span>Enter a website URL to check for vulnerabilities</span>
            </div>

            <div className="flex gap-3">
              <Input
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 bg-background/50 border-border/50 font-mono text-sm placeholder:text-muted-foreground/50 focus:ring-primary/50"
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                disabled={isScanning}
              />
              <Button
                onClick={() => handleScan()}
                disabled={isScanning || !targetUrl.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono font-semibold tracking-wider cyber-glow transition-all duration-300 hover:cyber-glow-strong px-6"
              >
                {isScanning ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    SCAN
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Scanning Progress */}
      {isScanning && (
        <div className="cyber-border bg-card/80 backdrop-blur-sm rounded-xl p-8 space-y-6">
          {/* Animated radar */}
          <div className="relative w-28 h-28 mx-auto">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-3 border-2 border-primary/10 rounded-full" />
            <div className="absolute inset-3 border-2 border-primary/30 border-b-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            <div className="absolute inset-6 border border-primary/20 rounded-full" />
            <Shield className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
          </div>

          {/* Current step */}
          <div className="text-center space-y-3">
            <p className="font-mono text-primary text-sm animate-pulse">
              {SCAN_STEPS[scanStep]}
            </p>
            {/* Progress bar */}
            <div className="w-full max-w-xs mx-auto h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }}
              />
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Step {scanStep + 1} of {SCAN_STEPS.length}
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Grade Card */}
          <div className={`cyber-border rounded-xl p-8 text-center ${GRADE_COLORS[result.overallGrade]} ${GRADE_GLOW[result.overallGrade]} backdrop-blur-sm transition-all duration-500`}>
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl border-2 border-current/40 bg-current/5">
                <span className="text-5xl font-bold font-mono">{result.overallGrade}</span>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-2xl font-bold">Security Score: {result.overallScore}/100</p>
                <p className="font-mono text-sm opacity-80">{result.targetUrl}</p>
              </div>
              <p className="font-mono text-sm max-w-lg mx-auto opacity-70">{result.summary}</p>
            </div>
          </div>

          {/* Category Results */}
          <div className="space-y-3">
            <h3 className="font-mono text-sm font-semibold text-primary flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Scan Categories
            </h3>

            {result.categories.map((cat) => (
              <div key={cat.name} className="cyber-border bg-card/60 backdrop-blur-sm rounded-xl overflow-hidden">
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(cat.name)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="font-mono text-sm font-medium">{cat.name}</span>
                    <span className="text-xs">{STATUS_ICON[cat.status]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            cat.score >= 80 ? "bg-emerald-400" :
                            cat.score >= 60 ? "bg-yellow-400" :
                            cat.score >= 40 ? "bg-orange-400" : "bg-red-400"
                          }`}
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground w-8">{cat.score}%</span>
                    </div>
                    {cat.findings.length > 0 && (
                      expandedCategories.has(cat.name) ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )
                    )}
                  </div>
                </button>

                {/* Expanded findings */}
                {expandedCategories.has(cat.name) && cat.findings.length > 0 && (
                  <div className="border-t border-border/30 p-4 space-y-3">
                    {cat.findings.map((finding, i) => (
                      <div key={i} className="bg-background/30 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-mono font-medium border ${SEVERITY_BADGE[finding.severity]}`}>
                            {finding.severity.toUpperCase()}
                          </span>
                          <span className="font-mono text-sm font-medium text-foreground/90">{finding.title}</span>
                        </div>
                        <p className="font-mono text-xs text-muted-foreground leading-relaxed">{finding.description}</p>
                        <div className="flex items-start gap-2 bg-primary/5 rounded-lg p-3 mt-2">
                          <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                          <p className="font-mono text-xs text-primary/80 leading-relaxed">
                            <span className="font-semibold">Remediation:</span> {finding.remediation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {expandedCategories.has(cat.name) && cat.findings.length === 0 && (
                  <div className="border-t border-border/30 p-4 text-center">
                    <p className="font-mono text-xs text-muted-foreground">No issues detected in this category.</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Findings Summary */}
          {result.findings.length > 0 && (
            <div className="cyber-border bg-card/60 backdrop-blur-sm rounded-xl p-6 space-y-3">
              <h3 className="font-mono text-sm font-semibold text-primary flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Findings Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(["critical", "high", "medium", "low", "info"] as SeverityLevel[]).map((sev) => {
                  const count = result.findings.filter(f => f.severity === sev).length;
                  return (
                    <div key={sev} className={`text-center p-3 rounded-lg border ${SEVERITY_BADGE[sev]}`}>
                      <p className="font-mono text-xl font-bold">{count}</p>
                      <p className="font-mono text-xs capitalize">{sev}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
