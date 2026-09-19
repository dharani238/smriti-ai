interface BigButtonProps {
  text: string;
  icon?: string;
  onClick?: () => void;
}

function BigButton({
  text,
  icon,
  onClick,
}: BigButtonProps) {

  return (
    <button
      className="big-button"
      onClick={onClick}
    >
      {icon} {text}
    </button>
  );
}

export default BigButton;