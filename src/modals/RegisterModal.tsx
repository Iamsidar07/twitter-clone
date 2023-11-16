"use client";
import { trpc } from "@/app/_trpc/client";
import Modal from "@/components/layout/Modal";
import { Input } from "@/components/ui/input";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import { signIn } from "next-auth/react";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const {
    mutate: createAccount,
    isLoading,
    error,
  } = trpc.register.useMutation({
    onSuccess: async () => {
      toast.success("Account Created");
      await signIn("credentials", {
        email,
        password,
      });
      toast.success("Logged in");
      registerModal.close();
    },
    onError() {
      toast.error("Something went wrong");
    },
  });

  const toggle = useCallback(() => {
    if (isLoading) return;
    registerModal.close();
    loginModal.open();
  }, [isLoading, loginModal, registerModal]);

  if (error) {
    toast.error("Something went wrong");
  }

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Name"
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

      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        type="email"
      />
      <Input
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        type="password"
      />
    </div>
  );

  const footerContent = (
    <div className="mt-2">
      <p className="text-gray-500 dark:text-gray-300">
        Allready have an account?
        <span
          className="text-black dark:text-blue-500 hover:underline cursor-pointer ml-1"
          onClick={toggle}
        >
          login now
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      body={bodyContent}
      title="Create an account"
      onClose={registerModal.close}
      onSubmit={() => createAccount({ name, email, password, username })}
      actionLabel="Register"
      footer={footerContent}
    />
  );
};

export default RegisterModal;
