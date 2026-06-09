import Link from "next/link";
import AppLoading from "../components/app-loading";
import { getApiVersion } from "@/lib/services";
import { Suspense } from "react";

async function ApiVersion() {
  const data = await getApiVersion();
  return <p>API Version: {data.version}</p>;
}

// http://localhost:3000/about
export default function AboutPage() {
  return (
    <main>
      <Suspense fallback={ <AppLoading /> }>
        <ApiVersion />
      </Suspense>     
      <hr />
      <Link href="/" className="underline">
        Home Page
      </Link>
    </main>
  );
}