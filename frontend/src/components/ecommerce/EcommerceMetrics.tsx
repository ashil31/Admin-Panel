import { ArrowUpIcon, ArrowDownIcon, GroupIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function EcommerceMetrics() {
  const [userCount, setUserCount] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [isPositive, setIsPositive] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await api.get("/users/monthly-users");
        const data = res.data.monthlyUserCounts;

        const currentMonth = new Date().getMonth(); // 0-indexed
        const currentCount = data[currentMonth] || 0;
        const prevCount = data[currentMonth - 1] || 0;

        setUserCount(currentCount);

        if (prevCount === 0) {
          setGrowth(currentCount > 0 ? 100 : 0); // avoid divide by zero
          setIsPositive(true);
        } else {
          const diff = ((currentCount - prevCount) / prevCount) * 100;
          setGrowth(Math.abs(Number(diff.toFixed(2))));
          setIsPositive(diff >= 0);
        }
      } catch (error) {
        console.error("Failed to fetch user stats", error);
      }
    };

    fetchUserStats();
  }, []);

  return (
    <div className="rounded-2xl h-full border border-gray-200 bg-white px-8 py-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
            <GroupIcon className="size-8 text-gray-800 dark:text-white/90" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              Customers
            </p>
            <h4 className="mt-1 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              {userCount.toLocaleString()}
            </h4>
          </div>
        </div>

        <Badge
          color={isPositive ? "primary" : "warning"}
        >
          {isPositive ? (
            <ArrowUpIcon className="size-4" />
          ) : (
            <ArrowDownIcon className="size-4" />
          )}
          {growth}%
        </Badge>
      </div>
    </div>
  );
}
