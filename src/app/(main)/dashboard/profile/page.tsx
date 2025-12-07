"use client";

import { useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Copy } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { rootUser } from "@/data/users";

import { AddressSearch } from "./_components/address-search";
import { ImageUploader } from "./_components/image-uploader";

const profileFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  nickname: z.string().min(1, "닉네임을 입력해주세요."),
  phone: z.string().min(1, "전화번호를 입력해주세요."),
  level: z.string().min(1, "레벨을 선택해주세요."),
  code: z.string().optional(),
  address: z.string().optional(),
  detailAddress: z.string().optional(),
  sns: z.string().optional(),
  profileImage: z.instanceof(File).optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const levels = ["Master", "Admin", "User", "Guest"];

export default function ProfilePage() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const detailAddressRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "전엄지",
      nickname: "Admin",
      phone: "010.6536.0429",
      level: "Master",
      code: "maaaa000",
      address: "",
      detailAddress: "",
      sns: "instagram / dearflora",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    toast.success("프로필이 업데이트되었습니다.");
    console.log({ ...data, profileImage });
  };

  const handleDelete = () => {
    toast.success("계정이 삭제되었습니다.");
    setIsDeleteDialogOpen(false);
  };

  const handleCopyCode = () => {
    const code = form.getValues("code");
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success("코드가 복사되었습니다.");
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 7)}.${numbers.slice(7, 11)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => router.back()} className="rounded-full" aria-label="Back">
          <ChevronLeft width={24} height={24} />
        </Button>
        <h1 className="text-xl font-bold">정보수정</h1>
      </div>

      <div className="mb-12 flex justify-center">
        <ImageUploader
          value={rootUser.avatar}
          onChange={(file) => {
            setProfileImage(file);
          }}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-24">
          <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="border-0 border-b bg-transparent p-0 shadow-none" />
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
                  <FormLabel>Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-0 border-b bg-transparent p-0 shadow-none">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input {...field} className="border-0 border-b bg-transparent p-0 shadow-none" />
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
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input {...field} readOnly className="border-0 border-b bg-transparent p-0 shadow-none" />
                      <Button type="button" variant="ghost" size="icon" onClick={handleCopyCode} className="h-6 w-6">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        field.onChange(formatted);
                      }}
                      className="border-0 border-b bg-transparent p-0 shadow-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <AddressSearch
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onDetailFocus={() => {
                        detailAddressRef.current?.focus();
                      }}
                    />
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
                    <Input {...field} className="border-0 border-b bg-transparent p-0 shadow-none" />
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
                  <FormLabel>Detail</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      ref={detailAddressRef}
                      className="border-0 border-b bg-transparent p-0 shadow-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="border-primary text-primary hover:text-primary rounded-full"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </Button>
            <Button type="submit" className="rounded-full">
              Save
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>계정 삭제 확인</DialogTitle>
            <DialogDescription>정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
