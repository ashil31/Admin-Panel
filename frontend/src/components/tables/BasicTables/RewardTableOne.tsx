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
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Button from "../../ui/button/Button";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface RewardedUser {
  _id: string;
  name: string;
  occupation?: string;
  qrSerialNumber?: string;
  pumpSerialNumber?: string;
  rewardSent: "YES" | "NO";
  amount?: number;
  createdAt?: string;
}

interface RewardedUser {
  _id: string;
  name: string;
  occupation?: string;
  qrSerialNumber?: string;
  pumpSerialNumber?: string;
  rewardSent: "YES" | "NO";
  amount?: number;
  createdAt?: string;
}

const RewardTableOne = forwardRef((_, ref) => {
  const [users, setUsers] = useState<RewardedUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async () => {
    try {
      const res = await api.get("/users/rewarded", { params: { page } });
      const visibleUsers: RewardedUser[] = res.data.rewards
        .filter(
          (u: { user?: RewardedUser; rewardSent: "YES" | "NO" }) =>
            u.rewardSent === "YES" && u.user
        )
        .map(
          (r: {
            user: RewardedUser;
            rewardSent: "YES" | "NO";
            amount?: number;
          }) => ({
            ...r.user, // flatten user fields into top-level object
            rewardSent: r.rewardSent,
            amount: r.amount,
          })
        )
        .sort((a: RewardedUser, b: RewardedUser) => b._id.localeCompare(a._id));
      setUsers(visibleUsers);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  useEffect(() => {
    load();

    const handleRewardUpdate = () => load();

    const handleNewUser = (newUser: RewardedUser) => {
      if (newUser.rewardSent === "YES") {
        setUsers((prevUsers) => {
          const updated = [newUser, ...prevUsers]
            .slice(0, 10)
            .sort(
              (a, b) =>
                new Date(b.createdAt || "").getTime() -
                new Date(a.createdAt || "").getTime()
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
  }, [page]);

  const exportToExcel = () => {
    const data = users.map((u, index) => ({
      "#": index + 1,
      Name: u.name,
      Occupation: u.occupation || "-",
      "QR Serial": u.qrSerialNumber || "-",
      "Serial Number": u.pumpSerialNumber || "-",
      "Reward Status": u.rewardSent,
      "Reward Amount": u.amount ?? "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rewards");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "rewarded-users.xlsx");
  };

  useImperativeHandle(ref, () => ({
    exportToExcel,
  }));

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl bg-white dark:border-white/[0.05] dark:bg-white/[0.03] dark:hover:shadow-white/5">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
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
                Serial Number
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
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {users.map((u, id) => (
              <TableRow key={u._id || id}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {id + 1}
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
                  {u.amount}
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
});

export default RewardTableOne;
