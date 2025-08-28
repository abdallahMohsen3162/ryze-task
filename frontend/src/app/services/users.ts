"use server"

import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_API_URL;


export const getAllUsers = async () => {
  const cookieStore : any = await cookies();
  // console.log(cookieStore);
  
  const res = await fetch(`${url}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookieStore.get("access_token").value}`,
    },
  });
  return res.json();
}

export const DeleteToken = async () => {
  const cookieStore : any = await cookies();
  cookieStore.delete("access_token");
}
