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
      endX: number;
      endY: number;
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
  private selectedTool: Tool = "panTool";
private scale :number =1;
private panX :number =0;
private panY :number =0;

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.socket = socket;
    this.roomId = roomId;
    this.existingShape = [];
    this.clearCanvas();
    this.canvas.width=document.body.clientWidth;
    this.canvas.height = document.body.clientHeight
    this.init();
    this.clicked = false;
    this.initHandler();
    this.initMouseHandler();
  }
  async init() {
    let existingShape: Shape[] = await getExistingShape(this.roomId);
  }
  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("wheel",this.mouseWheelHandler);
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
  setTool(tool: "circle" | "rect" | "pencil" |"panTool") {
    this.selectedTool = tool;
  }
  clearCanvas() {
    this.ctx.setTransform(this.scale,0,0,this.scale,this.panX,this.panY)
   this.ctx.clearRect(-this.panX/this.scale,-this.panY/this.scale,
    this.canvas.width/this.scale,this.canvas.height/this.scale);

    this.ctx.fillStyle = "rgba(18,18,18)";
    this.ctx.fillRect(-this.panX/this.scale,-this.panY/this.scale,
      // adjust the sclae 
      this.canvas.width/this.scale,
      this.canvas.height/this.scale
      //adjust the scale in cANVAS
      
    )
    
   
    this.existingShape.map((shape) => {
      if (shape.type == "rect") {
        this.ctx.strokeStyle = "rgba(255,255,255)";

        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type == "circle") {
        this.ctx.beginPath();
        this.ctx.arc(shape.x, shape.y, Math.abs(shape.radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type == "pencil") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
      }
    });
  }

  mouseDownHandler = (e:MouseEvent) => {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  };
 
  mouseWheelHandler =(e:WheelEvent)=>{
    e.preventDefault();
      const scaleAmount = -e.deltaY/500;
      const newScale = this.scale*(1+scaleAmount);
      const mouseX = e.clientX-this.canvas.offsetLeft;
      const mouseY =e.clientY-this.canvas.offsetTop;
      //Position on cursor on canavas
      const canvasMouseX = (mouseX-this.panX)/this.scale;
      const canavasMouseY =(mouseY-this.panY)/this.scale;

      this.panX=(canvasMouseX*newScale-canvasMouseX*this.scale);
      this.panY=(canvasMouseX*newScale-canavasMouseY*this.scale);
      this.scale=newScale;
      this.clearCanvas()
  }
 
  mouseUpHandler = (e:MouseEvent) => {
    this.clicked = false;
    const width = (e.clientX - this.startX)/this.scale;
    const height = (e.clientY - this.startY)/this.scale;
    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;
    if (selectedTool == "rect") {
      shape = {
        type: "rect",
        x: (this.startX-this.panX)/this.scale,
        y: (this.startY-this.panY)/this.scale,
        width,
        height,
      };
    } else if (selectedTool == "circle") {
      const radius = Math.max(width, height) / 2;
      shape = {
        type: "circle",
        radius: radius,
        x: ((this.startX-this.panX) + radius),
        y: ((this.startY-this.panY)/this.scale + radius),
      };
    } else if (selectedTool == "pencil") {
      shape = {
        type: "pencil",
        startX: (this.startX-this.panX)/this.scale,
        startY: (this.startY-this.panY)/this.scale,
        endX: (e.clientX-this.panX)/this.scale,
        endY: (e.clientY-this.panY)/this.scale,
      };
    } else if(selectedTool==="panTool"){
      this.startX=e.clientX;
      this.startY=e.clientY;

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

  mouseMoveHandler = (e:MouseEvent) => {
    if (this.clicked) {
      const width = (e.clientX - this.startX)/this.scale;
      const height = (e.clientY - this.startY)/this.scale;
      this.clearCanvas();
      this.ctx.strokeStyle = "rgba(255,255,255)";
      const selectedTool = this.selectedTool;
      if (selectedTool == "rect") {
        this.ctx.strokeRect((this.startX-this.panX)/this.scale, (this.startY-this.panY)/this.scale, width, height);
      } else if (selectedTool == "circle") {
        const radius = Math.max(width, height) / 2;
        const centerX = ((this.startX-this.panX)/this.scale) + radius;
        const centerY =(( this.startY -this.panY)/this.scale)+ radius;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (this.selectedTool == "pencil") {
        this.ctx.beginPath();
        this.ctx.moveTo((this.startX-this.panX)/this.scale, (this.startY=this.panX)/this.scale);
        this.ctx.lineTo((e.clientX-this.panX)/this.scale, (e.clientY-this.panY)/this.scale);
        this.ctx.stroke();
      }
    }else if(this.selectedTool=="panTool"){
      const mouseX = e.clientX-this.startX;
      const mouseY =e.clientY-this.startY;
      this.panX+=mouseX/this.scale;
      this.panY+=mouseY/this.scale;
      this.clearCanvas()


    }
  };
  initMouseHandler() {
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
  }
}
