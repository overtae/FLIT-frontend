import { fetchWithAuth } from "@/lib/api/client-fetch";
import type {
  TransactionOrderParams,
  Transaction,
  TransactionOrderingParams,
  TransactionCanceledParams,
  TransactionDetail,
} from "@/types/transaction.type";

export async function getTransactionOrders(params?: TransactionOrderParams): Promise<Transaction[]> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.size) searchParams.append("size", params.size.toString());
  if (params?.type) searchParams.append("type", params.type);
  if (params?.paymentDate) searchParams.append("paymentDate", params.paymentDate);
  if (params?.paymentMethod) searchParams.append("paymentMethod", params.paymentMethod);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/v1/transaction/order?${queryString}` : "/api/v1/transaction/order";

  const response = await fetchWithAuth(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch transaction orders");
  }

  return response.json();
}

export async function getTransactionOrdering(params?: TransactionOrderingParams): Promise<Transaction[]> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.size) searchParams.append("size", params.size.toString());
  if (params?.paymentDate) searchParams.append("paymentDate", params.paymentDate);
  if (params?.paymentMethod) searchParams.append("paymentMethod", params.paymentMethod);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/v1/transaction/ordering?${queryString}` : "/api/v1/transaction/ordering";

  const response = await fetchWithAuth(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch transaction ordering");
  }

  return response.json();
}

export async function getCanceledTransactions(params?: TransactionCanceledParams): Promise<Transaction[]> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.size) searchParams.append("size", params.size.toString());
  if (params?.type) searchParams.append("type", params.type);
  if (params?.status) searchParams.append("status", params.status);
  if (params?.orderDate) searchParams.append("orderDate", params.orderDate);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/v1/transaction/canceled?${queryString}` : "/api/v1/transaction/canceled";

  const response = await fetchWithAuth(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch canceled transactions");
  }

  return response.json();
}

export async function getTransaction(transactionId: number): Promise<TransactionDetail> {
  const response = await fetch(`/api/v1/transaction/${transactionId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch transaction");
  }

  return response.json();
}

export async function deleteTransaction(transactionId: number): Promise<void> {
  const response = await fetchWithAuth(`/api/v1/transaction/${transactionId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete transaction");
  }
}
