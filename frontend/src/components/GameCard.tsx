interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

function GameCard({
  title,
  description,
  icon,
  onClick,
}: GameCardProps) {

  return (
    <div className="game-card">

      <div className="game-icon">
        {icon}
      </div>

      <h2>{title}</h2>

      <p>{description}</p>

      <button
        className="big-button"
        onClick={onClick}
      >
        PLAY
      </button>

    </div>
  );
}

export default GameCard;