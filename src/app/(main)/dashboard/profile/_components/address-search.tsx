"use client";

import { useEffect, useRef, useState } from "react";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useScript } from "@/hooks/use-script";

interface AddressSearchProps {
  value: string;
  onChange: (address: string) => void;
  onDetailFocus?: () => void;
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string;
          address: string;
          roadAddress: string;
          jibunAddress: string;
          userSelectedType: string;
          bname?: string;
          buildingName?: string;
        }) => void;
        width?: string;
        height?: string;
        theme?: {
          bgColor?: string;
          searchBgColor?: string;
          pageBgColor?: string;
          textColor?: string;
          queryTextColor?: string;
          postcodeTextColor?: string;
          emphTextColor?: string;
          outlineColor?: string;
          queryBgColor?: string;
        };
      }) => {
        embed: (element: HTMLElement) => void;
        open: () => void;
      };
    };
  }
}

export function AddressSearch({ value, onChange, onDetailFocus }: AddressSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldFocusDetailRef = useRef(false);

  const { loaded: scriptLoaded } = useScript({
    src: "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js",
    checkFunction: () => !!window.daum?.Postcode,
  });

  useEffect(() => {
    if (!isOpen || !scriptLoaded) return;

    const container = containerRef.current;

    const initPostcode = () => {
      if (!container || !window.daum?.Postcode) {
        requestAnimationFrame(initPostcode);
        return;
      }

      if (container.innerHTML) {
        container.innerHTML = "";
      }

      try {
        new window.daum.Postcode({
          oncomplete: (data) => {
            let addr = "";
            if (data.userSelectedType === "R") {
              addr = data.roadAddress;
            } else {
              addr = data.jibunAddress;
            }

            onChange(addr);
            shouldFocusDetailRef.current = true;
            setIsOpen(false);
          },
          width: "100%",
          height: "100%",
          theme: {
            bgColor: "#ffffff",
          },
        }).embed(container);
      } catch (error) {
        console.error("Failed to initialize Daum Postcode:", error);
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(initPostcode);
    });

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [isOpen, scriptLoaded, onChange]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && shouldFocusDetailRef.current) {
      shouldFocusDetailRef.current = false;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onDetailFocus?.();
        });
      });
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Input
          value={value}
          readOnly
          placeholder="주소를 검색하세요"
          className="flex-1 border-0 border-b bg-transparent p-0 shadow-none"
        />
        <Button type="button" variant="outline" size="icon" onClick={() => setIsOpen(true)}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>주소 검색</DialogTitle>
            <DialogDescription>주소를 검색하여 선택하세요</DialogDescription>
          </DialogHeader>
          <div ref={containerRef} className="h-[500px] w-full" />
        </DialogContent>
      </Dialog>
    </>
  );
}
