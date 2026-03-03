import { FC } from "react";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { MY_POSTS_URL } from "@/config/constants/server";
import { getCurrentUser } from "@/lib/server/auth";
import { getSession } from "@/lib/server/sessionStore";
import HomePage from "@/components/templates/PostsPageLayout";

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

  const sid = (await cookies()).get("sid")?.value;

  if (!sid) {
    redirect("/login");
  }

  const session = await getSession(sid);

  if (!session) {
    redirect("/login");
  }

  const res = await fetch(`${MY_POSTS_URL}?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  const initialPosts = res.ok ? await res.json().catch(() => null) : null;

  const errorMessage = res.ok
    ? initialPosts
      ? null
      : "Invalid server response"
    : "Error loading posts";

  const currentUser = await getCurrentUser();

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
