import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Company } from '@/lib/types';

export default function useCompanies() {
  return useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data } = await axios.get<Company[]>('/data/companies.json');
      return data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}
