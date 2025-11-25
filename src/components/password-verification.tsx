"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api/config";

const passwordSchema = z.object({
  password: z.string().min(1, { message: "비밀번호를 입력해주세요." }),
});

interface PasswordVerificationProps {
  title: string;
  description: string;
  onVerified: () => void;
}

export function PasswordVerification({ title, description, onVerified }: PasswordVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.verifyPassword}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password: data.password }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error ?? "비밀번호가 일치하지 않습니다.");
        form.setError("password", {
          type: "server",
          message: "비밀번호가 일치하지 않습니다.",
        });
        return;
      }

      toast.success("인증되었습니다.");
      onVerified();
    } catch {
      toast.error("인증 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <section className="w-full max-w-md">
        <div className="space-y-3 py-8">
          <div className="text-2xl font-semibold">{title}</div>
          <div>{description}</div>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "확인 중..." : "확인"}
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
