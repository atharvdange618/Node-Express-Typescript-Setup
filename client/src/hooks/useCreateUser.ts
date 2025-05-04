export const useCreateUser = () => {
  const queryClient = queryClient();

  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      // Invalidate and refetch 'users' query
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Create user failed", error);
    },
  });
};
