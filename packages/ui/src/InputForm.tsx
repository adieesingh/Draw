interface InputProps{
    type:string,
    placeholder:string,
    onChange:React.ChangeEventHandler<HTMLInputElement>,
    value:string
}
export const InputForm=(props:InputProps)=>{
        return <input
            type={props.type}
            value={props.value}
            placeholder={props.placeholder}
            onChange={props.onChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />  
}