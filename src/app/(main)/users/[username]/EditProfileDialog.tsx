"use client";

import CustomFormFields from "@/components/custom/CustomFormFields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserData } from "@/lib/types";
import {
  updateUserProfileScheme,
  UpdateUserProfileValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpdateProfileMutation } from "./mutation";
import Image, { StaticImageData } from "next/image";
import { ChangeEvent, useState } from "react";
import avatarPlaceHolder from "@/assets/avatar-placeholder.png";
import { Camera } from "lucide-react";
import CropImageDialog from "@/components/custom/CropImageDialog";
import Resizer from "react-image-file-resizer";
import { fileTypeChecker } from "@/lib/utils";

type Props = {
  user: UserData;
  open: boolean;
  openChange: (open: boolean) => void;
};

export default function EditProfileDialog({ open, openChange, user }: Props) {
  const { handleSubmit, control } = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileScheme),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio || "",
    },
  });

  const mutation = useUpdateProfileMutation();

  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  function handleSubmitForm(values: UpdateUserProfileValues) {
    console.log({ croppedAvatar });

    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`, {
          type: "image/webp",
        })
      : undefined;

    console.log({ newAvatarFile });

    mutation.mutate(
      {
        values,
        avatar: newAvatarFile,
      },
      {
        onSuccess: () => {
          openChange(false);
          setCroppedAvatar(null);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <AvatarInput
          src={
            croppedAvatar
              ? URL.createObjectURL(croppedAvatar)
              : user.avatarUrl || avatarPlaceHolder
          }
          onCropedImage={setCroppedAvatar}
        />
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-3">
          <CustomFormFields
            type="text"
            control={control}
            label="Display Name"
            name="displayName"
            placeholder="Display Name"
          />

          <CustomFormFields
            control={control}
            label="Bio"
            name="bio"
            placeholder="Tell us about your self"
            enableTexArea
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={mutation.isPending}
              isLoading={mutation.isPending}
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type AvatarInputProps = {
  src: string | StaticImageData;
  onCropedImage: (blob: Blob | null) => void;
};

function AvatarInput({ onCropedImage, src }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const handleSetFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const isValidFile = fileTypeChecker({
      file,
      extensionNames: ["jpg", "png", "webp"],
    });

    if (!isValidFile) {
      console.log("Invalid file type");
      return;
    }

    handleChangeImage(file);
  };

  const handleChangeImage = (image: File) => {
    if (!image) return;

    console.log({ image });

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
  };

  const handleDropImage = (e: React.DragEvent<HTMLSpanElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    // this return all files with status of true or false
    // const arrayOfFiles = Array.from(files);
    // const validFiles = arrayOfFiles.map((file) => {
    //   return {
    //     file,
    //     status: fileTypeChecker({
    //       file,
    //       extensionNames: ["jpg", "png", "webp"],
    //     }),
    //   };
    // });

    const isValidFile = fileTypeChecker({
      file: files[0],
      extensionNames: ["jpg", "png", "webp"],
    });

    if (!isValidFile) {
      console.log("Invalid file type");
      return;
    }

    handleChangeImage(files[0]);
  };

  return (
    <>
      <label className="group relative size-fit cursor-pointer rounded-full">
        <Image
          className="size-32 flex-none rounded-full object-cover"
          src={src}
          alt="Avatar Preview"
          width={150}
          height={150}
        />
        <span
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black opacity-30 transition-all duration-300 group-hover:opacity-50"
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={handleDropImage}
        >
          <Camera size={34} />
        </span>
        <input
          hidden
          type="file"
          accept="image/*"
          // onChange={(e) => handleChangeImage(e.target.files?.[0])}
          onChange={handleSetFile}
        />
      </label>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onCropedImage}
          onClosed={() => {
            setImageToCrop(undefined);
          }}
        />
      )}
    </>
  );
}
