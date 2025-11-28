export default function EditPayCyclePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-heading-1">Edit Pay Cycle</h1>
      <p>Pay cycle ID: {params.id}</p>
    </div>
  );
}