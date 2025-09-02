import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type useDisclosure,
} from "@heroui/react";
import type { PropsWithChildren, ReactNode } from "react";

interface Props extends PropsWithChildren {
  header?: ReactNode;
  onCancel?(): void;
  onConfirm(): void;
}

export const ConfimModal = ({
  header,
  children,
  isOpen,
  onOpenChange,
  onCancel,
  onConfirm,
}: Props & ReturnType<typeof useDisclosure>) => {
  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {header ?? "提示"}
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  onClose();
                  onCancel?.();
                }}
              >
                取消
              </Button>
              <Button
                color="primary"
                onPress={async () => {
                  onClose();
                  onConfirm();
                }}
              >
                确定
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
