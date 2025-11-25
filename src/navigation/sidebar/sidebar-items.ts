import {
  Users,
  ShoppingCart,
  TrendingUp,
  Receipt,
  Megaphone,
  Store,
  HeadphonesIcon,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 2,
    label: "관리",
    items: [
      {
        title: "유저관리",
        url: "/dashboard/users",
        icon: Users,
        subItems: [
          { title: "Customer", url: "/dashboard/users/customer" },
          { title: "Shop", url: "/dashboard/users/shop" },
          { title: "Florist", url: "/dashboard/users/florist" },
          { title: "Seceder", url: "/dashboard/users/seceder" },
        ],
      },
      {
        title: "거래관리",
        url: "/dashboard/transactions",
        icon: ShoppingCart,
        subItems: [
          { title: "Order", url: "/dashboard/transactions/order" },
          { title: "수발주", url: "/dashboard/transactions/order-request" },
          { title: "Canceled", url: "/dashboard/transactions/canceled" },
        ],
      },
      {
        title: "매출관리",
        url: "/dashboard/sales",
        icon: TrendingUp,
        subItems: [
          { title: "매출분석", url: "/dashboard/sales/revenue" },
          { title: "상품분석", url: "/dashboard/sales/products" },
          { title: "고객분석", url: "/dashboard/sales/customers" },
          { title: "주문분석", url: "/dashboard/sales/orders" },
        ],
      },
      {
        title: "정산관리",
        url: "/dashboard/settlements",
        icon: Receipt,
      },
      {
        title: "공지관리",
        url: "/dashboard/notices",
        icon: Megaphone,
        comingSoon: true,
      },
      {
        title: "입점센터",
        url: "/dashboard/onboarding",
        icon: Store,
        comingSoon: true,
      },
      {
        title: "고객센터",
        url: "/dashboard/support",
        icon: HeadphonesIcon,
        comingSoon: true,
      },
    ],
  },
];
