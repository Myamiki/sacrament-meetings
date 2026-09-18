export default function Header() {
  const today = new Date();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div>
          <h1 className="text-xl font-bold">Sacrament Meeting Planner</h1>
          <p className="text-sm text-gray-600">My Ward</p>
        </div>

        <p className="text-sm text-gray-600">
          {today.toLocaleDateString()}
        </p>
      </div>
    </header>
  );
}