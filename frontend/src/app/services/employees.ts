"use server"

import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_API_URL;

export const getEmployeesAnalyses = async () => {
  try {
    const cookieStore: any = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!url) {
      throw new Error("API URL is not defined (check NEXT_PUBLIC_API_URL)");
    }

    if (!token) {
      throw new Error("No access token found in cookies");
    }

    const res = await fetch(`${url}/employees/analyses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error("❌ getEmployeesAnalyses error:", error);

    return {
      success: false,
      data: null,
      error: error?.message || "Server unavailable. Please try again later.",
    };
  }
};
