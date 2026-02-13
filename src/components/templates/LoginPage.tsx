import { FC } from "react";

import LoginForm from "@/features/auth/components/LoginForm";

import PageContainer from "@/components/sections/PageContainer";
import ContentContainer from "@/components/sections/ContentContainer";
import ControlBar from "@/components/sections/ControlBar";

const LoginPage: FC = () => {
  return (
    <PageContainer>
      <ControlBar title="Login Page" />

      <ContentContainer>
        <LoginForm />
      </ContentContainer>
    </PageContainer>
  );
};

export default LoginPage;
