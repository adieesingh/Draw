interface HeadProps {
  text: string;
}

export const Head = (props: HeadProps) => {
  return <h2 className="text-2xl font-bold text-center mb-6">{props.text}</h2>;
};
