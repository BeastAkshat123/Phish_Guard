import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Globe, RefreshCw, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import type { GradeLevel } from "@/lib/secureScan";

interface SecurityScanRecord {
  id: string;
  target_url: string;
  overall_grade: string;
  overall_score: number;
  findings: any[];
  created_at: string;
}

const GRADE_BADGE: Record<string, string> = {
  A: "bg-emerald-400/20 text-emerald-400 border-emerald-400/30",
  B: "bg-lime-400/20 text-lime-400 border-lime-400/30",
  C: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
  D: "bg-orange-400/20 text-orange-400 border-orange-400/30",
  F: "bg-red-400/20 text-red-400 border-red-400/30",
};

export const SecurityScanHistoryRef = { current: null as (() => Promise<void>) | null };

export function SecurityScanHistory() {
  const [history, setHistory] = useState<SecurityScanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchHistory = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("security_scans" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHistory((data as any[]) || []);
    } catch (error) {
      console.error("Error fetching security scan history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("security_scans" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
      setHistory(prev => prev.filter(r => r.id !== id));
      toast.success("Security scan deleted");
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete scan");
    }
  };

  useEffect(() => {
    SecurityScanHistoryRef.current = fetchHistory;
    fetchHistory();
  }, [user]);

  const truncateUrl = (url: string, maxLen = 55) =>
    url.length <= maxLen ? url : url.substring(0, maxLen) + "...";

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="cyber-border bg-card/80 backdrop-blur-sm rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="font-mono font-semibold text-lg">Security Scan History</h2>
            <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
              {history.length} scans
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchHistory}
            className="font-mono text-xs hover:text-primary"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-2 text-muted-foreground font-mono text-sm">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Loading scan history...
              </div>
            </div>
          ) : history.length === 0 ? (
            <div className="p-12 text-center">
              <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="font-semibold text-lg mb-2">No security scans yet</h3>
              <p className="text-muted-foreground font-mono text-sm max-w-sm mx-auto">
                Start scanning websites to assess their security posture. All your scans will appear here.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="text-left p-3 font-mono text-xs text-muted-foreground font-medium">TARGET URL</th>
                  <th className="text-left p-3 font-mono text-xs text-muted-foreground font-medium">GRADE</th>
                  <th className="text-left p-3 font-mono text-xs text-muted-foreground font-medium">SCORE</th>
                  <th className="text-left p-3 font-mono text-xs text-muted-foreground font-medium">FINDINGS</th>
                  <th className="text-left p-3 font-mono text-xs text-muted-foreground font-medium">TIME</th>
                  <th className="text-left p-3 font-mono text-xs text-muted-foreground font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, index) => (
                  <tr
                    key={record.id}
                    className="border-b border-border/30 hover:bg-muted/10 transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-3">
                      <code className="font-mono text-xs text-foreground/80 bg-muted/30 px-2 py-1 rounded max-w-xs block truncate">
                        {truncateUrl(record.target_url)}
                      </code>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-mono font-bold border ${GRADE_BADGE[record.overall_grade] || GRADE_BADGE.F}`}>
                        {record.overall_grade}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              record.overall_score >= 80 ? "bg-emerald-400" :
                              record.overall_score >= 60 ? "bg-yellow-400" :
                              record.overall_score >= 40 ? "bg-orange-400" : "bg-red-400"
                            }`}
                            style={{ width: `${record.overall_score}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">{record.overall_score}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {Array.isArray(record.findings) ? record.findings.length : 0} issues
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(record.created_at), { addSuffix: true })}
                      </span>
                    </td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
