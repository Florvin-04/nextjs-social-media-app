"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import DeletePostModal from "./DeletePostModal";
import { PostData } from "@/lib/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  post: PostData;
  className?: string;
};

const PostMoreButton = ({ post, className }: Props) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={cn("", className)}>
          <Button
            variant="ghost"
            className="h-fit w-fit p-0 px-1"
            icon={<MoreHorizontal className="size-5" />}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <span className="flex items-center gap-2">
              <Trash2 className="size-4" />
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeletePostModal
        post={post}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
};

export default PostMoreButton;
