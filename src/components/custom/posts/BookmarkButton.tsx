import { toast } from "@/components/ui/use-toast";
import KyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark } from "lucide-react";

type Props = {
  postId: string;
  initalState: BookmarkInfo;
};

export default function ({ initalState, postId }: Props) {
  const queryKey: QueryKey = ["bookmark-info", postId];
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      KyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initalState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? KyInstance.delete(`/api/posts/${postId}/bookmark`)
        : KyInstance.post(`/api/posts/${postId}/bookmark`),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, (): BookmarkInfo => {
        return {
          isBookmarkedByUser: !previousData?.isBookmarkedByUser,
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
    <button onClick={() => mutate()}>
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary",
        )}
      />
    </button>
  );
}
