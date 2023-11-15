"use client";
import Modal from "@/components/layout/Modal";
import { Input } from "@/components/ui/input";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import { signIn } from "next-auth/react";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";

const LoginModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggle = useCallback(() => {
    if (isLoading) return;
    loginModal.close();
    registerModal.open();
  }, [isLoading, loginModal, registerModal]);

  const handleSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      await signIn("credentials", {
        email,
        password,
      });
      toast.success("Logedin");
      loginModal.close();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [loginModal, email, password]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
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
      <p className="text-gray-500">
        First time using Tweeter?{" "}
        <span
          className="text-black hover:underline cursor-pointer"
          onClick={toggle}
        >
          Create an account.
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      body={bodyContent}
      title="Login"
      onClose={loginModal.close}
      onSubmit={handleSubmit}
      actionLabel="Signin"
      footer={footerContent}
    />
  );
};

export default LoginModal;
