import { FC } from "react";

import { redirect } from "next/navigation";

import { EXHIBITS_URL } from "@/config/constants/server";
import StripePage from "@/components/templates/PostsPageLayout";
import { getCurrentUser } from "@/lib/server/auth";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

const Page: FC<Props> = async (props) => {
  const { searchParams } = props;

  const searchParamsObj = await searchParams;

  if (!searchParamsObj.page) {
    redirect("/?page=1");
  }

  const page = Math.max(parseInt(searchParamsObj.page ?? "1", 10) || 1, 1);
  const limit = 10;

  const res = await fetch(`${EXHIBITS_URL}?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });

  const initialPosts = res.ok ? await res.json() : null;

  const errorMessage = res.ok ? null : "Error loading posts";
  const currentUser = await getCurrentUser();

  return (
    <StripePage
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
