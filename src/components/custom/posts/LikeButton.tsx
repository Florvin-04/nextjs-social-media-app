import { toast } from "@/components/ui/use-toast";
import KyInstance from "@/lib/ky";
import { LikeInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";

type Props = {
  postId: string;
  initalState: LikeInfo;
};

export default function LikeButton({ postId, initalState }: Props) {
  const queryKey: QueryKey = ["like-info", postId];
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      KyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initalState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? KyInstance.delete(`/api/posts/${postId}/likes`)
        : KyInstance.post(`/api/posts/${postId}/likes`),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, (): LikeInfo => {
        return {
          likes:
            (previousData?.likes || 0) + (previousData?.isLikedByUser ? -1 : 1),
          isLikedByUser: !previousData?.isLikedByUser,
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
    <button className="flex items-center gap-2" onClick={() => mutate()}>
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500",
        )}
      />
      <span>likes {data.likes}</span>
    </button>
  );
}
