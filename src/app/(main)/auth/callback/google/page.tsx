"use client";

import { useCallback, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleGoogleLogin = useCallback(
    async (code: string, state: string | null) => {
      try {
        const response = await fetch("/api/v1/auth/google/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            state,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          router.push(`/auth/login?error=${data.error ?? "google_login_failed"}`);
          return;
        }

        router.push("/dashboard");
        router.refresh();
      } catch {
        router.push("/auth/login?error=google_login_failed");
      }
    },
    [router],
  );

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      router.push(`/auth/login?error=${error}&error_description=${errorDescription ?? ""}`);
      return;
    }

    if (!code) {
      router.push("/auth/login?error=google_auth_failed");
      return;
    }

    handleGoogleLogin(code, state);
  }, [searchParams, router, handleGoogleLogin]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-lg">구글 로그인 처리 중...</p>
      </div>
    </div>
  );
}
