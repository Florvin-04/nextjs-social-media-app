import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import { useSession } from "../SessionProvider";
import { Button } from "@/components/ui/button";
import { MailPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import NewChatDialog from "./NewChatDialog";
import { useQueryClient } from "@tanstack/react-query";

type ChatSidebarProps = {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
};

export default function ChatSidebar({
  closeSidebar,
  isSidebarOpen,
}: ChatSidebarProps) {
  const { user } = useSession();

  const queryClient = useQueryClient();
  const { channel } = useChatContext();

  const ChannelPreviewCustome = useCallback(
    (props: ChannelPreviewUIComponentProps) => {
      return (
        <ChannelPreviewMessenger
          {...props}
          onSelect={() => {
            props.setActiveChannel?.(props.channel, props.watchers);
            closeSidebar();
          }}
        />
      );
    },
    [],
  );

  useEffect(() => {
    if (channel?.id) {
      queryClient.invalidateQueries({ queryKey: ["unread-messages-count"] });
    }
  }, [queryClient, channel?.id]);

  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex",
        isSidebarOpen ? "flex" : "hidden",
      )}
    >
      <MenuHeader onClose={closeSidebar} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [user.id] },
        }}
        showChannelSearch
        options={{ state: true, presence: true, limit: 10 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: {
                members: {
                  $in: [user.id],
                },
              },
            },
          },
        }}
        Preview={ChannelPreviewCustome}
      />
    </div>
  );
}

type MenuHeaderProps = {
  onClose: () => void;
};

function MenuHeader({ onClose }: MenuHeaderProps) {
  const [isOpenNewChatDialog, setIsOpenNewChatDialog] = useState(false);
  return (
    <>
      <div className="px-3">
        <div className="flex items-center">
          <Button
            className="block md:hidden"
            icon={<X className="size-5" />}
            variant="ghost"
            size="icon"
            onClick={onClose}
          />
          <p>Messages</p>
          <Button
            className="ml-auto"
            icon={<MailPlus className="size-4" />}
            variant="ghost"
            size="icon"
            onClick={() => setIsOpenNewChatDialog(true)}
          />
        </div>
      </div>
      {isOpenNewChatDialog && (
        <NewChatDialog
          onChatCreated={() => {
            setIsOpenNewChatDialog(false);
            onClose();
          }}
          closeDialog={() => setIsOpenNewChatDialog(false)}
        />
      )}
    </>
  );
}
