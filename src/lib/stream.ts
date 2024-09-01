import { CONFIG_APP } from "@/config";
import { StreamChat } from "stream-chat";

const streamServerClient = StreamChat.getInstance(
  CONFIG_APP.env.STREAM_KEY!,
  CONFIG_APP.env.STREAM_SECRET,
);

export default streamServerClient;
