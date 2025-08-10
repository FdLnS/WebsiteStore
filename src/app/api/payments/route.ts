// src/app/api/payments/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const bodyData = await req.json();
    const { amount } = bodyData;

    if (!amount)
      return NextResponse.json({ success: false, message: "Amount wajib diisi" });

    const WBK_API_KEY = process.env.WBK_API_KEY;
    if (!WBK_API_KEY) {
      return NextResponse.json({ success: false, message: "API Key belum diatur di .env.local" });
    }

    const apiRes = await fetch("https://paygateway.wbk.digital/payment/qris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create",
        apikey: WBK_API_KEY,
        amount: amount,
        paymentMethod: "qris",
      }),
    });

    const apiText = await apiRes.text();
    try {
      const data = JSON.parse(apiText);

      if (!data.success || !data.data) {
        return NextResponse.json({ success: false, message: data.message || "Gagal membuat pembayaran QRIS" });
      }

      const qrData = data.data;

      return NextResponse.json({
        success: true,
        qr_url: qrData.qr_url,
        qr_base64: qrData.qr_base64,
        expiredAt: qrData.expiredAt,
        paymenturl: qrData.paymentUrl,
        transactionId: qrData.transactionId,
        amount: qrData.amount,
      });
    } catch {
      return NextResponse.json({
        success: false,
        message: "API WBK Error: " + apiText.substring(0, 100)
      });
    }

  } catch (e: unknown) {
    return NextResponse.json({
      success: false,
      message: e instanceof Error ? e.message : "Terjadi error server"
    });
  }
}
