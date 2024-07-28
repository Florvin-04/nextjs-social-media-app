import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { handleSubmitPostAction } from "./action";
import { PostPage } from "@/lib/types";
import { pages } from "next/dist/build/templates/app-page";
import { ZodError } from "zod";

export const useSubmitPostMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutaion = useMutation({
    mutationFn: handleSubmitPostAction,
    onSuccess: async (newPost) => {
      const queryFilter: QueryFilters = { queryKey: ["post-feed", "for-you"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      toast({ variant: "success", description: "Success" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: "Please Try Again",
      });
    },
  });

  return mutaion;
};
