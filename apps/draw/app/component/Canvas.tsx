import { useEffect, useRef, useState } from "react";
import { Game } from "../draw/Games";
import { Icon } from "./IconButton";
import { Circle, Pencil, RectangleEllipsis } from "lucide-react";

export  type Tool ="circle"|"rect"|"pencil";
export default function Canvas({roomId,socket}:{
    roomId:string,
    socket:WebSocket
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const[game,setGame]=useState<Game>();
    const[selectedTool,setSelectedTool]=useState<Tool>("circle")
    useEffect(()=>{
      game?.setTool(selectedTool);
      
    },[selectedTool,game])
        useEffect(() => {
    if (canvasRef.current) {
      const g =new Game(canvasRef.current,socket,roomId)
      setGame(g)
      return ()=>{
         g.destroy();
      }
     

    }
  }, [canvasRef]);
  return <div className="h-screen overflow-hidden">
      <canvas height={window.innerHeight} width={window.innerWidth} ref={canvasRef}></canvas>
      <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool}></TopBar>
    </div>
}

function TopBar({selectedTool,setSelectedTool}:{
  selectedTool:Tool,
  setSelectedTool:(e:Tool)=>void
}){
  return <div style={{
    position:"fixed",
    top:10,
    left:10
  }}>
    <div className="flex gap-t">
      <Icon icon={<Pencil></Pencil>} activated={selectedTool==="pencil"} onClick={()=>setSelectedTool("pencil")}></Icon>
      <Icon icon={<RectangleEllipsis></RectangleEllipsis>} activated={selectedTool==="rect"} onClick={()=>setSelectedTool("rect")}></Icon>
      <Icon activated={selectedTool==="circle"} icon={<Circle></Circle>} onClick={()=>setSelectedTool("circle")}></Icon>
    </div>
  </div>

}