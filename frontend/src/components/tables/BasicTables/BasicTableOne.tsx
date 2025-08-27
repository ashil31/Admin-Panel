import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import api from "../../../api/axios";
import socket from "../../../socket/socket";
import { useEffect, useState } from "react";
import Button from "../../ui/button/Button";
import Alert from "../../../components/ui/alert/Alert";

interface User {
  _id: string;
  name: string;
  occupation: string;
  qrSerialNumber: string;
  pumpSerialNumber: string;
  upiId: string;
  accountNumber: string;
  ifsc: string;
  beneficiaryName: string;
  rewardSent: "YES" | "NO";
  createdAt: string;
}

type RewardAmounts = {
  [userId: string]: string;
};

export default function BasicTableOne() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [rewardAmounts, setRewardAmounts] = useState<RewardAmounts>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // ✅
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // ✅

  const load = async () => {
    try {
      const res = await api.get("/users", { params: { page } });
      const visibleUsers: User[] = res.data.users
        .filter((u: User) => u.rewardSent !== "YES")
        .sort((a: User, b: User) => b._id.localeCompare(a._id));
      setUsers(visibleUsers);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const updateRewardStatus = async (id: string, status: "YES" | "NO") => {
    try {
      const amount = rewardAmounts[id];

      if (!amount) {
        setErrorMessage("Please enter a reward amount before updating status.");
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }

      await api.patch(`/users/${id}/reward`, {
        rewardSent: status,
        amount: Number(amount),
      });

      if (status === "YES") {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        setSuccessMessage("🎉 Reward successfully sent and user removed.");
        setTimeout(() => setSuccessMessage(null), 3000);
      }

      await load();
    } catch (err) {
      console.error("Failed to update reward status:", err);
      setErrorMessage("Something went wrong. Please try again.");
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  const handleAmountChange = (id: string, value: string) => {
    setRewardAmounts((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  useEffect(() => {
    load();

    const handleRewardUpdate = () => load();

    const handleNewUser = (newUser: User) => {
      if (newUser.rewardSent !== "YES") {
        setUsers((prevUsers) => {
          const updated = [newUser, ...prevUsers]
            .slice(0, 10)
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
          return updated;
        });
      }
    };

    socket.on("rewardUpdated", handleRewardUpdate);
    socket.on("newUser", handleNewUser);

    return () => {
      socket.off("rewardUpdated", handleRewardUpdate);
      socket.off("newUser", handleNewUser);
    };
  }, []);
  
  useEffect(() => {
  load();
}, [page]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl bg-white dark:border-white/[0.05] dark:bg-white/[0.03] dark:hover:shadow-white/5">
      {/* ✅ Alert section */}
      {successMessage && (
        <div className="p-4">
          <Alert variant="success" title="Success" message={successMessage} />
        </div>
      )}
      {errorMessage && (
        <div className="p-4">
          <Alert variant="error" title="Error" message={errorMessage} />
        </div>
      )}

      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {/* ... unchanged headers ... */}
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                #
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                QR Serial
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                SerialNumber
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                UPI ID
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                A/C
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                IFSC Code
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Banificary Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Reward Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Reward Amount
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Reward Update
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {users.map((u, id) => (
              <TableRow key={id}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {(page - 1) * 10 + id + 1}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {u.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {u.occupation}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {u.qrSerialNumber}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {u.pumpSerialNumber}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {u.upiId}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {u.accountNumber}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {u.ifsc}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {u.beneficiaryName}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      u.rewardSent === "YES"
                        ? "success"
                        : u.rewardSent === "NO"
                        ? "warning"
                        : "error"
                    }
                  >
                    {u.rewardSent}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="inline-flex items-center rounded-md border border-none bg-muted px-3 py-1 text-sm text-gray-700 dark:bg-white/5 dark:text-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/40">
                    ₹
                    <input
                      type="number"
                      min={0}
                      value={rewardAmounts[u._id] || ""}
                      onChange={(e) =>
                        handleAmountChange(u._id, e.target.value)
                      }
                      className="no-spinner ml-2 w-16 bg-transparent text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="Amt"
                    />
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => updateRewardStatus(u._id, "YES")}
                    >
                      YES
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateRewardStatus(u._id, "NO")}
                    >
                      NO
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center items-center gap-4 py-4">
        <Button
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Page {page} / {totalPages}
        </span>
        <Button
          size="sm"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
