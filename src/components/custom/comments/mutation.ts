import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { handleSubmitCommentAction } from "./action";
import { CommentsPage } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { ZodError } from "zod";

export function useSubmitCommentMutaion(postId: string) {
  const queryClient = useQueryClient();

  const mutaion = useMutation({
    mutationFn: handleSubmitCommentAction,
    onSuccess: async (createdComment) => {
      const queryKey: QueryKey = ["comments", postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  prevCursor: firstPage.prevCursor,
                  comments: [...firstPage.comments, createdComment],
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({ variant: "success", title: "Success", description: "Comment" });
    },

    onError: (error) => {
      if (error instanceof ZodError) {
        console.log("Zod validation error:", error);
      }
      console.error(error);
      toast({
        variant: "destructive",
        description: "Please Try Again",
      });
    },
  });

  return mutaion
}
