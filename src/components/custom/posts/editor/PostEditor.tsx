"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "../../UserAvatar";
import "./styles.css";
import { Button } from "@/components/ui/button";
import { useSubmitPostMutation } from "./mutaion";
import useMediaUpload, { AttachmentsProps } from "./useMediaUpload";
import { ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import LoadingIcon from "@/assets/icons/LoadingIcon";

export default function PostEditor() {
  const { user } = useSession();

  const mutaion = useSubmitPostMutation();
  const {
    attachments,
    isUploading,
    removeAttachments,
    resetAttachmentsState,
    startUpload,
    uploadProgress,
  } = useMediaUpload();

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
    mutaion.mutate(
      {
        content: input,
        mediaIds: attachments
          .map((attachment) => attachment.mediaId)
          .filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card px-2 py-3">
      <div className="flex gap-4">
        <UserAvatar avatarUrl={user.avatarUrl!} />
        <EditorContent
          editor={editor}
          className="h-fit max-h-[10rem] w-full overflow-y-auto rounded-md bg-background px-3 pb-3 pt-2.5"
        />
      </div>
      <div className="flex h-[2.2rem] items-center justify-end gap-2">
        <AddAttachmentButton
          isUploading={isUploading}
          uploadProgress={uploadProgress!}
          disabled={isUploading || attachments.length >= 5}
          onFilesSelected={startUpload}
        />
        <Button
          isLoading={mutaion.isPending}
          disabled={mutaion.isPending || input.trim() === ""}
          onClick={handleSubmit}
          className="flex h-full w-fit px-3"
        >
          Submit
        </Button>
      </div>
      <AttachmentsParent
        removeAttachment={removeAttachments}
        attachments={attachments}
      />
    </div>
  );
}

type attachmentButtonProps = {
  disabled: boolean;
  onFilesSelected: (files: File[]) => void;
  uploadProgress: number;
  isUploading: boolean;
};

function AddAttachmentButton({
  disabled,
  onFilesSelected,
  isUploading,
  uploadProgress,
}: attachmentButtonProps) {
  return (
    <>
      <label
        className={cn(
          "flex h-full cursor-pointer items-center justify-center gap-2 rounded-lg px-2 hover:bg-accent",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        {isUploading ? (
          <>
            <span>{uploadProgress} %</span>
            <Loader2 className="size-5 animate-spin text-primary" />{" "}
          </>
        ) : (
          <ImageIcon size={20} className="text-primary" />
        )}

        <input
          hidden
          type="file"
          multiple
          accept="video/*, image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);

            if (files.length) {
              onFilesSelected(files);
            }
          }}
        />
      </label>
    </>
  );
}

type AttachmentsParentProps = {
  attachments: AttachmentsProps[];
  removeAttachment: (fileName: string) => void;
};

function AttachmentsParent({
  attachments,
  removeAttachment,
}: AttachmentsParentProps) {
  return (
    <div className="flex h-full flex-wrap gap-x-2">
      {attachments.map((attachment) => {
        return (
          <div className="h-full">
            <AttachementPreview
              removeAttachment={removeAttachment}
              attachment={attachment}
            />
          </div>
        );
      })}
    </div>
  );
}

type DisplayattachmentProps = {
  attachment: AttachmentsProps;
  removeAttachment: (fileName: string) => void;
};

function AttachementPreview({
  attachment,
  removeAttachment,
}: DisplayattachmentProps) {
  const { file, isUploading } = attachment;

  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn(
        "relative isolate h-[10rem] w-[10rem]",
        isUploading && "opacity-50",
      )}
    >
      {file.type.includes("image") ? (
        <Image
          className="aspect-square max-w-[10rem] rounded-2xl object-cover"
          src={src}
          alt="media-file"
          width={150}
          height={150}
        />
      ) : (
        <video
          controls
          className="aspect-auto h-full max-w-[10rem] rounded-2xl"
        >
          <source src={src} type={file.type} />
        </video>
      )}

      {!isUploading && (
        <Button
          onClick={() => removeAttachment(file.name)}
          className="absolute right-0 top-0"
          size="icon"
          icon={<X size={20} />}
          variant="ghost"
        />
      )}
    </div>
  );
}
