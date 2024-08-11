"use client";

import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";

type Props = {
  user: UserData;
};

export default function EditProfileButton({ user }: Props) {
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setShowEditProfileDialog(true)}>
        Edit Profile
      </Button>
      <EditProfileDialog
        user={user}
        open={showEditProfileDialog}
        openChange={setShowEditProfileDialog}
      />
    </>
  );
}
