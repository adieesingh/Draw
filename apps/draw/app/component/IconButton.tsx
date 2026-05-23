import { ReactNode } from "react";

export function Icon({activated,onClick,icon}:{
    activated:boolean,
    onClick:()=>void,
    icon:ReactNode
}){
    return <div className={`m-2 pointer rounded-full border p-2 bg-black hover:bg-gray ${activated?"text-red-400":"text-white"}`} onClick={onClick}>
        {icon}
    </div>
}