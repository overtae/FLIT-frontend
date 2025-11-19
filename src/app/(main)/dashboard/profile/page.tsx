"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { rootUser } from "@/data/users";
import { getInitials } from "@/lib/utils";

const profileFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  nickname: z.string().min(1, "닉네임을 입력해주세요."),
  phone: z.string().min(1, "전화번호를 입력해주세요."),
  level: z.string().min(1, "레벨을 선택해주세요."),
  code: z.string().optional(),
  address: z.string().optional(),
  detailAddress: z.string().optional(),
  sns: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: rootUser.name,
      nickname: rootUser.email.split("@")[0],
      phone: "",
      level: "",
      code: "",
      address: "",
      detailAddress: "",
      sns: "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    toast.success("프로필이 업데이트되었습니다.");
    console.log(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">사용자 정보 수정</h1>
        <p className="text-muted-foreground mt-2">프로필 정보를 수정하세요</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>프로필 사진</CardTitle>
          <CardDescription>프로필 사진을 변경하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={rootUser.avatar} alt={rootUser.name} />
                <AvatarFallback className="text-lg">{getInitials(rootUser.name)}</AvatarFallback>
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute right-0 bottom-0 size-8 rounded-full">
                <Camera className="size-4" />
              </Button>
            </div>
            <div>
              <Button variant="outline">사진 변경</Button>
              <p className="text-muted-foreground mt-2 text-sm">JPG, PNG 형식만 지원됩니다. (최대 5MB)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>기본 정보를 수정하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input placeholder="이름을 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>닉네임 (ID)</FormLabel>
                      <FormControl>
                        <Input placeholder="닉네임을 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>전화번호</FormLabel>
                      <FormControl>
                        <Input placeholder="010-0000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>레벨</FormLabel>
                      <FormControl>
                        <Input placeholder="레벨을 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>코드</FormLabel>
                      <FormControl>
                        <Input placeholder="코드를 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SNS</FormLabel>
                      <FormControl>
                        <Input placeholder="SNS 계정을 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>주소</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input placeholder="주소를 검색하세요" {...field} />
                          <Button type="button" variant="outline">
                            주소 검색
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="detailAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상세 주소</FormLabel>
                      <FormControl>
                        <Input placeholder="상세 주소를 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline">
                  취소
                </Button>
                <Button type="submit">저장</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
