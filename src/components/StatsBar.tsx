import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, AlertTriangle, CheckCircle, Activity } from "lucide-react";

interface Stats {
  total: number;
  safe: number;
  phishing: number;
  suspicious: number;
}

export function StatsBar() {
  const [stats, setStats] = useState<Stats>({ total: 0, safe: 0, phishing: 0, suspicious: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from("scan_history")
          .select("result");

        if (error) throw error;

        const counts = (data || []).reduce(
          (acc, record) => {
            acc.total++;
            if (record.result === "safe") acc.safe++;
            else if (record.result === "phishing") acc.phishing++;
            else if (record.result === "suspicious") acc.suspicious++;
            return acc;
          },
          { total: 0, safe: 0, phishing: 0, suspicious: 0 }
        );

        setStats(counts);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      label: "Total Scans",
      value: stats.total,
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Safe",
      value: stats.safe,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Phishing",
      value: stats.phishing,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Suspicious",
      value: stats.suspicious,
      icon: Shield,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="cyber-border bg-card/50 backdrop-blur-sm rounded-xl p-4 text-center space-y-2 hover:bg-card/70 transition-colors"
          >
            <div className={`inline-flex p-2 rounded-lg ${item.bgColor}`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <div className="space-y-1">
              <p className={`text-2xl font-bold font-mono ${item.color}`}>
                {item.value}
              </p>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
