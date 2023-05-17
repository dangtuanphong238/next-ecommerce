import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession()

  return (
    <h2>
      Hello, <b>{session?.user?.name}</b>
    </h2>
  )
}
