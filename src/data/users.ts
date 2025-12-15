import { User } from "@/types/dashboard";

const baseUsers: User[] = [
  {
    id: "1",
    category: "customer",
    grade: "Green",
    name: "전수민",
    nickname: "오후(jeon)",
    email: "jeon@gmail.com",
    address: "서울시 노원구 동일로 174길 27",
    phone: "010-0000-0000",
    lastAccessDate: "2022.11.07",
    joinDate: "2022.10.24",
  },
  {
    id: "2",
    category: "shop",
    grade: "Flinney",
    name: "아이와",
    nickname: "아이와(Amihwa)",
    email: "amihwa@gmail.com",
    address: "서울시 노원구 동일로 174길 27",
    phone: "010-0000-0000",
    lastAccessDate: "2022.11.07",
    joinDate: "2022.11.07",
  },
  {
    id: "3",
    category: "florist",
    grade: "Silver",
    name: "이플로리스트",
    nickname: "florist123",
    email: "florist@example.com",
    address: "서울시 마포구",
    phone: "010-3456-7890",
    lastAccessDate: "2024-01-13",
    joinDate: "2023-03-01",
  },
];

const categories: User["category"][] = ["customer", "shop", "florist"];
const grades = ["Green", "Yellow", "Orange", "Red", "Silver", "Gold", "Flinney"];
const names = ["김철수", "이영희", "박민수", "정수진", "최지영", "강호영", "윤서연", "장민준", "임수아", "한지우"];
const regions = [
  "서울시 강남구",
  "서울시 서초구",
  "서울시 마포구",
  "서울시 노원구",
  "서울시 송파구",
  "경기도 성남시",
  "인천시 남동구",
  "부산시 해운대구",
];

export const mockUsers: User[] = [
  ...baseUsers,
  ...Array.from({ length: 297 }, (_, i) => {
    const id = (i + 4).toString();
    const category = categories[i % categories.length];
    const grade = grades[i % grades.length];
    const name = names[i % names.length];
    const region = regions[i % regions.length];
    const year = 2020 + (i % 5);
    const month = String((i % 12) + 1).padStart(2, "0");
    const day = String((i % 28) + 1).padStart(2, "0");

    return {
      id,
      category,
      grade,
      name: `${name}${i > 0 ? i : ""}`,
      nickname: `${name.toLowerCase()}${i}`,
      email: `user${id}@example.com`,
      address: `${region} ${i + 1}번지`,
      phone: `010-${String(i % 10000).padStart(4, "0")}-${String((i * 7) % 10000).padStart(4, "0")}`,
      lastAccessDate: `${year}.${month}.${day}`,
      joinDate: `${year - 1}.${month}.${day}`,
    };
  }),
];
