"use client";

import { useRouter } from "next/navigation";

export default function ActionButton({
  action,
  children,
  style,
}: any) {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await action();
        router.refresh();
      }}
      style={style}
    >
      {children}
    </button>
  );
}