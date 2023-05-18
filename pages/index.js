import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession()

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        
        <div className="flex bg-gray-300 text-black gap-1 rounded-lg overflow-hidden">
          
        </div>
      </div>
    </Layout>
  )
}
