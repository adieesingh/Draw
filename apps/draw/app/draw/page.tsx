import { BACKEND_URL } from "@/config";
import axios from "axios";

type Shape = {
  type: "rect";
  x: number;
  y: number;
  height: number;
  width: number;
};

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
) {

  const ctx = canvas.getContext("2d");
    let existingShape: Shape[] = await getExistingShape(roomId);
     
  if (!ctx) {
    return;
  }
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type == "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShape?.push(parsedShape.shape);
      clearCanvas(canvas, existingShape, ctx);
    }
  };

  clearCanvas(canvas, existingShape, ctx);
  let clicked = false;
  let startX = 0;
  let startY = 0;
  // MouseDown
  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });
  // Mouse Up
  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    let width = e.clientX - startX;
    let height = e.clientY - startY;
    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      height,
      width,
    };
    existingShape.push(shape);
    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId
      }),
    );
  });

  // Mouse move
  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      let width = e.clientX - startX;
      let height = e.clientY - startY;
      clearCanvas(canvas, existingShape, ctx);

      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

function clearCanvas(
  canvas: HTMLCanvasElement,
  existingShape: Shape[],
  ctx: CanvasRenderingContext2D,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
 
   existingShape?.map((item) => {
    if (item.type == "rect") {
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(item.x, item.y, item.width, item.height);
    }
  });
}

async function getExistingShape(roomId: string) {
  const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
  const messages = res.data.messages;
  const shapes = messages?.map((x: { message: String }) => {
    const messageData = JSON.stringify(x.message);
   
    return messageData;
  });
 
  return shapes;
}
