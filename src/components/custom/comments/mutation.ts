import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { handleDeleteCommentAction, handleSubmitCommentAction } from "./action";
import { CommentsInfo, CommentsPage } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { ZodError } from "zod";

export function useSubmitCommentMutaion(postId: string) {
  const queryClient = useQueryClient();

  const mutaion = useMutation({
    mutationFn: handleSubmitCommentAction,
    onSuccess: async (createdComment) => {
      const queryKey: QueryKey = ["comments", postId];
      const queryKeyCommentInfo: QueryKey = ["comment-info", postId];

      await queryClient.cancelQueries({ queryKey });

      await queryClient.cancelQueries({ queryKey: queryKeyCommentInfo });

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

      const previousData =
        queryClient.getQueryData<CommentsInfo>(queryKeyCommentInfo);

      queryClient.setQueryData<CommentsInfo>(
        queryKeyCommentInfo,
        (): CommentsInfo => {
          return {
            comments: (previousData?.comments || 0) + 1,
          };
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

  return mutaion;
}

export function handleDeleteCommentMutation() {
  const queryClient = useQueryClient();

  const mutaion = useMutation({
    mutationFn: handleDeleteCommentAction,
    onSuccess: async (deleteComment) => {
      const queryKey: QueryKey = ["comments", deleteComment.postId];

      const queryKeyCommentInfo: QueryKey = [
        "comment-info",
        deleteComment.postId,
      ];

      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: queryKeyCommentInfo });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              prevCursor: page.prevCursor,
              comments: page.comments.filter(
                (comment) => comment.id !== deleteComment.id,
              ),
            })),
          };
        },
      );

      const previousData =
        queryClient.getQueryData<CommentsInfo>(queryKeyCommentInfo);

      queryClient.setQueryData<CommentsInfo>(
        queryKeyCommentInfo,
        (): CommentsInfo => {
          return {
            comments: (previousData?.comments || 0) - 1,
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({
        variant: "success",
        title: "Success",
        description: "Comment deleted",
      });
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

  return mutaion;
}
