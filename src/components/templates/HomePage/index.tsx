import { FC } from "react";

import PostsPageLayout, {
  PostsPageLayoutProps,
} from "@/components/templates/PostsPageLayout";

type Props = Omit<PostsPageLayoutProps, "title">;

const HomePage: FC<Props> = (props) => {
  return <PostsPageLayout title="My Posts" {...props} />;
};

export default HomePage;
