import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatSettingsApi } from '@/lib/api';

export default function useChatSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['chat-settings'],
    queryFn: chatSettingsApi.getSettings,
  });

  const mutation = useMutation({
    mutationFn: chatSettingsApi.updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['chat-settings'], data);
      queryClient.invalidateQueries({ queryKey: ['chat-settings'] });
    },
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateSettings: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
