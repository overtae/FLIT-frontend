"use client";

import Image from "next/image";

import { SOCIAL_LOGIN } from "@/lib/api/config";

export function NaverButton() {
  const handleNaverLogin = () => {
    const clientId = SOCIAL_LOGIN.naver.clientId;
    const redirectUri = encodeURIComponent(SOCIAL_LOGIN.naver.redirectUri);
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}`;

    window.location.href = naverAuthUrl;
  };

  return (
    <button
      type="button"
      onClick={handleNaverLogin}
      className="h-12 w-12 rounded-full border-0 bg-[#03C75A] p-3.5 transition-opacity hover:opacity-80"
    >
      <Image
        src="/assets/logo-naver.svg"
        alt="네이버 로그인"
        width={48}
        height={48}
        className="aspect-square object-contain"
      />
    </button>
  );
}
