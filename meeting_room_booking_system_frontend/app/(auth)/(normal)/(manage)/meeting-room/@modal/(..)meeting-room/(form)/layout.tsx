"use client";

import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";
import { PropsWithChildren } from "react";

export default function MeetingRoomModalLayout({
  children,
}: PropsWithChildren) {
  const router = useRouter();

  return (
    <Modal
      isOpen
      backdrop="opaque"
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
      onClose={() => router.back()}
    >
      <ModalContent>
        {() => (
          <>
            <ModalBody className="my-5">{children}</ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
