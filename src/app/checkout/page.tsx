'use client'
import { Suspense } from 'react'
import CheckoutContent from './CheckoutContent'

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center text-white py-20">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}