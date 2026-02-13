import { FC } from "react";

import RegisterForm from "@/features/auth/components/RegisterForm";

import PageContainer from "@/components/sections/PageContainer";
import ControlBar from "@/components/sections/ControlBar";
import ContentContainer from "@/components/sections/ContentContainer";

const RegisterPage: FC = () => {
  return (
    <PageContainer>
      <ControlBar title="Register Page" />

      <ContentContainer>
        <RegisterForm />
      </ContentContainer>
    </PageContainer>
  );
};

export default RegisterPage;
