import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";

type ChatChannelProps = {
  openSidebar: () => void;
  isSidebarOpen: boolean;
};

export default function ChatChannel({
  isSidebarOpen,
  openSidebar,
}: ChatChannelProps) {
  return (
    <div className={cn("w-full md:block", !isSidebarOpen && "hidden")}>
      <Channel>
        <Window>
          <ChatChannelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}

type CustomeChannelHeaderProps = {
  openSidebar: () => void;
} & ChannelHeaderProps;

function ChatChannelHeader({
  openSidebar,
  ...props
}: CustomeChannelHeaderProps) {
  return (
    <div className="flex items-start">
      <Button
        className="flex md:hidden"
        size="icon"
        variant="ghost"
        icon={<Menu className="size-5" />}
        onClick={openSidebar}
      />
      <ChannelHeader {...props} />
    </div>
  );
}
