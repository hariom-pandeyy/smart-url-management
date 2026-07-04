import "./StatsCard.css";

type Props = {
  title: string;
  value: string | number;
};

const StatsCard = ({ title, value }: Props) => {
  return (
    <div className="stats-card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
};

export default StatsCard;