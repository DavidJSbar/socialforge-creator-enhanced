import { useState, useEffect } from 'react';

interface DashboardData {
  totalPosts: number;
  pendingApproval: number;
  monthlyRevenue: number;
  recentPosts: any[];
  loading: boolean;
  error: string | null;
}

export function useDashboardData() {
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
        // Replace with actual API calls
        // const response = await fetch('/api/dashboard');
        // const result = await response.json();
        // setData(result);
        setData(prev => ({ ...prev, loading: false }));
      } catch (err) {
        setData(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Failed to fetch data',
          loading: false,
        }));
      }
    };

    fetchData();
  }, []);

  return data;
}
