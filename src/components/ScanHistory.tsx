import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { History, ExternalLink, Mail, Shield, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface ScanRecord {
  id: string;
  input_text: string;
  input_type: "url" | "email";
  result: "safe" | "phishing" | "suspicious";
  confidence: number;
  risk_factors: string[] | null;
  created_at: string;
}

export function ScanHistory() {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("scan_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Cast the data to our ScanRecord type
      const typedData = (data || []).map((record: any) => ({
        ...record,
        risk_factors: record.risk_factors as string[] | null,
      })) as ScanRecord[];
      
      setHistory(typedData);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getResultIcon = (result: string) => {
    switch (result) {
      case "safe":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "phishing":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "suspicious":
        return <Shield className="h-4 w-4 text-warning" />;
      default:
        return null;
    }
  };

  const getResultBadgeClass = (result: string) => {
    switch (result) {
      case "safe":
        return "bg-success/20 text-success border-success/30";
      case "phishing":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "suspicious":
        return "bg-warning/20 text-warning border-warning/30";
      default:
        return "";
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="cyber-border bg-card/80 backdrop-blur-sm rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <History className="h-5 w-5 text-primary" />
            <h2 className="font-mono font-semibold text-lg">Scan History</h2>
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
                Loading history...
              </div>
            </div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground font-mono text-sm">
                No scans yet. Start by analyzing a URL or email above.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="text-left p-3 font-mono text-xs text-muted-foreground font-medium">
                    TYPE
                  </th>
                  <th className="text-left p-3 font-mono text-xs text-muted-foreground font-medium">
                    INPUT
                  </th>
                  <th className="text-left p-3 font-mono text-xs text-muted-foreground font-medium">
                    RESULT
                  </th>
                  <th className="text-left p-3 font-mono text-xs text-muted-foreground font-medium">
                    CONFIDENCE
                  </th>
                  <th className="text-left p-3 font-mono text-xs text-muted-foreground font-medium">
                    TIME
                  </th>
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
                      <div className="flex items-center gap-2">
                        {record.input_type === "url" ? (
                          <ExternalLink className="h-4 w-4 text-primary" />
                        ) : (
                          <Mail className="h-4 w-4 text-accent" />
                        )}
                        <span className="font-mono text-xs uppercase text-muted-foreground">
                          {record.input_type}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <code className="font-mono text-xs text-foreground/80 bg-muted/30 px-2 py-1 rounded">
                        {truncateText(record.input_text)}
                      </code>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-mono font-medium border ${getResultBadgeClass(
                          record.result
                        )}`}
                      >
                        {getResultIcon(record.result)}
                        {record.result.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              record.result === "safe"
                                ? "bg-success"
                                : record.result === "phishing"
                                ? "bg-destructive"
                                : "bg-warning"
                            }`}
                            style={{ width: `${record.confidence}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">
                          {record.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(record.created_at), {
                          addSuffix: true,
                        })}
                      </span>
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
