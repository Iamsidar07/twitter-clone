"use client";
import { trpc } from "@/app/_trpc/client";
import ImageUpload from "@/components/ImageUpload";
import Modal from "@/components/layout/Modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useCurrentUser from "@/hooks/useCurrentUser";
import useEditProfileModal from "@/hooks/useEditProfileModal";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditProfileModal: React.FC = () => {
  const utils = trpc.useContext();
  const editProfileModal = useEditProfileModal();
  const { data: currentUser } = useCurrentUser();
  const {
    mutate: updateProfile,
    isLoading,
    error,
  } = trpc.editProfile.useMutation({
    onSuccess: () => {
      toast.success("updated successfully.");
      editProfileModal.close();
      // invalidate after updating
      utils.getUser.invalidate();
    },
  });

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    setName(currentUser?.name ?? "");
    setUsername(currentUser?.username ?? "");
    setCoverImage(currentUser?.coverImage ?? "");
    setBio(currentUser?.bio ?? "");
    setProfileImage(currentUser?.profileImage ?? "");
  }, [
    currentUser?.bio,
    currentUser?.coverImage,
    currentUser?.name,
    currentUser?.profileImage,
    currentUser?.username,
  ]);

  if (error) {
    toast.error("Something went wrong!");
  }

  const handleSubmit = useCallback(() => {
    if (!name || !username) return;
    updateProfile({ name, username, bio, profileImage, coverImage });
  }, [bio, coverImage, name, profileImage, updateProfile, username]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
      />
      <Input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={isLoading}
      />
      <Textarea
        placeholder="What's about you"
        value={bio ?? ""}
        onChange={(e) => setBio(e.target.value)}
        disabled={isLoading}
        rows={3}
        maxLength={150}
      />
      <ImageUpload
        value={profileImage}
        label="Upload profile image"
        disabled={isLoading}
        onChange={(image) => setProfileImage(image)}
      />
      <ImageUpload
        value={coverImage}
        label="Upload cover image"
        disabled={isLoading}
        onChange={(image) => setCoverImage(image)}
      />
    </div>
  );

  return (
    <Modal
      onClose={editProfileModal.close}
      actionLabel="save"
      isOpen={editProfileModal.isOpen}
      title="Edit your profile"
      body={bodyContent}
      disabled={isLoading}
      onSubmit={handleSubmit}
    />
  );
};

export default EditProfileModal;
