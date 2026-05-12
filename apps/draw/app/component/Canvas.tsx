import { useEffect, useRef } from "react";
import { initDraw } from "../draw/page";

export default function Canvas({roomId,socket}:{
    roomId:string,
    socket:WebSocket
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
        useEffect(() => {
    if (canvasRef.current) {
        initDraw(canvasRef.current,roomId,socket)
    
    }
  }, []);
  return <div className="100-vh bg-black">
      <canvas
        ref={canvasRef}
        height={600}
        width={800}
      ></canvas>
    </div>
}