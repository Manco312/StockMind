"use client";

interface RoleSelectorProps {
  userType: string;
  onUserTypeChange: (type: string) => void;
}

export default function RoleSelector({
  userType,
  onUserTypeChange,
}: RoleSelectorProps) {
  return (
    <div className="flex rounded-full overflow-hidden border-2 border-gray-200">
      <button
        type="button"
        onClick={() => onUserTypeChange("distributor")}
        className={`flex-1 py-3 px-3 text-sm font-semibold transition-colors ${
          userType === "distributor"
            ? "bg-blue-400 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        Soy distribuidor
      </button>
      <button
        type="button"
        onClick={() => onUserTypeChange("store")}
        className={`flex-1 py-3 px-3 text-sm font-semibold transition-colors ${
          userType === "store"
            ? "bg-blue-400 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        Soy dueño de tienda
      </button>
    </div>
  );
}
