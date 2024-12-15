import clsx from "clsx";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { FC, useState } from "react";
import dayjs from "dayjs";

type Props = {
  type: "buy" | "sell";
  userID: string;
  price: number;
  currency: string;
  symbol: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};
export const BuySell: FC<Props> = ({ type, userID, symbol, currency, price, isOpen, onOpenChange }) => {
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);

  const header = type === "buy" ? "ซื้อทอง" : "ขายทอง";

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseInt(e.target.value, 10);
    setAmount(newAmount);
    const newQuantity = parseFloat((newAmount / price).toFixed(5));
    setQuantity(newQuantity);
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/tx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: symbol.toUpperCase(),
        state: type.toUpperCase(),
        quantity,
        price,
        amount,
        date: dayjs().unix(),
        user_id: userID,
      }),
    });
    if (!res.ok) return alert("Failed to create transaction");
    onOpenChange(false);
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-2">
              <span>{header}</span>
              <span>
                {symbol} {symbol !== "spot" ? "%" : ""}
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center justify-center">
                <div
                  className={clsx(
                    "text-2xl font-extrabold flex gap-2",
                    type === "buy" ? "text-green-600" : "text-red-600"
                  )}
                >
                  <p className="text-gray-500 font-medium text-lg">ราคา{type === "buy" ? "ซื้อ" : "ขาย"}</p>
                  <p className="text-sm">{currency}</p>
                </div>
                <p
                  className={clsx(
                    "text-2xl font-extrabold flex gap-2",
                    type === "buy" ? "text-green-600" : "text-red-600"
                  )}
                >
                  {price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="my-4 space-y-2">
                <div className="font-semibold text-gray-500">
                  จำนวนเงินที่ต้องการ{type === "buy" ? "ซื้อ" : "ขาย"}
                </div>
                <Input type="number" endContent="บาท" placeholder="Amount" onChange={handleQuantityChange} />
              </div>
              <div className="font-semibold text-gray-500 text-end">
                จำนวนทองที่ได้รับ {isNaN(quantity) ? 0 : quantity} ทองบาท
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-around">
              <Button className="text-gray-500 font-medium text-md" variant="light" onPress={onClose}>
                ยกเลิก
              </Button>
              <Button
                className="text-md"
                color="primary"
                onPress={handleSubmit}
                isDisabled={isNaN(quantity) || isNaN(amount)}
              >
                ยืนยันการ{type === "buy" ? "ซื้อ" : "ขาย"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
