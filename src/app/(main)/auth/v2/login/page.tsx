import Link from "next/link";

import { Globe } from "lucide-react";

import { APP_CONFIG } from "@/config/app-config";

import { LoginForm } from "../../_components/login-form";
import { GoogleButton } from "../../_components/social-auth/google-button";
import { KakaoButton } from "../../_components/social-auth/kakao-button";
import { NaverButton } from "../../_components/social-auth/naver-button";

export default function LoginV2() {
  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-medium">로그인</h1>
          <p className="text-muted-foreground text-sm">계정 정보를 입력해주세요.</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <GoogleButton className="w-full" />
            <NaverButton className="w-full" />
            <KakaoButton className="w-full" />
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">또는</span>
          </div>
          <LoginForm />
        </div>
      </div>

      <div className="absolute top-5 flex w-full justify-end px-10">
        <div className="text-muted-foreground text-sm">
          계정이 없으신가요?{" "}
          <Link className="text-foreground" href="register">
            회원가입
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-1 text-sm">
          <Globe className="text-muted-foreground size-4" />
          ENG
        </div>
      </div>
    </>
  );
}
