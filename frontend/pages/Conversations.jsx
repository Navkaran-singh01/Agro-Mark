import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { axiosInstance } from "../lib/axios";

const Conversations = () => {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const res = await axiosInstance.get(`/conversations/${user.id}`);
        setConversations(res.data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };

    fetchConversations();
  }, [user]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      {conversations.length === 0 ? (
        <p className="text-gray-500">No conversations yet.</p>
      ) : (
        <ul className="space-y-3">
          {conversations.map((c) => (
            <li
              key={c.id}
              className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
            >
              <span className="font-semibold">{c.username}</span>
              <Link
                to={`/chat?receiver=${c.username}&receiverType=${c.type}`}
                className="px-3 py-1 bg-green-600 text-white rounded-lg"
              >
                Open Chat
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Conversations;
