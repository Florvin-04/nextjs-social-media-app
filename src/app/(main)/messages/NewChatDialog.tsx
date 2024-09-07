import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckIcon, Loader2, SearchIcon, X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";
import { useSession } from "../SessionProvider";
import { UserResponse } from "stream-chat";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/custom/UserAvatar";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

type StreamChatUser = UserResponse<DefaultStreamChatGenerics>;

type Props = {
  closeDialog: () => void;
  onChatCreated: () => void;
};

export default function NewChatDialog({ closeDialog, onChatCreated }: Props) {
  const { user: loggedInUser } = useSession();
  const { client, setActiveChannel } = useChatContext();
  const [searchInput, setSearchInput] = useState("");
  const [selectedusers, setSelectedUsers] = useState<StreamChatUser[]>([]);

  const debounceHandler = useDebounce((e: ChangeEvent<HTMLInputElement>) =>
    setSearchInput(e.target.value),
  );

  const { data, isSuccess, isFetching, isError } = useQuery({
    queryKey: ["stream-users", searchInput],
    queryFn: async () =>
      client.queryUsers(
        {
          id: { $ne: loggedInUser.id },
          role: { $ne: "admin" },
          ...(searchInput
            ? {
                $or: [
                  { name: { $autocomplete: searchInput } },
                  { username: { $autocomplete: searchInput } },
                ],
              }
            : {}),
        },
        { name: 1, username: 1 },
        { limit: 10 },
      ),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const channel = client.channel("messaging", {
        members: [loggedInUser.id, ...selectedusers.map((user) => user.id)],
        name:
          selectedusers.length > 1
            ? `${loggedInUser.username}, ${selectedusers.map((u) => u.username).join(", ")}`
            : undefined,
      });

      await channel.create();
      return channel;
    },

    onSuccess: (channel) => {
      setActiveChannel(channel);
      onChatCreated();
    },

    onError: (error) => {
      console.error("Error creating chat", error);
      toast({
        title: "Something Went Wrong",
        variant: "destructive",
        description: "Chat Creation Failed",
      });
    },
  });

  return (
    <Dialog open onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
            <Input
              onChange={debounceHandler}
              className="pl-8"
              placeholder="search name..."
              type="text"
              name="username"
            />
          </div>

          {!!selectedusers.length && (
            <div className="mt-[2rem] flex flex-wrap gap-1">
              {selectedusers.map((user) => {
                return (
                  <SelectedUserTag
                    key={`Selected-user-tah-${user.id}`}
                    user={user}
                    handleRemoveUser={() =>
                      setSelectedUsers((prev) => {
                        return prev.filter((u) => u.id !== user.id);
                      })
                    }
                  />
                );
              })}
            </div>
          )}
          <div className="mt-[2rem] flex h-[20rem] flex-col justify-start overflow-y-auto">
            {isFetching && <Loader2 className="mx-auto animate-spin" />}

            {isSuccess &&
              !isFetching &&
              data.users.map((user) => {
                return (
                  <UserSearchResult
                    key={user.id}
                    user={user}
                    selected={selectedusers.some((u) => u.id === user.id)}
                    handleSelectUser={() => {
                      setSelectedUsers((prev) => {
                        const selectedUser = prev.some((u) => u.id === user.id);
                        if (selectedUser) {
                          return prev.filter((u) => u.id !== user.id);
                        }

                        return [...prev, user];
                      });
                    }}
                  />
                );
              })}

            {isSuccess && !isFetching && data.users.length === 0 && (
              <p className="text-center">No User Found</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-end">
          <Button
            isLoading={mutation.isPending}
            disabled={selectedusers.length === 0 || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="w-fit"
          >
            Create Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type UserSearchResult = {
  user: StreamChatUser;
  selected: boolean;
  handleSelectUser: () => void;
};

export function UserSearchResult({
  user,
  selected,
  handleSelectUser,
}: UserSearchResult) {
  return (
    <button
      className={cn(
        "flex w-full items-center justify-between px-2 py-3 hover:bg-muted/50",
      )}
      onClick={handleSelectUser}
    >
      <div className="flex gap-3">
        <UserAvatar avatarUrl={user.image} />
        <div>
          <p className="text-[1.1rem]">{user.name}</p>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </div>
      {selected && <CheckIcon className="text-primary" />}
    </button>
  );
}

type SelectedUserTagProps = {
  user: StreamChatUser;
  handleRemoveUser: () => void;
};

function SelectedUserTag({ user, handleRemoveUser }: SelectedUserTagProps) {
  return (
    <button
      className="flex items-center gap-2 rounded-full border-2 px-3 py-1 hover:bg-muted/50"
      onClick={handleRemoveUser}
    >
      <UserAvatar avatarUrl={user.image} size={20} />
      <p className="">{user.name}</p>
      <X className="size-5 text-muted-foreground" />
    </button>
  );
}
