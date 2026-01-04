"use client";

import { useCallback, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

export default function KakaoCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleKakaoLogin = useCallback(
    async (code: string) => {
      try {
        const response = await fetch("/api/v1/auth/kakao/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          router.push(`/auth/login?error=${data.error ?? "kakao_login_failed"}`);
          return;
        }

        router.push("/dashboard");
        router.refresh();
      } catch {
        router.push("/auth/login?error=kakao_login_failed");
      }
    },
    [router],
  );

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      router.push(`/auth/login?error=${error}&error_description=${errorDescription ?? ""}`);
      return;
    }

    if (!code) {
      router.push("/auth/login?error=kakao_auth_failed");
      return;
    }

    handleKakaoLogin(code);
  }, [searchParams, router, handleKakaoLogin]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-lg">카카오 로그인 처리 중...</p>
      </div>
    </div>
  );
}
