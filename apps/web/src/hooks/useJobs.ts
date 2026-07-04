import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Job } from '@/lib/types';

export default function useJobs() {
  return useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data } = await axios.get<Job[]>('/data/jobs.json');
      return data.map(job => ({ ...job, _randomSort: Math.random() }));
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
