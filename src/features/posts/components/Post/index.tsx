import Image from "next/image";

import { GetExhibitResponse } from "@/types/ExhibitsApi";
import CommentStripe from "@/features/comments/components/CommentStripe";
import PostActions from "@/features/posts/components/Post/PostActions.client";

import styles from "./styles.module.css";
import { User } from "@/types/User";

type Props = GetExhibitResponse & {
  isFirstPost: boolean;
  isLastPost: boolean;
  currentUser?: User | null;
};

const Post = (props: Props) => {
  const {
    user,
    imageUrl,
    description,
    createdAt,
    commentCount,
    isFirstPost,
    isLastPost,
    currentUser,
  } = props;

  const imageSrc = imageUrl
    ? `/api/image?url=${encodeURIComponent(imageUrl)}`
    : "/fallback.jpg";

  return (
    <article
      className={`${styles.post} ${isFirstPost ? styles.first : ""} ${
        isLastPost ? styles.last : ""
      }`}
    >
      <div className={styles.userContainer}>
        <div className={styles.avatar}>{user.username?.[0]?.toUpperCase()}</div>

        <div>
          <p className={styles.username}>{user.username}</p>
          <p className={styles.date}>{new Date(createdAt).toLocaleString()}</p>
        </div>

        <PostActions
          postId={props.id}
          ownerId={user.id}
          currentUser={currentUser}
        />
      </div>

      <div>
        <Image
          src={imageSrc}
          alt={description}
          className={styles.image}
          width={300}
          height={200}
        />
        <p className={styles.description}>{description}</p>
      </div>

      <CommentStripe
        postId={String(props.id)}
        commentCount={commentCount}
        currentUser={currentUser}
      />
    </article>
  );
};

export default Post;
