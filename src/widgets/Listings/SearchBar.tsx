export function SearchBar() {
  return (
    <div className="w-full flex justify-center my-4">
      <input
        type="text"
        placeholder="Value"
        className="w-96 px-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}