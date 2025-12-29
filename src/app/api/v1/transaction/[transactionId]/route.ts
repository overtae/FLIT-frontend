import { NextResponse } from "next/server";

import { mockTransactionDetails, mockCanceledTransactions } from "@/data/transaction";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";
import type { TransactionDetail } from "@/types/transaction.type";

export async function GET(_request: Request, { params }: { params: Promise<{ transactionId: string }> }) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { transactionId } = await params;
      const id = parseInt(transactionId);

      let transaction: TransactionDetail | undefined;

      if (id < 1000) {
        transaction = mockTransactionDetails[id];
      } else {
        const canceledTransaction = mockCanceledTransactions.find((t) => t.transactionId === id);
        if (canceledTransaction) {
          const date = new Date(canceledTransaction.orderDate);
          date.setHours(15, 30, 0);

          transaction = {
            transactionId: canceledTransaction.transactionId,
            transactionNumber: canceledTransaction.transactionNumber,
            from: {
              nickname: canceledTransaction.fromNickname,
              loginId: canceledTransaction.fromLoginId,
              phoneNumber: `010-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
              address: "서울시 강남구",
              detailAddress: `${Math.floor(Math.random() * 100)}동 ${Math.floor(Math.random() * 100)}호`,
            },
            to: {
              nickname: canceledTransaction.toNickname,
              loginId: canceledTransaction.toLoginId,
              phoneNumber: `010-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
              address: "서울시 서초구",
              detailAddress: `${Math.floor(Math.random() * 100)}동 ${Math.floor(Math.random() * 100)}호`,
            },
            productName: canceledTransaction.productName,
            productImageUrl: canceledTransaction.productImageUrl,
            paymentAmount: canceledTransaction.paymentAmount,
            reserve: Math.floor(canceledTransaction.paymentAmount * 0.01),
            customerRequest: "",
            orderDate: canceledTransaction.orderDate,
            paymentDate: canceledTransaction.paymentDate,
            paymentMethod: "CARD",
            deliveryStatus: "CANCELED",
            type: "REFUND",
          };
        }
      }

      if (!transaction) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
      }
      return NextResponse.json(transaction);
    }

    const { transactionId } = await params;
    const response = await fetchWithAuth(`/transaction/${transactionId}`);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ transactionId: string }> }) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json({ success: true });
    }

    const { transactionId } = await params;
    const response = await fetchWithAuth(`/transaction/${transactionId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}
