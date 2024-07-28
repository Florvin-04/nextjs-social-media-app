import { cn } from "@/lib/utils";
import React from "react";

import { useInView } from "react-intersection-observer";

type Props = {
  className?: string;
  onBottonReached: () => void;
  isFetchingNextPage?: boolean;
} & React.PropsWithChildren;

const InfiniteScrollContainer = ({
  onBottonReached,
  children,
  className,
  isFetchingNextPage,
}: Props) => {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
        onBottonReached();
      }
    },
  });

  return (
    <div className={cn("", className)}>
      {children}
      {!isFetchingNextPage && <div className="" ref={ref} />}
    </div>
  );
};

export default InfiniteScrollContainer;
