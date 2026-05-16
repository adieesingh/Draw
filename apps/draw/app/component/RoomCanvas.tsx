"use client";
import { useEffect, useRef, useState } from "react";
import { WS_URL } from "@/config";
import Canvas from "./Canvas";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, SetSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ZWQzMWJmNy05NzZhLTRiNDEtOGE0My0wMjg1MjdlMWU4ZDEiLCJpYXQiOjE3Nzg1MTMzMjl9.xsx41Qr1RL8onu5WkSw5K-DL32_symNJtahofvD0_F8`,
    );
    ws.onopen = () => {
      SetSocket(ws);
      const data =JSON.stringify({
        type:"join_room",
        roomId
      })
      ws.send(data)
    };
  }, []);

  if (!socket) {
    return <div>Connection to server ...</div>;
  }
  return <Canvas roomId={roomId} socket={socket}></Canvas>;
}
