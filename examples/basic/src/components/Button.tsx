import React from "react";

type ButtonProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function Button(props: ButtonProps) {
  return <button className="btn" {...props} />;
}
