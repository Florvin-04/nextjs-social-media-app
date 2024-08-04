import KyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

type Props = {
  userId: string;
  initalState: FollowerInfo;
};

export default function useFollowerInfo({ userId, initalState }: Props) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () =>
      KyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
    initialData: initalState,
    staleTime: Infinity,
  });

  return query;
}
