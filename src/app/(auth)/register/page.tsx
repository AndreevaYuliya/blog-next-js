"use client";

import { FC } from "react";

import ContentContainer from "@/components/sections/ContentContainer";
import RegisterForm from "@/features/auth/components/RegisterForm";

const Page: FC = () => {
  return (
    <ContentContainer>
      <RegisterForm />
    </ContentContainer>
  );
};

export default Page;
