import { FC } from "react";

import PostsPageLayout, {
  PostsPageLayoutProps,
} from "@/components/templates/PostsPageLayout";

type Props = Omit<PostsPageLayoutProps, "title">;

const StripePage: FC<Props> = (props) => {
  return <PostsPageLayout title="Stripe Page" {...props} />;
};

export default StripePage;
