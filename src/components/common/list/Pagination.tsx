import type { Table } from "@tanstack/react-table";
import React from "react";
import Button from "../../ui/Button";

interface PaginationProps {
    table: Table<any>
}

const Pagination:React.FC<PaginationProps> = ({table}) => {
  return (
    <div className="flex justify-between bg-bg items-center p-2">
      <div className="text-sm">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </div>
      <div className="inline-flex gap-2">
        <Button
          type="button"
          varinat="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          type="button"
          varinat="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
