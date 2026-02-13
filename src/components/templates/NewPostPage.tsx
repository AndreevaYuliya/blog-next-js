import { FC } from "react";

import NewPostForm from "@/features/posts/components/NewPostForm";

import PageContainer from "@/components/sections/PageContainer";
import ControlBar from "@/components/sections/ControlBar";
import ContentContainer from "@/components/sections/ContentContainer";

const NewPostPage: FC = () => {
  return (
    <PageContainer>
      <ControlBar title="Create New Post" />

      <ContentContainer>
        <NewPostForm />
      </ContentContainer>
    </PageContainer>
  );
};

export default NewPostPage;
