import { Button } from "@/components/ui/button";
import { PostData } from "@/lib/types";
import { SendHorizonal } from "lucide-react";
import { FormEvent, useState } from "react";
import PostInputField from "../posts/editor/PostInputField";
import { useSubmitCommentMutaion } from "./mutation";

type Props = {
  post: PostData;
  setSubmitComment?: () => void;
};

export default function CommentInput({ post, setSubmitComment }: Props) {
  // const formRef = useRef<any>(null);

  const mutation = useSubmitCommentMutaion(post.id);
  const [inputTest, setInputTest] = useState("");
  const [clearContent, setClearContent] = useState(false);

  // const [validateInput, setValidateInput] = useState({
  //   comment: false,
  // });

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const { comment } = formRef?.current;

    mutation.mutate(
      {
        post,
        content: inputTest,
      },
      {
        onSuccess: () => {
          if (setSubmitComment) {
            setSubmitComment();
          }
          setClearContent(true);
        },
      },
    );
  };

  const handleInputChange = (text: string) => {
    setInputTest(text);
  };

  const handleAfterClearContent = () => {
    setClearContent(false);
  };

  // const validateFormValues = () => {
  //   const { comment } = formRef?.current;

  //   setValidateInput({
  //     comment: !!comment.value.length,
  //   });
  // };

  // const debounceHandler = useDebounce(validateFormValues);

  return (
    <form
      // onChange={debounceHandler}
      // ref={formRef}
      className="relative z-10 min-w-0"
      onSubmit={handleSubmitForm}
    >
      {/* <Input placeholder="Write a comment.." type="text" name="comment" /> */}

      <PostInputField
        placeholder="Write a comment.."
        className="bg-muted pr-[4rem]"
        clearContent={clearContent}
        handleAfterClearContent={handleAfterClearContent}
        onInputChange={handleInputChange}
        // onPaseImage={onPasteImage}
      />

      <Button
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2"
        disabled={mutation.isPending || !inputTest}
        isLoading={mutation.isPending}
        size="icon"
        variant="ghost"
        type="submit"
        icon={<SendHorizonal />}
      />
    </form>
  );
}
