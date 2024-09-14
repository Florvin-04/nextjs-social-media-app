import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { useSubmitCommentMutaion } from "./mutation";
import { PostData } from "@/lib/types";
import _ from "lodash";
import useDebounce from "@/hooks/useDebounce";

type Props = {
  post: PostData;
  setSubmitComment?: () => void;
};

export default function CommentInput({ post, setSubmitComment }: Props) {
  const formRef = useRef<any>(null);

  const mutation = useSubmitCommentMutaion(post.id);

  const [validateInput, setValidateInput] = useState({
    comment: false,
  });

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { comment } = formRef?.current;

    mutation.mutate(
      {
        post,
        content: comment.value,
      },
      {
        onSuccess: () => {
          if (setSubmitComment) {
            setSubmitComment();
          }
          formRef?.current?.reset();
        },
      },
    );
  };

  const validateFormValues = () => {
    const { comment } = formRef?.current;

    setValidateInput({
      comment: !!comment.value.length,
    });
  };

  const debounceHandler = useDebounce(validateFormValues);

  return (
    <form
      onChange={debounceHandler}
      ref={formRef}
      className="relative z-10"
      onSubmit={handleSubmitForm}
    >
      <Input placeholder="Write a comment.." type="text" name="comment" />
      <Button
        className="absolute right-3 top-1/2 -translate-y-1/2"
        disabled={mutation.isPending || !validateInput.comment}
        isLoading={mutation.isPending}
        size="icon"
        variant="ghost"
        type="submit"
        icon={<SendHorizonal />}
      />
    </form>
  );
}
