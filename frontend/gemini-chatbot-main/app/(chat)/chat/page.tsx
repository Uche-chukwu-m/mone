import { Chat } from "@/components/custom/chat";
import { generateUUID } from "@/lib/utils";

export default async function ChatPage() {
  const id = generateUUID();
  return <Chat key={id} id={id} initialMessages={[]} />;
}
