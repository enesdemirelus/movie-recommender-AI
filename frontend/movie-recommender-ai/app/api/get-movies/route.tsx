import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.toLowerCase() ?? "";
    const limit = Number(searchParams.get("limit") ?? 40);

    const filePath = path.join(process.cwd(), "data", "movies_meta.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const movies = JSON.parse(fileData);

    const result = query
      ? movies.filter((m: any) => m.title.toLowerCase().includes(query))
      : movies.slice(0, limit);

    return NextResponse.json(result.slice(0, limit));
  } catch {
    return NextResponse.json(
      { message: "Failed to load movies" },
      { status: 500 }
    );
  }
}
