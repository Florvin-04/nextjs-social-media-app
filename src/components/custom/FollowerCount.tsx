"use client";

import useFollowerInfo from "@/hooks/useFolloweInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

type Props = {
  userId: string;
  initalState: FollowerInfo;
};

export default function FollowerCount({ initalState, userId }: Props) {
  const { data } = useFollowerInfo({ initalState, userId });

  return <span className="font-semibold">{formatNumber(data.followers)}</span>;
}
