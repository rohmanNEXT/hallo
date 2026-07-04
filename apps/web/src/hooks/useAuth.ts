import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/store/store';
import { UserProfile } from '@/lib/types';

export default function useAuth() {
  const queryClient = useQueryClient();
  const store = useAppStore();

  const { data: user, isLoading } = useQuery<UserProfile | null>({
    queryKey: ['auth-user'],
    queryFn: async () => {
      return store.user;
    },
    initialData: store.user,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role?: "user" | "admin" }) => {
      const success = await store.login(email, role);
      if (!success) throw new Error('Login failed');
      return store.user;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth-user'], data);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const success = await store.register(data);
      if (!success) throw new Error('Registration failed');
      return store.user;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth-user'], data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      store.logout();
      return null;
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth-user'], null);
      queryClient.clear();
    },
  });

  return {
    user,
    isLoading,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
