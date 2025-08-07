// src/app/checkout/page.tsx

"use client";
import { Suspense } from "react";
import CheckoutContent from "./CheckoutContent";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white text-xl">
          Memuat checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
