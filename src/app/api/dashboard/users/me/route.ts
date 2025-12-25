import { NextResponse } from "next/server";

import { mockUsers, rootUser } from "@/data/users";
import { getCurrentUser } from "@/lib/api/auth";

export interface ProfileResponse {
  name: string;
  nickname: string;
  phone: string;
  level: string;
  code: string;
  address: string;
  detailAddress: string;
  sns: string;
  profileImage?: string;
}

function parseAddress(address: string) {
  const parts = address.split(" ");
  return {
    address: parts.slice(0, -1).join(" ") || "",
    detailAddress: parts.slice(-1)[0] || "",
  };
}

function getDefaultProfileData(user: (typeof mockUsers)[0]) {
  const { address, detailAddress } = parseAddress(user.address);
  return {
    level: rootUser.level,
    address,
    detailAddress,
    sns: "instagram / dearflora",
    profileImage: rootUser.avatar,
  };
}

function getValue<T>(override: T | undefined, defaultValue: T): T {
  return override ?? defaultValue;
}

function buildProfileData(user: (typeof mockUsers)[0], overrides?: Partial<ProfileResponse>): ProfileResponse {
  const defaults = getDefaultProfileData(user);
  const level = getValue(overrides?.level, defaults.level);
  const address = getValue(overrides?.address, defaults.address);
  const detailAddress = getValue(overrides?.detailAddress, defaults.detailAddress);
  const sns = getValue(overrides?.sns, defaults.sns);
  const profileImage = getValue(overrides?.profileImage, defaults.profileImage);

  return {
    name: user.name,
    nickname: user.nickname,
    phone: user.phone,
    level,
    code: `maaaa${user.id.padStart(3, "0")}`,
    address,
    detailAddress,
    sns,
    profileImage,
  };
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = mockUsers.find((u) => u.email === currentUser.email) ?? mockUsers[0];
    const profileData = buildProfileData(user);

    return NextResponse.json(profileData);
  } catch {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

async function parseRequestBody(request: Request, contentType: string | null): Promise<Record<string, string | File>> {
  if (contentType?.includes("multipart/form-data")) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
  }
  return request.json();
}

function updateUserFields(user: (typeof mockUsers)[0], body: Record<string, string | File>): void {
  const name = body.name;
  const nickname = body.nickname;
  const phone = body.phone;
  const address = body.address;
  const detailAddress = body.detailAddress;

  if (typeof name === "string") {
    user.name = name;
  }
  if (typeof nickname === "string") {
    user.nickname = nickname;
  }
  if (typeof phone === "string") {
    user.phone = phone;
  }
  if (typeof address === "string" && typeof detailAddress === "string") {
    user.address = `${address} ${detailAddress}`;
  }
}

function extractOverrides(body: Record<string, string | File>): Partial<ProfileResponse> {
  const { level, address, detailAddress, sns } = body;
  return {
    level: level && typeof level === "string" ? level : undefined,
    address: address && typeof address === "string" ? address : undefined,
    detailAddress: detailAddress && typeof detailAddress === "string" ? detailAddress : undefined,
    sns: sns && typeof sns === "string" ? sns : undefined,
  };
}

export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type");
    const body = await parseRequestBody(request, contentType);

    const user = mockUsers.find((u) => u.email === currentUser.email) ?? mockUsers[0];
    updateUserFields(user, body);

    const overrides = extractOverrides(body);
    const updatedData = buildProfileData(user, overrides);

    return NextResponse.json({
      success: true,
      message: "프로필이 업데이트되었습니다.",
      data: updatedData,
    });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
