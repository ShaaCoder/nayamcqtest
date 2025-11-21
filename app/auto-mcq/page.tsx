import dynamic from "next/dynamic";

const AutoMcqClient = dynamic(() => import("../../components/AutoMcqClient"), {
  ssr: false,
});

export default function Page() {
  return <AutoMcqClient />;
}
