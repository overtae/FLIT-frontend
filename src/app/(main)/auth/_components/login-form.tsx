"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PrimaryButton } from "@/app/(main)/auth/_components/primary-button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/api/auth";

const FormSchema = z.object({
  email: z.string().min(1, { message: "아이디를 입력해주세요." }),
  password: z.string().min(1, { message: "비밀번호를 입력해주세요." }),
});

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    try {
      const result = await signIn({
        email: data.email,
        password: data.password,
      });

      if (result.success && result.data) {
        // 토큰은 서버에서 httpOnly 쿠키로 저장됨 (보안)
        toast.success("로그인 성공");
        const redirect = searchParams.get("redirect") ?? "/dashboard";
        router.push(redirect);
        router.refresh();
      } else {
        const errorMessage = result.error?.message ?? "로그인에 실패했습니다.";
        const errors = result.error?.errors;

        if (errors) {
          // 필드별 에러 메시지 표시
          Object.entries(errors).forEach(([field, message]) => {
            form.setError(field as keyof z.infer<typeof FormSchema>, {
              type: "server",
              message,
            });
          });
        } else {
          toast.error(errorMessage);
        }
      }
    } catch {
      toast.error("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  id="email"
                  type="text"
                  placeholder="아이디"
                  autoComplete="username"
                  className="h-12 rounded-full border-gray-200 px-4 focus:outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호"
                  autoComplete="current-password"
                  className="h-12 rounded-full border-gray-200 px-4 focus:outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <PrimaryButton
            className="text-primary h-12 w-fit cursor-pointer border-0 px-24"
            type="submit"
            disabled={isLoading}
          >
            Login
          </PrimaryButton>
        </div>
      </form>
    </Form>
  );
}
