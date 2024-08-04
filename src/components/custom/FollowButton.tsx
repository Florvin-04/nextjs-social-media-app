"use client";

import { FollowerInfo } from "@/lib/types";
import { Button } from "../ui/button";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import useFollowerInfo from "@/hooks/useFolloweInfo";
import KyInstance from "@/lib/ky";
import { useToast } from "../ui/use-toast";

type Props = {
  userId: string;
  initalState: FollowerInfo;
};

export default function FollowButton({ userId, initalState }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["follower-info", userId];

  const { data } = useFollowerInfo({ userId, initalState });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? KyInstance.delete(`/api/users/${userId}/followers`)
        : KyInstance.post(`/api/users/${userId}/followers`),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => {
        return {
          followers:
            (previousData?.followers || 0) +
            (previousData?.isFollowedByUser ? -1 : 1),
          isFollowedByUser: !previousData?.isFollowedByUser,
        };
      });

      return { previousData };
    },

    onError(error, _, context) {
      queryClient.setQueryData(queryKey, context?.previousData);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong",
      });
    },
  });

  return (
    <Button
      onClick={() => {
        mutate();
      }}
      variant={data.isFollowedByUser ? "secondary" : "default"}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
