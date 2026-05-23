import { Tool } from "../component/Canvas";
import { getExistingShape } from "./http";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      height: number;
      width: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      radius: number;
    }
  | {
      type: "pencil";
      startX: number;
      startY: number;
      endX:number;
      endY:number
    };
export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  socket: WebSocket;
  private roomId: string;
  private existingShape: Shape[];
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "circle";

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.socket = socket;
    this.roomId = roomId;
    this.existingShape = [];
    this.clearCanvas();
    this.init();
    this.clicked = false;
    this.initHandler();
    this.initMouseHandler()
  }
  async init() {
    let existingShape: Shape[] = await getExistingShape(this.roomId);
  }
  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }
  initHandler() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type == "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShape.push(parsedShape.shape);

        this.clearCanvas();
      }
    };
  }
  setTool(tool: "circle" | "rect" | "pencil") {
    this.selectedTool = tool;
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0,0,0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShape.map((shape) => {
      if (shape.type == "rect") {
        this.ctx.strokeStyle = "rgba(255,255,255)";

        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type == "circle") {
        this.ctx.beginPath();
        this.ctx.arc(shape.x, shape.y, Math.abs(shape.radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      }else if(shape.type=="pencil"){
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX,shape.startY);
        this.ctx.lineTo(shape.endX,shape.endY);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    });
  }
  //@ts-ignore
  mouseDownHandler = (e) => {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  };
  //@ts-ignore
  mouseUpHandler = (e) => {
    this.clicked = false;
    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;
    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;
    if (selectedTool == "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width,
        height,
      };
    } else if (selectedTool == "circle") {
      const radius = Math.max(width, height) / 2;
      shape = {
        type: "circle",
        radius: radius,
        x: this.startX + radius,
        y: this.startY + radius,
      } 
    } else if(selectedTool=="pencil"){
      shape={
        type:"pencil",
        startX:this.startX,
        startY:this.startY,
        endX:e.clientX,
        endY:e.clientY
      }
      
    }
     
    
    if (!shape) {
      return;
    }
    this.existingShape.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId: this.roomId,
      }),
    );
  };
  //@ts-ignore
  mouseMoveHandler = (e) => {
    if (this.clicked) {
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;
      this.clearCanvas();
      this.ctx.strokeStyle = "rgba(255,255,255)";
      const selectedTool = this.selectedTool;
      if (selectedTool == "rect") {
        this.ctx.strokeRect(this.startX, this.startX, width, height);
      } else if (selectedTool == "circle") {
        const radius = Math.max(width, height) / 2;
        const centerX = this.startX + radius;
        const centerY = this.startY + radius;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    } else if(this.selectedTool=="pencil"){
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX,this.startY);
      this.ctx.lineTo(e.clientX,e.clientY);
      this.ctx.stroke();
      this.ctx.closePath();


    }
  };
  initMouseHandler() {
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
  }
}
