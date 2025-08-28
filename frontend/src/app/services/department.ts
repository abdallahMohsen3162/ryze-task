"use server"

import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_API_URL;


export const getDepartmentsAnalyses = async () => {
  const cookieStore : any = await cookies();
  const res = await fetch(`${url}/departments/analyses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookieStore.get("access_token").value}`,
    },
  });
  return res.json();
}
