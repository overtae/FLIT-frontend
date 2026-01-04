import Image from "next/image";
import Link from "next/link";

import { PrimaryButton } from "@/app/(main)/auth/_components/primary-button";

import { LoginForm } from "../_components/login-form";
import { GoogleButton } from "../_components/social-auth/google-button";
import { KakaoButton } from "../_components/social-auth/kakao-button";
import { NaverButton } from "../_components/social-auth/naver-button";

export default function Login() {
  return (
    <div className="flex flex-col">
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-8 px-6">
          {/* 로고 */}
          <div className="pb-4">
            <Image
              loading="eager"
              src={"/assets/logo-flit.svg"}
              alt={"logo"}
              width={100}
              height={100}
              className="h-auto w-auto"
            />
          </div>

          {/* 로그인 폼 */}
          <div className="w-full">
            <LoginForm />
          </div>

          {/* 소셜 로그인 */}
          <div className="w-full space-y-4">
            <p className="text-center text-sm text-gray-600 select-none">SNS 계정으로 로그인하기</p>
            <div className="flex justify-center gap-3">
              <NaverButton />
              <KakaoButton />
              <GoogleButton />
            </div>
          </div>

          {/* 회원가입 */}
          <Link href="/" className="w-full">
            <button className="w-full rounded-full border-2 border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              간편 회원가입하기
            </button>
          </Link>
        </div>
      </div>

      {/* 하단 핑크색 영역 */}
      <div className="flex min-h-[50vh] items-center justify-center bg-pink-50">
        <div className="flex w-full max-w-4xl items-center justify-center gap-8 px-6">
          {/* 로고 */}
          <div className="pb-4">
            <Image src={"/assets/logo-filter.svg"} alt={"logo"} width={150} height={100} className="h-auto w-auto" />
          </div>

          {/* 버튼 */}
          <Link href="/">
            <PrimaryButton className="text-primary bg-pink-50 px-24 py-6 text-base font-medium">
              입점 바로 가기
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
