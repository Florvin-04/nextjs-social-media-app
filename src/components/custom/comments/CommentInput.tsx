import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { useSubmitCommentMutaion } from "./mutation";
import { PostData } from "@/lib/types";
import _ from "lodash";

type Props = {
  post: PostData;
};

export default function CommentInput({ post }: Props) {
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
        onSuccess: () => formRef?.current?.reset(),
      },
    );
  };

  const validateFormValues = () => {
    const { comment } = formRef?.current;

    setValidateInput({
      comment: !!comment.value.length,
    });
  };

  const debounceHandler = _.debounce(validateFormValues, 250);

  return (
    <form
      onChange={debounceHandler}
      ref={formRef}
      className="flex items-center gap-3"
      onSubmit={handleSubmitForm}
    >
      <Input placeholder="Write a comment.." type="text" name="comment" />
      <Button
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
