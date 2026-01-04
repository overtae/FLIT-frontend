"use client";

import Image from "next/image";

import { SOCIAL_LOGIN } from "@/lib/api/config";

export function GoogleButton() {
  const handleGoogleLogin = () => {
    const clientId = SOCIAL_LOGIN.google.clientId;
    const redirectUri = encodeURIComponent(SOCIAL_LOGIN.google.redirectUri);
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const scope = encodeURIComponent("openid email profile");
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;

    window.location.href = googleAuthUrl;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="h-12 w-12 rounded-full border border-[#747775] bg-[#FFFFFF] p-2.5 transition-opacity hover:opacity-80"
    >
      <Image
        src="/assets/logo-google.svg"
        alt="구글 로그인"
        width={48}
        height={48}
        className="aspect-square object-contain"
      />
    </button>
  );
}
