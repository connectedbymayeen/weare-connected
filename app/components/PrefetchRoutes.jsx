"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PrefetchRoutes() {
  const router = useRouter();

 useEffect(() => {
    router.prefetch("/about");
    router.prefetch("/contact");
    router.prefetch("/blog");
    router.prefetch("/ventures");
    router.prefetch("/career");
    router.prefetch("/careers");
  }, []);

  return null;
}
