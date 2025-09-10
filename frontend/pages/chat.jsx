// Chat.jsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import { useSearchParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const Chat = () => {
  const { user, socket } = useAuthStore();
  const [searchParams] = useSearchParams();
  const receiverUsername = searchParams.get("receiver");
 // Always opposite of logged-in user's accountType
  const receiverType = user?.accountType === "Farmer" ? "User" : "Farmer";
  const [receiverId, setReceiverId] = useState(null); // resolved ObjectId from backend
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // helper to normalize accountType
  const mapSenderType = (accountType) => {
    if (accountType === "Consumer") return "User";
    if (accountType === "Farmer") return "Farmer";
    return "User";
  };

  // 🔹 Fetch receiverId first (backend should give ID from username)
  useEffect(() => {
    const fetchReceiverId = async () => {
      try {
        const res = await axiosInstance.get(
          `/resolve-user?username=${receiverUsername}&type=${receiverType}`
        );
        setReceiverId(res.data.id);

        // then fetch chat history
       const history = await axiosInstance.get(
          `/chat/${user.id}/${res.data.id}`  
        );
        setMessages(history.data);
      } catch (err) {
        console.error("Error fetching receiver or chats", err);
      }
    };

    if (receiverUsername && user) fetchReceiverId();
  }, [receiverUsername, receiverType, user]);

  // 🔹 Setup socket
  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("register", user.id);

    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, [socket, user]);

  // 🔹 Send message
const sendMessage = () => {
  if (!newMessage.trim() || !receiverId) return;

  const msg = {
    sender: user.id,
    senderType: mapSenderType(user.accountType), // ✅ always mapped
    receiver: receiverId,
    receiverType,  // also should be mapped if it can be "Consumer"
    message: newMessage,
  };

  socket.emit("chat message", msg);
  setNewMessage("");
};

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="p-4 bg-green-600 text-white font-bold text-lg">
        Chat with {receiverUsername}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded-lg max-w-xs ${
              m.sender === user.id
                ? "ml-auto bg-green-500 text-white"
                : "mr-auto bg-gray-300 text-black"
            }`}
          >
            {m.message}
          </div>
        ))}
      </div>

      <div className="p-4 bg-white flex gap-2 border-t">
        <input
          type="text"
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
