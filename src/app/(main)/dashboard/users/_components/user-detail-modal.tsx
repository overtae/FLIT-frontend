"use client";

import { useState, useMemo } from "react";

import { Download } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { getInitials } from "@/lib/utils";
import { User } from "@/types/dashboard";

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const customerGrades = ["Green", "Yellow", "Orange", "Red", "Silver", "Gold"];
const corporateGrades = ["Free", "Flinney", "Filter", "Premium", "VIP"];

export function UserDetailModal({ open, onOpenChange, user }: UserDetailModalProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>(user?.grade ?? "Green");

  const { grades, firstColumnFields, secondColumnFields } = useMemo(() => {
    if (!user) {
      return {
        grades: customerGrades,
        firstColumnFields: [],
        secondColumnFields: [],
      };
    }

    const isCustomer = user.category === "customer";
    const isCorporate = user.category === "shop" || user.category === "florist";
    const isSeceder = user.category === "seceder";

    let grades = customerGrades;
    let firstColumnFields: Array<{ label: string; value: string; isTextarea?: boolean }> = [];
    let secondColumnFields: Array<{ label: string; value: string; hasDownload?: boolean }> = [];

    if (isCustomer) {
      grades = customerGrades;
      firstColumnFields = [
        { label: "구분", value: "개인" },
        { label: "이름", value: user.name },
        { label: "닉네임(ID)", value: user.nickname },
        { label: "전화번호", value: user.phone },
        { label: "Mail", value: user.email },
        { label: "회사주소", value: user.address, isTextarea: true },
        { label: "상세주소", value: "0층 00호" },
      ];
      secondColumnFields = [
        { label: "사업자 번호", value: "000-00000-00" },
        { label: "가입일자", value: user.joinDate },
        { label: "최근 접속일", value: user.lastAccessDate },
        { label: "최근 구매일", value: user.lastAccessDate },
      ];
    } else if (isCorporate) {
      grades = corporateGrades;
      firstColumnFields = [
        { label: "구분", value: "기업" },
        { label: "이름", value: user.name },
        { label: "닉네임(ID)", value: user.nickname },
        { label: "전화번호", value: user.phone },
        { label: "Mail", value: user.email },
        { label: "주소", value: user.address },
        { label: "상세주소", value: "0층 00호" },
      ];
      secondColumnFields = [
        { label: "사업자번호", value: "000-00000-00" },
        { label: "사업자등록증", value: "사업자등록증.pdf", hasDownload: true },
        { label: "최근 접속일", value: user.lastAccessDate },
        { label: "최근 등록일", value: user.joinDate },
      ];
    } else if (isSeceder) {
      grades = customerGrades;
      firstColumnFields = [
        { label: "구분", value: "개인" },
        { label: "이름", value: user.name },
        { label: "닉네임(ID)", value: user.nickname },
        { label: "전화번호", value: user.phone },
        { label: "Mail", value: user.email },
        { label: "주소", value: user.address },
        { label: "상세주소", value: "0층 00호" },
      ];
      secondColumnFields = [
        { label: "가입일자", value: user.joinDate },
        { label: "최근 접속일", value: user.lastAccessDate },
        { label: "최근 구매일", value: user.lastAccessDate },
        { label: "탈퇴일자", value: user.lastAccessDate },
      ];
    }

    return { grades, firstColumnFields, secondColumnFields };
  }, [user]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="w-full max-w-5xl gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="sr-only">
          <DialogTitle>유저 상세 정보</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[80vh] flex-col sm:flex-row">
          <div className="flex w-full flex-col items-center justify-center gap-4 bg-white p-4 sm:w-[250px] sm:p-6">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
              <AvatarImage src={undefined} />
              <AvatarFallback className="bg-gray-200 text-xl text-gray-400 sm:text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-2 text-center">
              <p className="text-base font-medium">{selectedGrade}</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Badge
                    variant="outline"
                    className="hover:bg-accent border-main bg-background text-main cursor-pointer rounded-md px-2 py-0.5 text-xs transition-colors"
                  >
                    수정
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-44 p-0 px-4" align="start">
                  <div className="flex flex-col items-center space-y-4 p-4">
                    <h4 className="text-sm leading-none font-medium">등급수정</h4>
                    <RadioGroup value={selectedGrade} onValueChange={setSelectedGrade} className="grid gap-2">
                      {grades.map((grade) => (
                        <div key={grade} className="flex items-center space-x-2">
                          <RadioGroupItem value={grade} id={`grade-${grade}`} />
                          <Label htmlFor={`grade-${grade}`} className="cursor-pointer text-sm font-normal">
                            {grade}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <div className="flex w-full flex-col gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-full rounded-full border-0 bg-gray-100 text-gray-600 hover:bg-gray-200"
                        onClick={() => setSelectedGrade(user.grade)}
                      >
                        Reset
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 w-full rounded-full border border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-50"
                        onClick={() => {
                          /* Save logic */
                        }}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto bg-white px-4 py-6 sm:px-8 sm:py-8">
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
              <div className="space-y-4">
                {firstColumnFields.map((field) => (
                  <div key={field.label} className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-24 shrink-0 text-xs font-normal">{field.label}</Label>
                    {field.isTextarea ? (
                      <Textarea
                        value={field.value}
                        readOnly
                        rows={2}
                        className="pointer-events-none h-auto resize-none border-gray-200 bg-gray-50 text-center text-sm"
                      />
                    ) : (
                      <Input
                        value={field.value}
                        readOnly
                        className="pointer-events-none h-9 border-gray-200 bg-gray-50 text-center text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {secondColumnFields.map((field) => (
                  <div key={field.label} className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-24 shrink-0 text-xs font-normal">{field.label}</Label>
                    {field.hasDownload ? (
                      <div className="relative w-full grow">
                        <Input
                          value={field.value}
                          readOnly
                          className="pointer-events-none h-9 flex-1 border-gray-200 bg-gray-50 pr-8 text-center text-sm"
                        />
                        <Download className="text-muted-foreground absolute top-2.5 right-2 h-4 w-4 cursor-pointer" />
                      </div>
                    ) : (
                      <Input
                        value={field.value}
                        readOnly
                        className="pointer-events-none h-9 border-gray-200 bg-gray-50 text-center text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" className="rounded-md bg-gray-300 px-6 text-white hover:bg-gray-400">
                삭제
              </Button>
              <Button
                variant="outline"
                className="rounded-md border-gray-300 bg-white px-6 text-gray-900 hover:bg-gray-50"
                onClick={() => onOpenChange(false)}
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
