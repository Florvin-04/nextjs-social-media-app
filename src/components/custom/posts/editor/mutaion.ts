import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { handleSubmitPostAction } from "./action";
import { PostPage } from "@/lib/types";
import { useSession } from "@/app/(main)/SessionProvider";

export const useSubmitPostMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { user } = useSession();

  const mutaion = useMutation({
    mutationFn: handleSubmitPostAction,
    onSuccess: async (newPost) => {
      const queryFilter = {
        queryKey: ["post-feed"],
        predicate(query) {
          // console.log({ query: query.queryKey });
          // console.log({ query });
          // console.log(query.queryKey.includes("for-you"));
          // console.log(
          //   query.queryKey.includes("user-posts") &&
          //     query.queryKey.includes(user.id),
          // );

          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters;

      console.log({ queryFilter });

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

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast({ variant: "success", title: "Success", description: "Post" });
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
