import { FC } from "react";

import { GetExhibitsResponse } from "@/types/ExhibitsApi";
import { User } from "@/types/User";

import Post from "@/features/posts/components/Post";

import Pagination from "@/components/sections/Pagination";
import ContentContainer from "@/components/sections/ContentContainer";

import styles from "./styles.module.css";

export type PostsPageLayoutProps = {
  initialPosts: GetExhibitsResponse | null;
  currentUser?: User | null;
  page: number;
  limit: number;
  errorMessage?: string | null;
};

const PostsPageLayout: FC<PostsPageLayoutProps> = (props) => {
  const { initialPosts, currentUser, page, limit, errorMessage } = props;

  return (
    <>
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
            currentUser={currentUser}
          />
        ))}
      </ContentContainer>

      <Pagination total={initialPosts?.total ?? 0} limit={limit} page={page} />
    </>
  );
};

export default PostsPageLayout;
