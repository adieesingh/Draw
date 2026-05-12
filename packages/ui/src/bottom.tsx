import Link from "next/link"

interface BottomProps{
    label:string,
    text:string,
    href:string,
    onClick:()=>void
}


export const Bottom =(props:BottomProps)=>{

    return <Link href={props.href}>
    <p className="text-sm text-center mt-4 pt-2" >
          {props.label}
          <span className="text-blue-500 cursor-pointer ml-1" onClick={props.onClick}>
            {props.text}
          </span>
          
      </p>
    </Link>
    
}