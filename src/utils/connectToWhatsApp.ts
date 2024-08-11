import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import { chatPrompt } from "../prompts/chatPrompt";

export default async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect?.error,
        ", reconnecting ",
        shouldReconnect,
      );
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });

  sock.ev.on("messages.upsert", async (m) => {
    const message = m.messages[0];
    if (!message.key.fromMe && message.message) {
      const remoteJid = message.key.remoteJid!;
      console.log("Received a message from", remoteJid);

      console.log("A messagem foi: ", message.message);
      const AIresponse = await chatPrompt(`${message.message.conversation}`);

      await sock.sendMessage(remoteJid, {
        text: AIresponse.text,
      });
    }
  });

  sock.ev.on("creds.update", saveCreds);
}
