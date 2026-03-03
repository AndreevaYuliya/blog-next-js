"use client";

import { FC } from "react";

import ContentContainer from "@/components/sections/ContentContainer";
import NewPostForm from "@/features/posts/components/NewPostForm";

const Page: FC = () => {
  return (
    <ContentContainer>
      <NewPostForm />
    </ContentContainer>
  );
};

export default Page;
