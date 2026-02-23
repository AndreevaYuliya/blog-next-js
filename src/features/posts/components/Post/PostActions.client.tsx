"use client";

import { FC } from "react";

import { useRouter } from "next/navigation";
import { useRequest } from "ahooks";

import { useAlertContext } from "@/contexts/AlertContext";
import { deleteExhibit } from "@/features/posts/services/exhibitActions";
import DeleteButton from "@/components/ui/DeleteButton";
import { User } from "@/types/User";

type Props = {
  postId: number;
  ownerId: number;
  currentUser?: User | null;
};

const PostActions: FC<Props> = (props) => {
  const { postId, ownerId, currentUser } = props;

  const { showAlert } = useAlertContext();
  const router = useRouter();

  const isOwner = currentUser?.id === ownerId;

  const { runAsync } = useRequest(() => deleteExhibit({ id: String(postId) }), {
    manual: true,
  });

  const handleDelete = async () => {
    if (!isOwner) {
      showAlert("You can only delete your own posts.", "error");

      return;
    }

    try {
      await runAsync();

      showAlert("Post deleted successfully", "success");

      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message || "Failed to delete post"
          : "Failed to delete post. Please try again.";

      showAlert(message, "error");
    }
  };

  if (!isOwner) {
    return null;
  }

  return <DeleteButton onDelete={handleDelete} />;
};

export default PostActions;
