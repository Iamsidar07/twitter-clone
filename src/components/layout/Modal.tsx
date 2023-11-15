import React, { useCallback } from "react";
import { Button } from "../ui/button";
import { ShieldClose } from "lucide-react";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel?: string;
  disabled?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  disabled,
  body,
  title,
  onClose,
  onSubmit,
  actionLabel,
  footer,
}) => {
  const handleClose = useCallback(() => {
    if (disabled) return;
    onClose();
  }, [onClose, disabled]);

  const handleSubmit = useCallback(() => {
    if (disabled) return;
    if (onSubmit) onSubmit();
  }, [onSubmit, disabled]);

  if (!isOpen) return null;
  return (
    <>
      <div className="flex items-center justify-center overflow-x-hidden overflow-y-scroll fixed inset-0 outline-none focus:outline-none bg-neutral-800/70 z-50 max-h-screen">
        <div className="relative w-full lg:w-3/6 h-full max-h-[90%] overflow-y-scroll lg:h-auto lg:max-w-3xl mx-auto my-6">
          {/* content */}
          <div className="relative h-full lg:h-auto bg-white dark:bg-dark rounded-lg shadow-lg outline-none focus:outline-none flex flex-col w-full">
            {/* header */}

            <div className="flex items-center justify-between p-10 rounded-t">
              <h3 className="font-semibold text-lg lg:text-2xl">{title}</h3>
              <ShieldClose onClick={handleClose} className="cursor-pointer" />
            </div>

            {/* body */}
            <div className="relative flex-auto p-10">{body}</div>
            {/* footer */}
            <div className="relative flex flex-col gap-3 p-10">
              <Button disabled={disabled} onClick={handleSubmit}>
                {actionLabel}
              </Button>
              {footer}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
