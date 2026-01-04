"use client";

import Image from "next/image";

import { SOCIAL_LOGIN } from "@/lib/api/config";

export function KakaoButton() {
  const handleKakaoLogin = () => {
    const clientId = SOCIAL_LOGIN.kakao.clientId;
    const redirectUri = encodeURIComponent(SOCIAL_LOGIN.kakao.redirectUri);
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

    window.location.href = kakaoAuthUrl;
  };

  return (
    <button
      type="button"
      onClick={handleKakaoLogin}
      className="h-12 w-12 rounded-full border-0 bg-[#FEE500] p-3.25 transition-opacity hover:opacity-80"
    >
      <Image
        src="/assets/logo-kakao.svg"
        alt="카카오 로그인"
        width={48}
        height={48}
        className="aspect-square object-contain"
      />
    </button>
  );
}
