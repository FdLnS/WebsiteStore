import { NextRequest, NextResponse } from 'next/server';

type PaymentBody = {
  amount: number;
  method: string;
  email?: string;
};

export async function POST(req: NextRequest) {
  try {
    const bodyData = await req.json() as PaymentBody;
    const { amount, method, email } = bodyData;

    if (!amount)
      return NextResponse.json({ success: false, message: "Amount wajib diisi" });

    if (method !== "qris")
      return NextResponse.json({ success: false, message: "Metode pembayaran hanya QRIS yang tersedia." });

    const WBK_API_KEY = process.env.WBK_API_KEY;
    if (!WBK_API_KEY) {
      return NextResponse.json({ success: false, message: "API Key belum diatur di .env.local" });
    }

    const apiRes = await fetch("https://pg.wbk.web.id/payment/qris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create",
        apikey: WBK_API_KEY,
        amount: amount,
        ...(email && { email }),
      }),
    });

    const data = await apiRes.json() as {
      success: boolean;
      message?: string;
      data?: {
        qr_url: string;
        qr_base64: string;
        expiredAt: string;
        paymentUrl: string;
        transactionId: string;
        amount: number;
      };
    };

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

  } catch (e: unknown) {
    return NextResponse.json({
      success: false,
      message: e instanceof Error ? e.message : "Terjadi error server"
    });
  }
}
