"use client";

import { FC } from "react";

import { useRouter } from "next/navigation";
import { useRequest } from "ahooks";

import { useAlertContext } from "@/contexts/AlertContext";
import { useAppSelector } from "@/stores/store";
import { deleteExhibit } from "@/features/posts/services/exhibitActions";
import DeleteButton from "@/components/ui/DeleteButton";

type Props = {
  postId: number;
  ownerId: number;
};

const PostActions: FC<Props> = (props) => {
  const { postId, ownerId } = props;

  const { showAlert } = useAlertContext();
  const router = useRouter();

  const currentUserId = useAppSelector((s) => s.user.user?.id);
  const isOwner = currentUserId === ownerId;

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

