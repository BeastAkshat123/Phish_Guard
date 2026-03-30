import { supabase } from './client';
import type { Database } from './types';

/**
 * Supabase utility functions for common operations
 * Adapted for the scan_history table schema
 */

// =================== AUTHENTICATION ===================

export async function signUpUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function signInUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

// =================== SCANS (scan_history table) ===================

export async function saveScan(
  userId: string,
  inputText: string,
  inputType: string,
  result: 'safe' | 'phishing' | 'suspicious',
  confidence: number,
  riskFactors?: Record<string, any>
) {
  try {
    const { data, error } = await supabase
      .from('scans')
      .insert({
        user_id: userId,
        input_text: inputText,
        input_type: inputType,
        result,
        confidence,
        risk_factors: riskFactors,
      })
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getUserScans(userId: string, limit: number = 50) {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getScanById(scanId: string) {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('id', scanId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteScan(scanId: string) {
  try {
    const { error } = await supabase
      .from('scans')
      .delete()
      .eq('id', scanId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// =================== STATISTICS ===================

export async function getUserScanStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('result')
      .eq('user_id', userId);

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      safe: data?.filter(s => s.result === 'safe').length || 0,
      phishing: data?.filter(s => s.result === 'phishing').length || 0,
      suspicious: data?.filter(s => s.result === 'suspicious').length || 0,
    };

    return { stats, error: null };
  } catch (error) {
    return { stats: null, error };
  }
}

export async function getRecentScans(userId: string, days: number = 7) {
  try {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', dateFrom.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// =================== UTILITIES ===================

export async function getScanHistory(
  userId: string,
  filters?: {
    result?: string;
    limit?: number;
    offset?: number;
  }
) {
  try {
    let query = supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId);

    if (filters?.result) {
      query = query.eq('result', filters.result);
    }

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getAverageConfidence(userId: string) {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('confidence')
      .eq('user_id', userId);

    if (error) throw error;

    const average = data && data.length > 0
      ? data.reduce((sum, item) => sum + (item.confidence || 0), 0) / data.length
      : 0;

    return { average: Math.round(average * 100) / 100, error: null };
  } catch (error) {
    return { average: null, error };
  }
}
