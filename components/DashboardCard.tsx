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
      className={`${colorClasses[color]} text-white p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl shadow-lg cursor-pointer transition-colors`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-white/80 text-xs sm:text-sm font-medium truncate">
            {title}
          </p>
          <p className="text-base sm:text-lg lg:text-2xl font-bold truncate">
            {value}
          </p>
        </div>
        {icon && (
          <div className="text-white/80 flex-shrink-0 ml-2 scale-75 sm:scale-100">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
