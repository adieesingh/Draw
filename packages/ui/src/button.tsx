interface ButtonProps {
  text: string;
  className?: string;
  onClick:React.MouseEventHandler<HTMLElement>
  type:"submit" | "reset" | "button" 
 
}

export const Button = (props: ButtonProps) => {
  return (
    <button
      type={props.type}
      className={`w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 ${props.className}`}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};
