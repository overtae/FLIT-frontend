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
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const { loaded: scriptLoaded, error: scriptError } = useScript({
    src: "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js",
    checkFunction: () => !!window.daum?.Postcode,
  });

  useEffect(() => {
    if (!isOpen || !scriptLoaded) return;

    if (scriptError) {
      console.error("Script loading error");
      return;
    }

    const Postcode = window.daum?.Postcode;
    if (!Postcode) {
      return;
    }

    const initPostcode = () => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      container.innerHTML = "";

      try {
        const postcode = new Postcode({
          oncomplete: (data) => {
            let addr = "";
            if (data.userSelectedType === "R") {
              addr = data.roadAddress;
            } else {
              addr = data.jibunAddress;
            }

            onChangeRef.current(addr);
            shouldFocusDetailRef.current = true;
            setIsOpen(false);
          },
          width: "100%",
          height: "100%",
          theme: {
            bgColor: "#ffffff",
          },
        });

        postcode.embed(container);
      } catch (error) {
        console.error("Failed to initialize Daum Postcode:", error);
      }
    };

    if (containerRef.current) {
      initPostcode();
    } else {
      const checkContainer = () => {
        if (containerRef.current) {
          initPostcode();
        } else {
          requestAnimationFrame(checkContainer);
        }
      };
      requestAnimationFrame(checkContainer);
    }

    const container = containerRef.current;
    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [isOpen, scriptLoaded, scriptError]);

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
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={(e) => {
            (e.currentTarget as HTMLElement).blur();
            setIsOpen(true);
          }}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl" onOpenAutoFocus={(e) => e.preventDefault()}>
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
