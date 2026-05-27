import { useEffect, useRef, useState } from "react";
import { Game } from "../draw/Games";
import { Icon } from "./IconButton";
import { Circle, Hand, Pencil, RectangleEllipsis, Slash } from "lucide-react";

export  type Tool ="circle"|"rect"|"pencil"|"panTool";
export default function Canvas({roomId,socket}:{
    roomId:string,
    socket:WebSocket
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const[game,setGame]=useState<Game>();
    const[selectedTool,setSelectedTool]=useState<Tool>("panTool")
    const[grabbing,setGrabbing]=useState(false)
    useEffect(()=>{
      game?.setTool(selectedTool);
      
    },[selectedTool,game])
        useEffect(() => {
    if (canvasRef.current) {
      const g =new Game(canvasRef.current,socket,roomId)
      setGame(g)
      if(selectedTool=="panTool"){
        const handleGrab =()=>{
          setGrabbing((prev)=>!prev)
        }
        document.addEventListener("mousedown",handleGrab)
      document.addEventListener("mousedown",handleGrab)
       return ()=>{
       document.removeEventListener("mousedown",handleGrab)
       document.removeEventListener("mouseup",handleGrab)
      }
      }
     const handleKeyDown =(e:KeyboardEvent)=>{
      switch(e.key){
        case "1":
          setSelectedTool("panTool");
          break;
          case "2":
          setSelectedTool("pencil");
          break;
          case "3":
          setSelectedTool("rect");
          break;
          case "4":
            setSelectedTool("circle");
            break;

      }
     }
     document.addEventListener("keydown",handleKeyDown)
     return(()=>{
      g.destroy()
     })

    }
  }, [canvasRef]);
  return <div className={`h-screen overflow-hidden ${(selectedTool==="panTool")?(grabbing?"cursor-grabbing":"cursor-grab"):"cursor-crosshair"}`}>
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
      <Icon shortKey={2} icon={<Slash></Slash>} activated={selectedTool==="pencil"} onClick={()=>setSelectedTool("pencil")}></Icon>
      <Icon shortKey={3} icon={<RectangleEllipsis></RectangleEllipsis>} activated={selectedTool==="rect"} onClick={()=>setSelectedTool("rect")}></Icon>
      <Icon shortKey={4} activated={selectedTool==="circle"} icon={<Circle></Circle>} onClick={()=>setSelectedTool("circle")}></Icon>
      <Icon icon={<Hand></Hand>} shortKey={1} onClick={()=>setSelectedTool("panTool")} activated={selectedTool==="panTool"}></Icon>
    </div>
    <p className="text-white/30 mt-1 absolute w-full mx-auto scale-[0.8] text-sm text-center">To zoom, use scroll or pinch!</p>
  </div>

}