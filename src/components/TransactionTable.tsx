import dayjs from "dayjs";
import { Transaction } from "@prisma/client";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { FC, useMemo, useState } from "react";

export const TransactionTable: FC<{ data: Transaction[] }> = ({ data }) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(data.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data]);

  return (
    <Table
      isStriped
      aria-label="transaction table"
      bottomContent={
        data.length > 0 && (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        )
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
    >
      <TableHeader>
        <TableColumn>Symbol</TableColumn>
        <TableColumn>Price</TableColumn>
        <TableColumn>Quantity</TableColumn>
        <TableColumn>Amount</TableColumn>
        <TableColumn>State</TableColumn>
        <TableColumn>Date</TableColumn>
      </TableHeader>

      <TableBody items={items} emptyContent={"ไม่พบข้อมูลการซื้อขาย"}>
        {(tx) => (
          <TableRow key={tx.id}>
            <TableCell>{tx.symbol}</TableCell>
            <TableCell>{tx.price.toLocaleString()}</TableCell>
            <TableCell>{tx.quantity}</TableCell>
            <TableCell>{tx.amount.toLocaleString()}</TableCell>
            <TableCell>{tx.state}</TableCell>
            <TableCell>{dayjs.unix(tx.date).format("DD/MM/YYYY HH:mm:ss")}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
