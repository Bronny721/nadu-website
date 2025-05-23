import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password, role, name, phone } = await req.json();
  const hash = await bcrypt.hash(password, 10);
  try {
    await db.user.create({
      data: {
        email,
        password: hash,
        role,
        name,
        phone,
      }
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Email 已存在" }, { status: 400 });
  }
}