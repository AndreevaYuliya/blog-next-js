import { FC } from "react";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { MY_POSTS_URL, USER_PROFILE_URL } from "@/config/constants/server";
import { GetUserResponse } from "@/types/UserApi";
import HomePage from "@/components/templates/HomePage";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

const Page: FC<Props> = async (props) => {
  const { searchParams } = props;

  const searchParamsObj = await searchParams;

  if (!searchParamsObj.page) {
    redirect("/home?page=1");
  }

  const page = Math.max(parseInt(searchParamsObj.page ?? "1", 10) || 1, 1);
  const limit = 10;

  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch(`${MY_POSTS_URL}?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const initialPosts = res.ok ? await res.json() : null;

  const errorMessage = res.ok ? null : "Error loading posts";

  let currentUser: GetUserResponse | null = null;

  const userRes = await fetch(USER_PROFILE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (userRes.ok) {
    currentUser = await userRes.json();
  }

  return (
    <HomePage
      key={`${page}-${limit}`}
      initialPosts={initialPosts}
      page={page}
      limit={limit}
      errorMessage={errorMessage}
      currentUser={currentUser}
    />
  );
};

export default Page;

