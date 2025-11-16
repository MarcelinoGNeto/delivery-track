"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Printer } from "lucide-react";

interface OrderPaginationProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  page: number;
  onPageChange: (page: number) => void;
  total: number;
  limit?: number;
}

export default function OrderPagination({
  selectedDate,
  onDateChange,
  page,
  onPageChange,
  total,
  limit = 10,
}: OrderPaginationProps) {
  const dateStr = selectedDate.toISOString().split("T")[0];
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-4">
        <input
          type="date"
          value={dateStr}
          onChange={(e) => {
            onDateChange(new Date(e.target.value));
            onPageChange(1);
          }}
          className="border rounded p-2"
        />
        <Button variant="outline">
        <Printer className="cursor-pointer" />
        </Button>
            
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ArrowLeft className="mr-2" />
        </Button>
        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
