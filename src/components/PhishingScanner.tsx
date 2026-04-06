import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, Loader2, Search, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { detectPhishing } from "@/lib/phishingDetection";
import { UserScanHistoryRef } from "./UserScanHistory";
import { SecurityScanner } from "./SecurityScanner";

interface ScanResult {
  result: "safe" | "phishing" | "suspicious";
  confidence: number;
  riskFactors: string[];
  inputType: "url" | "email";
}

interface PhishingScannerProps {
  onScanningChange?: (isScanning: boolean) => void;
}

export function PhishingScanner({ onScanningChange }: PhishingScannerProps) {
  const [input, setInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showVulnCheck, setShowVulnCheck] = useState(false);
  const { user } = useAuth();

  const handleScan = async () => {
    if (!input.trim()) {
      toast.error("Please enter a URL or email text to analyze");
      return;
    }

    setIsScanning(true);
    onScanningChange?.(true);
    setResult(null);
    setShowVulnCheck(false);

    try {
      // Perform local phishing detection
      const detectionResult = detectPhishing(input.trim());

      // Save to database
      if (user?.id) {
        console.log('Saving scan for user:', user.id);
        const { data, error: dbError } = await supabase
          .from('scan_history')
          .insert({
            user_id: user.id,
            input_text: input.trim().substring(0, 2000),
            input_type: detectionResult.inputType,
            result: detectionResult.result,
            confidence: Math.round(detectionResult.confidence),
            risk_factors: detectionResult.riskFactors,
          })
          .select();

        if (dbError) {
          console.error('Database insert error:', dbError);
          toast.error(`Failed to save scan: ${dbError.message}`);
        } else {
          console.log('Scan saved successfully:', data);
        }
      } else {
        console.warn('No user ID available, scan not saved');
      }

      setResult(detectionResult);
      toast.success("Scan completed successfully");

      // Trigger history refresh
      if (UserScanHistoryRef.current) {
        setTimeout(() => {
          UserScanHistoryRef.current?.();
        }, 500);
      }
    } catch (error) {
      console.error("Scan error:", error);
      toast.error("Failed to analyze. Please try again.");
    } finally {
      setIsScanning(false);
      onScanningChange?.(false);
    }
  };

  // Check if the input looks like a URL (for vulnerability check eligibility)
  const isInputUrl = (text: string): boolean => {
    const trimmed = text.trim().toLowerCase();
    return trimmed.startsWith('http://') || trimmed.startsWith('https://') || /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}/.test(trimmed);
  };

  // Show vulnerability check button when: safe result, ≥80% confidence, and input is a URL
  const canCheckVulnerabilities = result &&
    result.result === "safe" &&
    result.confidence >= 80 &&
    isInputUrl(input);

  const getResultStyles = () => {
    if (!result) return {};

    switch (result.result) {
      case "safe":
        return {
          icon: CheckCircle,
          bgClass: "bg-success/10 border-success/30",
          textClass: "text-success",
          glowClass: "shadow-[0_0_30px_hsl(var(--success)/0.3)]",
          label: "SAFE",
        };
      case "phishing":
        return {
          icon: AlertTriangle,
          bgClass: "bg-destructive/10 border-destructive/30",
          textClass: "text-destructive",
          glowClass: "shadow-[0_0_30px_hsl(var(--destructive)/0.3)]",
          label: "PHISHING DETECTED",
        };
      case "suspicious":
        return {
          icon: Shield,
          bgClass: "bg-warning/10 border-warning/30",
          textClass: "text-warning",
          glowClass: "shadow-[0_0_30px_hsl(var(--warning)/0.3)]",
          label: "SUSPICIOUS",
        };
    }
  };

  const resultStyles = getResultStyles();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Input Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/5 blur-xl rounded-3xl" />
        <div className="relative cyber-border bg-card/80 backdrop-blur-sm rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
            <span className="text-primary">$</span>
            <span>Enter URL or paste email content for analysis</span>
          </div>

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://suspicious-link.com/login&#10;&#10;or paste email content here..."
            className="min-h-[120px] bg-background/50 border-border/50 font-mono text-sm placeholder:text-muted-foreground/50 focus:ring-primary/50 resize-none"
          />

          <Button
            onClick={handleScan}
            disabled={isScanning || !input.trim()}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono font-semibold tracking-wider cyber-glow transition-all duration-300 hover:cyber-glow-strong"
            size="lg"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                SCANNING...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                CHECK SAFETY
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Scanning Animation */}
      {isScanning && (
        <div className="cyber-border bg-card/80 backdrop-blur-sm rounded-xl p-8 text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-2 border-2 border-primary/20 rounded-full" />
            <div className="absolute inset-4 border-2 border-primary/40 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <Shield className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="font-mono text-primary text-sm animate-pulse">
            Analyzing threat patterns...
          </p>
        </div>
      )}

      {/* Result Display */}
      {result && resultStyles && (
        <div className={`cyber-border ${resultStyles.bgClass} ${resultStyles.glowClass} backdrop-blur-sm rounded-xl p-6 space-y-6 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4`}>
          {/* Result Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${resultStyles.bgClass}`}>
                <resultStyles.icon className={`h-8 w-8 ${resultStyles.textClass}`} />
              </div>
              <div>
                <h3 className={`font-mono font-bold text-xl ${resultStyles.textClass}`}>
                  {resultStyles.label}
                </h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {result.inputType === "url" ? "URL Analysis" : "Email Analysis"}
                </p>
              </div>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-mono">
              <span className="text-muted-foreground">Confidence Level</span>
              <span className={resultStyles.textClass}>{result.confidence}%</span>
            </div>
            <div className="h-3 bg-background/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${result.result === "safe"
                    ? "bg-success"
                    : result.result === "phishing"
                      ? "bg-destructive"
                      : "bg-warning"
                  }`}
                style={{
                  width: `${result.confidence}%`,
                  animation: 'progress-fill 1s ease-out forwards',
                }}
              />
            </div>
          </div>

          {/* Risk Factors */}
          {result.riskFactors.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-mono text-sm text-muted-foreground flex items-center gap-2">
                <span className="text-primary">&gt;</span>
                {result.result === "safe" ? "Security Checks Passed" : "Risk Factors Detected"}
              </h4>
              <ul className="space-y-2">
                {result.riskFactors.map((factor, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm font-mono bg-background/30 rounded-lg p-3"
                  >
                    <span className={`mt-0.5 ${resultStyles.textClass}`}>•</span>
                    <span className="text-foreground/90">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.result === "safe" && result.riskFactors.length === 0 && (
            <div className="bg-background/30 rounded-lg p-4 text-center">
              <p className="text-sm font-mono text-muted-foreground">
                No suspicious indicators detected. The content appears to be legitimate.
              </p>
            </div>
          )}

          {/* Vulnerability Check CTA — shown when safe ≥80% and input is URL */}
          {canCheckVulnerabilities && !showVulnCheck && (
            <div className="border-t border-success/20 pt-5">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center space-y-3">
                <div className="inline-flex p-2.5 rounded-lg bg-primary/10">
                  <Scan className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-mono font-semibold text-sm">
                  This URL is safe — want to check for vulnerabilities?
                </h4>
                <p className="font-mono text-xs text-muted-foreground max-w-md mx-auto">
                  Run a deep security analysis to check SSL, headers, cookies, open redirects, and more
                </p>
                <Button
                  onClick={() => setShowVulnCheck(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono font-semibold tracking-wider cyber-glow transition-all duration-300 hover:cyber-glow-strong"
                >
                  <Scan className="mr-2 h-4 w-4" />
                  CHECK VULNERABILITIES
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inline Vulnerability Scanner — shown after clicking the button */}
      {showVulnCheck && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold font-mono">
              <span className="text-primary cyber-text-glow">Checking</span> Vulnerabilities
            </h3>
            <p className="text-muted-foreground font-mono text-xs">
              Comprehensive security analysis for the scanned URL
            </p>
          </div>
          <SecurityScanner prefillUrl={input.trim()} autoStart />
        </div>
      )}
    </div>
  );
}
