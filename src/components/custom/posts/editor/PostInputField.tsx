import { useDropzone } from "@uploadthing/react";
import { useMediaUpload } from "./useMediaUpload";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { ClipboardEvent, useEffect, useState } from "react";

type Props = {
  onInputChange: (text: string) => void;
  handleAfterClearContent: () => void;
  onPaseImage?: (e: ClipboardEvent<HTMLDivElement>) => void;
  clearContent: boolean;
  isDragActive?: boolean;
  className?: string;
  placeholder: string;
};

export default function PostInputField({
  onInputChange,
  handleAfterClearContent,
  clearContent,
  onPaseImage,
  isDragActive,
  className,
  placeholder,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),

      Placeholder.configure({
        placeholder,
      }),
    ],
  });

  useEffect(() => {
    if (editor) {
      const handleUpdate = () => {
        const text = editor.getText({ blockSeparator: "\n" }) || "";
        onInputChange(text);
      };

      editor.on("update", handleUpdate);

      return () => {
        editor.off("update", handleUpdate);
      };
    }
  }, [editor]);

  useEffect(() => {
    if (clearContent) {
      editor?.commands.clearContent();
      handleAfterClearContent();
    }
  }, [clearContent]);

  return (
    <EditorContent
      editor={editor}
      className={cn(
        "h-fit max-h-[10rem] w-full min-w-0 overflow-y-auto rounded-md bg-background px-3 pb-3 pt-2.5",
        isDragActive && "outline-dashed outline-2",
        className,
      )}
      onPaste={(e) => {
        if (onPaseImage) {
          onPaseImage(e);
        }
      }}
    />
  );
}
