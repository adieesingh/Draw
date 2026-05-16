import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/jwt";
import { prismaClient } from "@repo/db/prisma";
interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}
const users: User[] = [];
function checkToken(token: string): null | string {
  try {
    const decode = jwt.verify(token as string, JWT_SECRET);
    if (typeof decode === "string") {
      return null;
    }
    if (!decode || !(decode as JwtPayload).userId) {
      return null;
    }
   
    return decode.userId;
  } catch (error) {
    console.log(error);
    return null;
  }
}
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, req: Request) {
  try {
  const url = req.url;
  if (!url) {
    return;
  }
  const Queryparams = new URLSearchParams(url.split("?")[1]);
  const token = Queryparams.get("token");
  if (typeof token !== "string") {
    return;
  }
  const userId = checkToken(token);
  if (userId == null) {
    ws.close();
    return;
  }
  users.push({
    userId,
    ws,
    rooms: [],
  });

  ws.on("message", async function message(data: Object) {
    let parseData;
    if (typeof data !== "string") {
      parseData = JSON.parse(data.toString());
    } else {
      parseData = JSON.parse(data);
    }
   
    if (parseData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      if(!user){
        ws.close();
        return
      }
      user?.rooms.push(parseData.roomId);
      console.log(user)
    }
    if (parseData.type == "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user.rooms.filter((x) => x === parseData.room);
    }
    if (parseData.type == "chat") {
      const roomId = parseData.roomId;
      const message = parseData.message;
     console.log(roomId);
     console.log(message);
     console.log(userId)
      await prismaClient.chat.create({
        data: {
          message: message,
          roomId: Number(roomId),
          userId,
        },
      });

      
     
      users.forEach(user => {
        
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId,
            }),
          );
        }
      });
    }
  });
  } catch (error) {
    ws.send(JSON.stringify(error))
  }
});
