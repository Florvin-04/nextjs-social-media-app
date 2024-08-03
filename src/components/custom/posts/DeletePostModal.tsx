import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PostData } from "@/lib/types";
import { handleDeleteMutationPost } from "./mutation";

type Props = {
  post: PostData;
  open: boolean;
  onClose: () => void;
};

const DeletePostModal = ({ post, open, onClose }: Props) => {
  const mutaion = handleDeleteMutationPost();

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
              mutaion.mutate(post.id, { onSuccess: () => onClose() });
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
};

export default DeletePostModal;
