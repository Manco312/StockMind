interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  onClick?: () => void;
}

export default function DashboardCard({
  title,
  value,
  icon,
  color = "blue",
  onClick,
}: DashboardCardProps) {
  const colorClasses = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    red: "bg-red-500 hover:bg-red-600",
    purple: "bg-purple-500 hover:bg-purple-600",
  };

  return (
    <div
      className={`${colorClasses[color]} text-white p-6 rounded-xl shadow-lg cursor-pointer transition-colors`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon && <div className="text-white/80">{icon}</div>}
      </div>
    </div>
  );
}
