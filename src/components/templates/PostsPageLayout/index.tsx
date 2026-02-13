import { FC } from "react";

import { GetExhibitsResponse } from "@/types/ExhibitsApi";
import { User } from "@/types/User";

import Post from "@/features/posts/components/Post";

import Pagination from "@/components/sections/Pagination";
import PageContainer from "@/components/sections/PageContainer";
import ContentContainer from "@/components/sections/ContentContainer";
import ControlBar from "@/components/sections/ControlBar";

import styles from "./styles.module.css";

export type PostsPageLayoutProps = {
  title: string;
  initialPosts: GetExhibitsResponse | null;
  page: number;
  limit: number;
  errorMessage?: string | null;
  currentUser?: User | null;
};

const PostsPageLayout: FC<PostsPageLayoutProps> = (props) => {
  const { title, initialPosts, page, limit, errorMessage, currentUser } = props;

  return (
    <PageContainer>
      <ControlBar title={title} initialUser={currentUser} />

      <ContentContainer>
        {errorMessage && (
          <div role="alert" className={styles.error}>
            {errorMessage}
          </div>
        )}

        {initialPosts?.data.map((post, index) => (
          <Post
            key={post.id}
            {...post}
            isFirstPost={index === 0}
            isLastPost={index === initialPosts.data.length - 1}
          />
        ))}
      </ContentContainer>

      <Pagination total={initialPosts?.total ?? 0} limit={limit} page={page} />
    </PageContainer>
  );
};

export default PostsPageLayout;
