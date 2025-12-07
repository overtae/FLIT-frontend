import { useEffect, useState, useRef } from "react";

interface UseScriptOptions {
  src: string;
  async?: boolean;
  checkFunction?: () => boolean;
}

export function useScript({ src, async = true, checkFunction }: UseScriptOptions) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const checkFunctionRef = useRef(checkFunction);

  useEffect(() => {
    checkFunctionRef.current = checkFunction;
  }, [checkFunction]);

  useEffect(() => {
    const existingScript = document.querySelector(`script[src*="${src}"]`);
    if (existingScript) {
      const check = () => {
        if (checkFunctionRef.current ? checkFunctionRef.current() : true) {
          setLoaded(true);
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = async;

    const handleLoad = () => {
      if (checkFunctionRef.current) {
        const check = () => {
          if (checkFunctionRef.current?.()) {
            setLoaded(true);
          } else {
            requestAnimationFrame(check);
          }
        };
        check();
      } else {
        setLoaded(true);
      }
    };

    script.onload = handleLoad;

    script.onerror = () => {
      setError(true);
      console.error(`Failed to load script: ${src}`);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [src, async]);

  return { loaded, error };
}
