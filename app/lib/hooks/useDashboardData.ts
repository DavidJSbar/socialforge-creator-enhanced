import { useState, useEffect } from 'react';

interface Post {
  id: string;
  title?: string;
  content: string;
  status: string;
  created_at: string;
}

interface DashboardData {
  totalPosts: number;
  pendingApproval: number;
  monthlyRevenue: number;
  recentPosts: Post[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for fetching dashboard data
 * Provides loading and error states for better UX
 */
export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    totalPosts: 48,
    pendingApproval: 5,
    monthlyRevenue: 3240,
    recentPosts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace with actual API calls
        // const response = await fetch('/api/dashboard');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch dashboard data');
        // }
        // const result = await response.json();
        // setData({ ...result, loading: false, error: null });
        
        setData(prev => ({ ...prev, loading: false }));
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to fetch data';
        
        setData(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      }
    };

    fetchData();
  }, []);

  return data;
}
