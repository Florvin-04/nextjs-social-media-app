"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { handleSubmitPostAction } from "./action";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "../../UserAvatar";
import "./styles.css";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

const PostEditor = () => {
  const { user } = useSession();

  const [isPending, startTransition] = useTransition();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),

      Placeholder.configure({
        placeholder: "Placeholder",
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const handleSubmit = () => {
    startTransition(async () => {
      await handleSubmitPostAction({ content: input });
      editor?.commands.clearContent();
    });
  };

  return (
    <div className="flex flex-col gap-3 bg-card px-2 py-3 rounded-2xl">
      <div className="flex gap-4">
        <UserAvatar avatarUrl={user.avatarUrl!} />
        <EditorContent
          editor={editor}
          className="h-fit max-h-[10rem] w-full overflow-y-auto rounded-md bg-background px-3 pb-3 pt-2.5"
        />
      </div>
      <div className="flex">
        <Button
          isLoading={isPending}
          disabled={isPending}
          onClick={handleSubmit}
          className="ml-auto w-fit"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default PostEditor;
