import { CommentData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { handleDeleteCommentMutation } from "./mutation";
import { Button } from "@/components/ui/button";

type Props = {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
};

export default function DeleteCommentModal({ onClose, open, comment }: Props) {
    const mutaion = handleDeleteCommentMutation();
  const handleOpenChange = () => {
    if (open && mutaion.isPending) return;

    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <Button
            disabled={mutaion.isPending}
            isLoading={mutaion.isPending}
            type="button"
            variant="destructive"
            onClick={() => {
              mutaion.mutate(comment.id, { onSuccess: () => onClose() });
            }}
          >
            Delete
          </Button>
          <Button
            disabled={mutaion.isPending}
            type="button"
            variant="secondary"
            onClick={() => onClose()}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
