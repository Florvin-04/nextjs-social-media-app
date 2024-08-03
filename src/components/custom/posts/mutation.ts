import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { handleDeletePostAction } from "./action";
import { PostPage } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";

export const handleDeleteMutationPost = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();

  const mutaion = useMutation({
    mutationFn: handleDeletePostAction,
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((post) => post.id !== deletedPost.id),
            })),
          };
        },
      );

      toast({
        variant: "success",
        title: "Success",
        description: "Pots Deleted Successfully",
      });

      if (pathname === `/posts/${deletedPost.id}`) {
        router.push(`/users/${deletedPost.user.username}`);
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Please Try Again",
      });
    },
  });

  return mutaion;
};
