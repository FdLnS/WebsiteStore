// src/lib/useDelayedUnmount.ts

import { useEffect, useState } from "react";

export function useDelayedUnmount(isMounted: boolean, delay: number = 300) {
  const [shouldRender, setShouldRender] = useState(isMounted);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isMounted) {
      timeout = setTimeout(() => setShouldRender(false), delay);
    } else {
      setShouldRender(true);
    }
    return () => clearTimeout(timeout);
  }, [isMounted, delay]);
  return shouldRender;
}
