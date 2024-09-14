"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PostData } from "@/lib/types";
import Post from "../posts/Post";
import UserTooltip from "../UserTooltip";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";
import UserAvatar from "../UserAvatar";
import Linkify from "../LinkifyText";
import DisplayAttachments from "../posts/DisplayAttachements";
import Comments from "./Comments";
import CommentInput from "./CommentInput";
import { X } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  post: PostData;
  closeModal: () => void;
};

export default function CommentsModal({ post, closeModal }: Props) {
  const [submitComment, setSubmitComment] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent removeCloseButton className="p-0 sm:max-w-[425px]">
        <div
          ref={containerRef}
          className="relative max-h-[calc(199svh-50rem)] min-w-0 overflow-auto p-6 pb-0"
        >
          <div className="relative flex items-start gap-2">
            <UserTooltip user={post.user}>
              <Link
                // onMouseEnter={handleOnMouseEnter}
                href={`/users/${post.user.username}`}
                className=""
              >
                <UserAvatar avatarUrl={post.user.avatarUrl!} />
              </Link>
            </UserTooltip>
            <div>
              <UserTooltip user={post.user}>
                <Link
                  href={`/users/${post.user.username}`}
                  className="block font-medium hover:underline"
                >
                  {post.user.displayName}
                </Link>
              </UserTooltip>

              <Link
                href={`/posts/${post.id}`}
                className="text-sm text-muted-foreground hover:underline"
                suppressHydrationWarning
              >
                {formatRelativeDate(post.createdAt)}
              </Link>
            </div>

            <Button
              variant="ghost"
              className="absolute right-0 h-0 p-0 opacity-70 transition-all duration-100 hover:opacity-100"
              icon={<X className="h-4 w-4" />}
              onClick={closeModal}
            />
          </div>

          <Linkify>
            <div className="min-w-0 whitespace-pre-line break-words">
              {post.content}
            </div>
          </Linkify>

          {!!post.attachments.length && (
            <DisplayAttachments attachments={post.attachments} />
          )}

          <Comments
            containerRef={containerRef}
            post={post}
            setSubmitComment={() => setSubmitComment(false)}
            submitComment={submitComment}
          />
        </div>
        <div className="sticky bottom-0 bg-card">
          <CommentInput
            post={post}
            setSubmitComment={() => setSubmitComment(true)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
