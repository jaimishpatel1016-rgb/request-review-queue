import RequestDetail from "@/components/requests/requestDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex min-h-svh p-6">
      <RequestDetail id={id} />
    </div>
  );
}
