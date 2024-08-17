import { toast, useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export type AttachmentsProps = {
  file: File;
  mediaId?: string;
  isUploading?: boolean;
};

export default function useMediaUpload() {
  const [attachments, setAttachments] = useState<AttachmentsProps[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const fileExtentionName = file.name.split(".").pop();

        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${fileExtentionName}`,
          {
            type: file.type,
          },
        );
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({ file, isUploading: true })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setAttachments((prev) => {
        return prev.map((attachedFiles) => {
          // find the uploaded files already based on name, and add mediaId on it
          const uploadResult = res.find(
            (r) => r.name === attachedFiles.file.name,
          );

          if (!uploadResult) return attachedFiles;

          return {
            ...attachedFiles,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        });
      });
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: e.message,
      });
    },
  });

  const handleStartUpload = (files: File[]) => {
    if (isUploading) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Please wait for the other upload to finish",
      });

      return;
    }

    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "You can upload only Five(5) attachments per post",
      });
      return;
    }

    startUpload(files);
  };

  const removeAttachments = (fileName: string) => {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  };

  const reset = () => {
    setAttachments([]);
    setUploadProgress(undefined);
  };

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachments,
    resetAttachmentsState: reset,
  };
}
