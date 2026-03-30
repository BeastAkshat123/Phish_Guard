# Using Supabase Utilities

This guide explains how to use the pre-built utility functions in `src/integrations/supabase/queries.ts`.

## 📥 Import

```typescript
import {
  saveScan,
  getUserScans,
  getUserScanStats,
  // ... other functions
} from "@/integrations/supabase/queries";
```

## 🔐 Authentication

### Sign Up
```typescript
const { data, error } = await signUpUser("user@example.com", "password123");
if (error) {
  console.error("Sign up failed:", error);
} else {
  console.log("Signed up successfully");
}
```

### Sign In
```typescript
const { data, error } = await signInUser("user@example.com", "password123");
if (error) {
  console.error("Sign in failed:", error);
}
```

### Sign Out
```typescript
const { error } = await signOutUser();
if (error) console.error("Sign out failed:", error);
```

### Get Current User
```typescript
const { user, error } = await getCurrentUser();
console.log("Current user:", user?.email);
```

## 💾 Save Scan Results

```typescript
const { data, error } = await saveScan(
  userId,
  "https://example.com",
  "safe",           // or "phishing", "suspicious"
  15,               // risk score (0-100)
  { details: "..." } // optional analysis details
);

if (error) {
  console.error("Failed to save scan:", error);
} else {
  console.log("Scan saved:", data);
}
```

## 📊 Get Scan History

### Get All User Scans
```typescript
const { data: scans, error } = await getUserScans(userId);

scans?.forEach(scan => {
  console.log(`${scan.url} - ${scan.result}`);
});
```

### Get Recent Scans (Last 7 Days)
```typescript
const { data: recentScans, error } = await getRecentScans(userId, 7);
```

### Get Single Scan
```typescript
const { data: scan, error } = await getScanById(scanId);
console.log("Scan details:", scan);
```

## 📈 Get Statistics

```typescript
const { stats, error } = await getUserScanStats(userId);

console.log(`Total scans: ${stats?.total}`);
console.log(`Safe: ${stats?.safe}`);
console.log(`Phishing: ${stats?.phishing}`);
console.log(`Suspicious: ${stats?.suspicious}`);
```

## ❌ Delete Scan

```typescript
const { error } = await deleteScan(scanId);
if (error) {
  console.error("Failed to delete scan:", error);
}
```

## 🔔 Real-Time Updates

### Subscribe to Changes
```typescript
const subscription = subscribeToUserScans(userId, (payload) => {
  console.log("Scan event:", payload);
  
  if (payload.eventType === 'INSERT') {
    console.log("New scan added:", payload.new);
  }
  if (payload.eventType === 'DELETE') {
    console.log("Scan deleted:", payload.old);
  }
});

// Later, unsubscribe
unsubscribeFromScans(subscription);
```

## 👤 User Profile

### Create Profile
```typescript
const { data, error } = await createUserProfile(userId, "user@example.com");
```

### Get Profile
```typescript
const { data: profile, error } = await getUserProfile(userId);
console.log("User email:", profile?.email);
```

## 🎯 Example: Complete Scan Flow

```typescript
import { useAuth } from "@/hooks/useAuth";
import { saveScan, getUserScans } from "@/integrations/supabase/queries";

export function ScannerComponent() {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [scans, setScans] = useState([]);

  async function handleScan() {
    if (!user) return;

    // Perform phishing detection analysis
    const analysisResult = performPhishingAnalysis(url);

    // Save to Supabase
    const { data, error } = await saveScan(
      user.id,
      url,
      analysisResult.classification, // 'safe', 'phishing', 'suspicious'
      analysisResult.riskScore,
      analysisResult.details
    );

    if (!error) {
      console.log("Scan saved successfully");
      // Refresh scan history
      loadScans();
    }
  }

  async function loadScans() {
    if (!user) return;
    const { data, error } = await getUserScans(user.id);
    if (!error && data) {
      setScans(data);
    }
  }

  useEffect(() => {
    loadScans();
  }, [user]);

  return (
    <div>
      <input 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to scan..."
      />
      <button onClick={handleScan}>Scan</button>
      
      <div>
        {scans.map(scan => (
          <div key={scan.id}>
            <p>{scan.url} - {scan.result}</p>
            <p>Risk Score: {scan.risk_score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🛡️ Error Handling Best Practice

```typescript
async function safeScan(userId: string, url: string) {
  try {
    const analysis = performPhishingAnalysis(url);
    
    const { data, error } = await saveScan(
      userId,
      url,
      analysis.classification,
      analysis.riskScore,
      analysis.details
    );

    if (error) {
      throw new Error(`Failed to save scan: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error };
  }
}
```

## 📝 Tips

1. **Always check for errors** - Every function returns `{ data, error }`
2. **Use async/await** - Easier to read than `.then()` chains
3. **User ID required** - Most functions need the current user ID
4. **Handle null data** - Check if data exists before using it
5. **Real-time updates** - Subscribe for live scan updates
6. **Batch operations** - For bulk inserts, modify queries.ts

## 🔗 Related Files

- Database types: `src/integrations/supabase/types.ts`
- Supabase client: `src/integrations/supabase/client.ts`
- Auth hook: `src/hooks/useAuth.tsx`
