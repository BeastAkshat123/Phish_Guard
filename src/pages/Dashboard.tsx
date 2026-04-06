import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Shield, LogOut, Home, History, Search, LayoutDashboard,
  Activity, CheckCircle, AlertTriangle, TrendingUp, ArrowRight,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface PhishingStats {
  total: number;
  safe: number;
  phishing: number;
  suspicious: number;
}

interface SecurityStats {
  total: number;
  gradeA: number;
  gradeB: number;
  gradeC: number;
  gradeD: number;
  gradeF: number;
}

const PIE_COLORS = ["#34d399", "#f87171", "#fbbf24"];
const GRADE_COLORS_MAP: Record<string, string> = {
  A: "#34d399", B: "#a3e635", C: "#facc15", D: "#fb923c", F: "#f87171",
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [phishingStats, setPhishingStats] = useState<PhishingStats>({ total: 0, safe: 0, phishing: 0, suspicious: 0 });
  const [securityStats, setSecurityStats] = useState<SecurityStats>({ total: 0, gradeA: 0, gradeB: 0, gradeC: 0, gradeD: 0, gradeF: 0 });
  const [recentPhishing, setRecentPhishing] = useState<any[]>([]);
  const [recentSecurity, setRecentSecurity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Phishing scans
      const { data: phishData } = await supabase
        .from("scan_history")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      const pd = phishData || [];
      setRecentPhishing(pd.slice(0, 5));
      setPhishingStats({
        total: pd.length,
        safe: pd.filter((r: any) => r.result === "safe").length,
        phishing: pd.filter((r: any) => r.result === "phishing").length,
        suspicious: pd.filter((r: any) => r.result === "suspicious").length,
      });

      // Security scans
      const { data: secData } = await supabase
        .from("security_scans" as any)
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      const sd: any[] = (secData as any[]) || [];
      setRecentSecurity(sd.slice(0, 5));
      setSecurityStats({
        total: sd.length,
        gradeA: sd.filter((r: any) => r.overall_grade === "A").length,
        gradeB: sd.filter((r: any) => r.overall_grade === "B").length,
        gradeC: sd.filter((r: any) => r.overall_grade === "C").length,
        gradeD: sd.filter((r: any) => r.overall_grade === "D").length,
        gradeF: sd.filter((r: any) => r.overall_grade === "F").length,
      });
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const phishingPieData = [
    { name: "Safe", value: phishingStats.safe },
    { name: "Phishing", value: phishingStats.phishing },
    { name: "Suspicious", value: phishingStats.suspicious },
  ].filter(d => d.value > 0);

  const gradeBarData = [
    { grade: "A", count: securityStats.gradeA, fill: GRADE_COLORS_MAP.A },
    { grade: "B", count: securityStats.gradeB, fill: GRADE_COLORS_MAP.B },
    { grade: "C", count: securityStats.gradeC, fill: GRADE_COLORS_MAP.C },
    { grade: "D", count: securityStats.gradeD, fill: GRADE_COLORS_MAP.D },
    { grade: "F", count: securityStats.gradeF, fill: GRADE_COLORS_MAP.F },
  ];

  const totalScans = phishingStats.total + securityStats.total;

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
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">
                  <span className="text-primary">Phish</span>Guard
                </span>
              </div>
              <div className="hidden md:flex items-center gap-4">
                {/* Order: Home → Dashboard → PhishGuard → History */}
                <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="font-mono text-sm text-muted-foreground hover:text-foreground">
                  <Home className="h-4 w-4 mr-2" /> Home
                </Button>
                <Button variant="ghost" size="sm" className="font-mono text-sm text-primary">
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/detect")} className="font-mono text-sm text-muted-foreground hover:text-foreground">
                  <Search className="h-4 w-4 mr-2" /> Scanner
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="font-mono text-sm text-muted-foreground hover:text-foreground">
                  <History className="h-4 w-4 mr-2" /> History
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-muted-foreground hidden sm:block">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="font-mono text-sm text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container px-4 py-12 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">
              <span className="text-primary cyber-text-glow">Security</span> Dashboard
            </h1>
            <p className="text-muted-foreground font-mono max-w-md mx-auto">
              Overview of all your phishing detection and security scanning activity
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
              <p className="mt-4 text-muted-foreground font-mono text-sm">Loading analytics...</p>
            </div>
          ) : (
            <>
              {/* Top Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <StatCard icon={Activity} label="Total Scans" value={totalScans} color="text-primary" bg="bg-primary/10" />
                <StatCard icon={CheckCircle} label="Safe URLs" value={phishingStats.safe} color="text-emerald-400" bg="bg-emerald-400/10" />
                <StatCard icon={AlertTriangle} label="Threats Found" value={phishingStats.phishing} color="text-red-400" bg="bg-red-400/10" />
                <StatCard icon={TrendingUp} label="Security Scans" value={securityStats.total} color="text-cyan-400" bg="bg-cyan-400/10" />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Phishing Pie Chart */}
                <div className="cyber-border bg-card/60 backdrop-blur-sm rounded-xl p-6 space-y-4">
                  <h3 className="font-mono text-sm font-semibold text-primary flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Phishing Detection Results
                  </h3>
                  {phishingPieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={phishingPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                          {phishingPieData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "hsl(220 18% 10%)", border: "1px solid hsl(180 30% 20%)", borderRadius: "8px", fontFamily: "JetBrains Mono, monospace", fontSize: "12px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[220px] flex items-center justify-center text-muted-foreground font-mono text-sm">No data yet</div>
                  )}
                  <div className="flex justify-center gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-400" /> Safe</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400" /> Phishing</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400" /> Suspicious</span>
                  </div>
                </div>

                {/* Security Grade Bar Chart */}
                <div className="cyber-border bg-card/60 backdrop-blur-sm rounded-xl p-6 space-y-4">
                  <h3 className="font-mono text-sm font-semibold text-primary flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Vulnerability Check Grades
                  </h3>
                  {securityStats.total > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={gradeBarData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(180 30% 20% / 0.3)" />
                        <XAxis dataKey="grade" tick={{ fill: "hsl(180 20% 60%)", fontFamily: "JetBrains Mono", fontSize: 12 }} />
                        <YAxis tick={{ fill: "hsl(180 20% 60%)", fontFamily: "JetBrains Mono", fontSize: 12 }} allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(220 18% 10%)", border: "1px solid hsl(180 30% 20%)", borderRadius: "8px", fontFamily: "JetBrains Mono, monospace", fontSize: "12px" }} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {gradeBarData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[220px] flex items-center justify-center text-muted-foreground font-mono text-sm">No data yet</div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                <button
                  onClick={() => navigate("/detect")}
                  className="cyber-border bg-card/60 backdrop-blur-sm rounded-xl p-6 text-left hover:bg-card/80 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="p-2 rounded-lg bg-primary/10 w-fit">
                        <Search className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-mono font-semibold">Phishing Detection</h3>
                      <p className="font-mono text-xs text-muted-foreground">Scan URLs & emails for phishing threats</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
                <button
                  onClick={() => navigate("/detect")}
                  className="cyber-border bg-card/60 backdrop-blur-sm rounded-xl p-6 text-left hover:bg-card/80 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="p-2 rounded-lg bg-emerald-400/10 w-fit">
                        <Shield className="h-5 w-5 text-emerald-400" />
                      </div>
                      <h3 className="font-mono font-semibold">Check Vulnerabilities</h3>
                      <p className="font-mono text-xs text-muted-foreground">Scan a safe URL for security vulnerabilities</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                  </div>
                </button>
              </div>
            </>
          )}
        </main>

        {/* Mobile Navigation: Home → Dashboard → PhishGuard → History */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden border-t border-border/50 backdrop-blur-sm bg-background/90 p-2">
          <div className="flex items-center justify-around">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="flex flex-col items-center gap-1 h-auto py-2">
              <Home className="h-5 w-5 text-muted-foreground" /><span className="text-xs font-mono text-muted-foreground">Home</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2">
              <LayoutDashboard className="h-5 w-5 text-primary" /><span className="text-xs font-mono text-primary">Dashboard</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/detect")} className="flex flex-col items-center gap-1 h-auto py-2">
              <Search className="h-5 w-5 text-muted-foreground" /><span className="text-xs font-mono text-muted-foreground">Scanner</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="flex flex-col items-center gap-1 h-auto py-2">
              <History className="h-5 w-5 text-muted-foreground" /><span className="text-xs font-mono text-muted-foreground">History</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: {
  icon: any; label: string; value: number; color: string; bg: string;
}) {
  return (
    <div className="cyber-border bg-card/50 backdrop-blur-sm rounded-xl p-4 text-center space-y-2 hover:bg-card/70 transition-colors">
      <div className={`inline-flex p-2 rounded-lg ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="space-y-1">
        <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}
