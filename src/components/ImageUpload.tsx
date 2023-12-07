"use client";
import Image from "next/image";
import React, { ReactNode, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
interface ImageUploadProps {
  value?: string;
  label: ReactNode;
  disabled?: boolean;
  showImage?: boolean;
  onChange: (base64: string) => void;
}
const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  label,
  disabled,
  showImage = true,
  onChange,
}) => {
  const [base64, setBase64] = useState(value);

  const handleChange = useCallback(
    (base64: string) => {
      onChange(base64);
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      // getbase64
      const reader = new FileReader();
      reader.onload = (event) => {
        setBase64(event.target?.result as string);
        handleChange(event.target?.result as string);
      };

      reader.readAsDataURL(file);
    },
    [handleChange],
  );

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
    },
    disabled,
  });
  return (
    <div
      {...getRootProps({
        className: "w-full p-2 border border-dotted",
      })}
    >
      <input {...getInputProps()} />
      {base64 && showImage ? (
        <div className="flex items-center justify-center">
          <Image
            src={base64}
            alt="uploaded image"
            width={100}
            height={100}
            className="object-cover w-full"
          />
        </div>
      ) : (
        label
      )}
    </div>
  );
};

export default ImageUpload;
