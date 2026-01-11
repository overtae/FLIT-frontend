"use client";

import { useEffect, useMemo, useState } from "react";

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
import { SERVICE_CONFIG } from "@/config/service-config";
import { getInitials } from "@/lib/utils";
import { deleteUser, getUser, updateUserGrade } from "@/service/user.service";
import type { User, UserDetail } from "@/types/user.type";

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function UserDetailModal({ open, onOpenChange, user }: UserDetailModalProps) {
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>("GREEN");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user && open) {
      const fetchUserDetail = async () => {
        try {
          setIsLoading(true);
          const detail = await getUser(user.userId);
          setUserDetail(detail);
          setSelectedGrade(detail.grade.toUpperCase());
        } catch (error) {
          console.error("Failed to fetch user detail:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserDetail();
    } else if (!open) {
      setUserDetail(null);
    }
  }, [user, open]);

  const gradeEntries = useMemo(() => {
    if (userDetail?.type?.startsWith("CUSTOMER_")) {
      return Object.entries(SERVICE_CONFIG.customerGrade);
    }
    return Object.entries(SERVICE_CONFIG.grade);
  }, [userDetail?.type]);

  const userTypeLabel = useMemo(() => {
    if (!userDetail) return "";
    return SERVICE_CONFIG.userType[userDetail.type] ?? userDetail.type;
  }, [userDetail]);

  const gradeLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    gradeEntries.forEach(([key, value]) => {
      map.set(key, value);
    });
    return map;
  }, [gradeEntries]);

  const { firstColumnFields, secondColumnFields } = useMemo(() => {
    if (!userDetail) {
      return {
        firstColumnFields: [],
        secondColumnFields: [],
      };
    }

    const isSeceder = !!userDetail.secedeDate;
    const userType = userDetail.type;

    let firstColumnFields: Array<{ label: string; value: string; isTextarea?: boolean }> = [];
    let secondColumnFields: Array<{ label: string; value: string; hasDownload?: boolean; fileName?: string }> = [];

    if (userType === "CUSTOMER_INDIVIDUAL") {
      firstColumnFields = [
        { label: "구분", value: userTypeLabel },
        { label: "이름", value: userDetail.name },
        { label: "닉네임(ID)", value: userDetail.nickname },
        { label: "전화번호", value: userDetail.phoneNumber },
        { label: "Mail", value: userDetail.mail },
        { label: "주소", value: userDetail.address, isTextarea: true },
        { label: "상세주소", value: userDetail.detailAddress },
      ];

      secondColumnFields = [
        { label: "가입일자", value: userDetail.joinDate },
        { label: "최근 접속일", value: userDetail.lastLoginDate ?? "-" },
        { label: "최근 구매일", value: userDetail.lastPurchaseDate ?? "-" },
      ];
    } else if (userType === "CUSTOMER_OWNER") {
      firstColumnFields = [
        { label: "구분", value: userTypeLabel },
        { label: "이름", value: userDetail.name },
        { label: "닉네임(ID)", value: userDetail.nickname },
        { label: "전화번호", value: userDetail.phoneNumber },
        { label: "Mail", value: userDetail.mail },
        { label: "회사주소", value: userDetail.address, isTextarea: true },
        { label: "상세주소", value: userDetail.detailAddress },
      ];

      secondColumnFields = [
        { label: "사업자번호", value: userDetail.businessNumber ?? "-" },
        { label: "가입일자", value: userDetail.joinDate },
        { label: "최근 접속일", value: userDetail.lastLoginDate ?? "-" },
        { label: "최근 구매일", value: userDetail.lastPurchaseDate ?? "-" },
      ];
    } else {
      firstColumnFields = [
        { label: "구분", value: userTypeLabel },
        { label: "이름", value: userDetail.name },
        { label: "닉네임(ID)", value: userDetail.nickname },
        { label: "전화번호", value: userDetail.phoneNumber },
        { label: "Mail", value: userDetail.mail },
        { label: "주소", value: userDetail.address, isTextarea: true },
        { label: "상세주소", value: userDetail.detailAddress },
      ];

      const businessLicenseFileName = userDetail.businessLicenseUrl
        ? (userDetail.businessLicenseUrl.split("/").pop() ?? "사업자등록증")
        : "";

      secondColumnFields = [
        { label: "사업자번호", value: userDetail.businessNumber ?? "-" },
        {
          label: "사업자등록증",
          value: businessLicenseFileName,
          hasDownload: !!userDetail.businessLicenseUrl,
          fileName: businessLicenseFileName,
        },
        { label: "최근 접속일", value: userDetail.lastLoginDate ?? "-" },
        { label: "최근 등록일", value: userDetail.joinDate },
      ];
    }

    if (isSeceder) {
      secondColumnFields.push({
        label: "탈퇴일자",
        value: userDetail.secedeDate ?? "-",
      });
    }

    return { firstColumnFields, secondColumnFields };
  }, [userDetail, userTypeLabel]);

  const handleGradeUpdate = async () => {
    if (!userDetail || selectedGrade === userDetail.grade.toUpperCase() || userDetail.secedeDate) return;

    try {
      setIsUpdating(true);
      await updateUserGrade(userDetail.userId, { grade: selectedGrade });
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update user grade:", error);
      alert("등급 수정에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!userDetail) return;

    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteUser(userDetail.userId);
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user || !userDetail) return null;

  const selectedGradeLabel = gradeLabelMap.get(selectedGrade.toUpperCase()) ?? selectedGrade;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-h-[90vh] w-[95vw] max-w-5xl gap-0 overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>유저 상세 정보</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[90vh] flex-col overflow-hidden sm:max-h-[80vh] sm:flex-row">
          <div className="flex w-full flex-col items-center justify-center gap-3 bg-white p-3 sm:w-[250px] sm:gap-4 sm:p-6">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32">
              <AvatarImage src={userDetail.profileImageUrl} />
              <AvatarFallback className="bg-gray-200 text-lg text-gray-400 sm:text-xl md:text-2xl">
                {getInitials(userDetail.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-2 text-center">
              <p className="text-sm font-medium sm:text-base">{selectedGradeLabel}</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Badge
                    variant="outline"
                    className="hover:bg-accent border-main bg-background text-main cursor-pointer rounded-md px-2 py-0.5 text-[10px] transition-colors sm:text-xs"
                  >
                    수정
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] p-0 px-4 sm:w-44" align="start">
                  <div className="flex flex-col items-center space-y-3 p-3 sm:space-y-4 sm:p-4">
                    <h4 className="text-xs leading-none font-medium sm:text-sm">등급수정</h4>
                    <RadioGroup value={selectedGrade} onValueChange={setSelectedGrade} className="grid gap-2">
                      {gradeEntries.map(([gradeKey, gradeLabel]) => (
                        <div key={gradeKey} className="flex items-center space-x-2">
                          <RadioGroupItem value={gradeKey} id={`grade-${gradeKey}`} className="h-4 w-4 sm:h-5 sm:w-5" />
                          <Label
                            htmlFor={`grade-${gradeKey}`}
                            className="cursor-pointer text-xs font-normal sm:text-sm"
                          >
                            {gradeLabel}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <div className="flex w-full flex-col gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-full rounded-full border-0 bg-gray-100 text-xs text-gray-600 hover:bg-gray-200 sm:h-8 sm:text-sm"
                        onClick={() => setSelectedGrade(userDetail.grade.toUpperCase())}
                        disabled={isUpdating}
                      >
                        Reset
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 w-full rounded-full border border-gray-200 bg-white text-xs text-gray-900 shadow-sm hover:bg-gray-50 sm:h-8 sm:text-sm"
                        onClick={handleGradeUpdate}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "저장 중..." : "Done"}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto bg-white px-3 py-4 sm:px-8 sm:py-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:gap-y-4 md:grid-cols-2">
                <div className="space-y-3 sm:space-y-4">
                  {firstColumnFields.map((field) => (
                    <div key={field.label} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <Label className="text-muted-foreground w-20 shrink-0 text-xs font-normal sm:w-24">
                        {field.label}
                      </Label>
                      {field.isTextarea ? (
                        <Textarea
                          value={field.value}
                          readOnly
                          rows={2}
                          className="pointer-events-none h-auto resize-none border-gray-200 bg-gray-50 text-left text-xs sm:text-center sm:text-sm"
                        />
                      ) : (
                        <Input
                          value={field.value}
                          readOnly
                          className="pointer-events-none h-8 border-gray-200 bg-gray-50 text-left text-xs sm:h-9 sm:text-center sm:text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {secondColumnFields.map((field) => (
                    <div key={field.label} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <Label className="text-muted-foreground w-20 shrink-0 text-xs font-normal sm:w-24">
                        {field.label}
                      </Label>
                      {field.hasDownload ? (
                        <div className="relative w-full grow">
                          <Input
                            value={field.value}
                            readOnly
                            className="pointer-events-none h-8 flex-1 border-gray-200 bg-gray-50 pr-8 text-left text-xs sm:h-9 sm:text-center sm:text-sm"
                          />
                          <Download
                            className="text-muted-foreground absolute top-2 right-2 h-3.5 w-3.5 cursor-pointer sm:top-2.5 sm:h-4 sm:w-4"
                            onClick={() => {
                              if (userDetail.businessLicenseUrl) {
                                window.open(userDetail.businessLicenseUrl, "_blank");
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <Input
                          value={field.value}
                          readOnly
                          className="pointer-events-none h-8 border-gray-200 bg-gray-50 text-left text-xs sm:h-9 sm:text-center sm:text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                className="w-full rounded-md bg-gray-300 px-4 text-xs text-white hover:bg-gray-400 sm:w-auto sm:px-6 sm:text-sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-md border-gray-300 bg-white px-4 text-xs text-gray-900 hover:bg-gray-50 sm:w-auto sm:px-6 sm:text-sm"
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
