"use client";

import { Button } from "@heroui/button";
import { useEffect } from "react";

export default function ClientError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h2 className="mb-2">Something went wrong!</h2>
      <Button
        color="danger"
        size="md"
        onPress={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
