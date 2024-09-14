import { Media } from "@prisma/client";
import Image from "next/image";

type Props = {
  attachment: Media;
};

export default function Attachement({ attachment }: Props) {
  if (attachment.type === "IMAGE") {
    return (
      <Image
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        alt="image attachment"
        src={attachment.url}
        className="max-h-[20rem]"
      />
    );
  }

  if (attachment.type === "VIDEO") {
    return (
      <div className="h-full">
        <video controls className="h-full">
          <source src={attachment.url} />
        </video>
      </div>
    );
  }

  return <p className="text-destructive">Unsupported File</p>;
}
