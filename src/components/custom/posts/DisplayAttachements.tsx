import { Media } from "@prisma/client";
import Attachement from "./Attachment";

type Props = {
  attachments: Media[];
};

export default function DisplayAttachments({ attachments }: Props) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
      {attachments.map((attachment) => {
        return (
          <div key={attachment.id} className="h-full">
            <Attachement attachment={attachment} />
          </div>
        );
      })}
    </div>
  );
}
