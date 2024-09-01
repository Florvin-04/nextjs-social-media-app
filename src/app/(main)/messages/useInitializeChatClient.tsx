import { useEffect, useState } from "react";
import { useSession } from "../SessionProvider";
import { StreamChat } from "stream-chat";
import { CONFIG_APP } from "@/config";
import KyInstance from "@/lib/ky";

export default function useInitializeChatClient() {
  const { user } = useSession();

  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    const client = StreamChat.getInstance(CONFIG_APP.env.STREAM_KEY!);

    client
      .connectUser(
        {
          id: user.id,
          name: user.displayName,
          image: user.avatarUrl,
          username: user.username,
        },
        async () =>
          KyInstance.get(`/api/get-stream-chat-token`)
            .json<{ token: string }>()
            .then((data) => data.token),
      )
      .catch((error) => console.error("Failed to connect user", error))
      .then(() => setChatClient(client));

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((error) => console.error("Failed to disconnect user", error))
        .then(() => console.log("User disconnected"));
    };
  }, [user.id, user.displayName, user.avatarUrl, user.username]);

  return chatClient;
}
