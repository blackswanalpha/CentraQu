"use client";

interface ContractOverviewCardsProps {
  active: number;
  pending: number;
  expiring: number;
  expired: number;
  onCardClick?: (status: string) => void;
}

export function ContractOverviewCards({
  active,
  pending,
  expiring,
  expired,
  onCardClick,
}: ContractOverviewCardsProps) {
  const cards = [
    {
      label: "ACTIVE",
      count: active,
      subtitle: "Contracts",
      color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      textColor: "text-green-700 dark:text-green-300",
      status: "active",
    },
    {
      label: "PENDING",
      count: pending,
      subtitle: "Signature",
      color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
      textColor: "text-orange-700 dark:text-orange-300",
      status: "pending",
    },
    {
      label: "EXPIRING",
      count: expiring,
      subtitle: "<30 days",
      color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
      textColor: "text-yellow-700 dark:text-yellow-300",
      status: "expiring",
    },
    {
      label: "EXPIRED",
      count: expired,
      subtitle: "Renew",
      color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
      textColor: "text-red-700 dark:text-red-300",
      status: "expired",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <button
          key={card.status}
          onClick={() => onCardClick?.(card.status)}
          className={`p-6 rounded-lg border-2 ${card.color} hover:shadow-lg transition text-left`}
        >
          <p className={`text-sm font-semibold ${card.textColor} mb-2`}>
            {card.label}
          </p>
          <p className="text-3xl font-bold text-dark dark:text-white mb-1">
            {card.count}
          </p>
          <p className={`text-xs ${card.textColor}`}>{card.subtitle}</p>
        </button>
      ))}
    </div>
  );
}

