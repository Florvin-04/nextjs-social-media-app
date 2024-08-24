"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteCommentModal from "./DeleteCommentModal";
import { CommentData } from "@/lib/types";

type Props = {
  comment: CommentData;
  className?: string;
};

export default function CommentMenuButton({ className, comment }: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className={cn("", className)}>
          <Button
            variant="ghost"
            className="h-fit w-fit p-0 px-1"
            icon={<MoreHorizontal className="size-5" />}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <span className="flex items-center gap-2">
              <Trash2 className="size-4" />
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteCommentModal
        comment={comment}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
