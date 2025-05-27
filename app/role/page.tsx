"use client";

import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Role {
  id: number;
  name: string;
}

const RoleFormAndList = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const router = useRouter();

  // Fetch roles from the API
  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:4001/gym/site/apis/roles");
      if (res.data.success) {
        setRoles(res.data.roles);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle form submission to create a new role
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmedName = name.trim();

    // Check if the role already exists
    const alreadyExists = roles.some(
      (role) => role.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (alreadyExists) {
      setError("Record already exists");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:4001/gym/site/apis/role", {
        name: trimmedName,
      });
      if (res.data.success) {
        fetchRoles(); // Refresh the role list
        setName(""); // Clear the input field
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
    }

    setLoading(false);
  };

  // Filter roles based on the search input
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="wrapper" style={{ width: "1260px" }}>
      <div className="page-container">
        <div className="container mt-4">
          <h3 className="mb-4">Permissions Setup</h3>

          <div className="flex gap-6 p-4 bg-gray-100 min-h-screen">
            {/* Left: Form */}
            <div className="w-1/3 bg-white p-4 rounded shadow border">
              <h2 className="text-lg font-semibold mb-4">Role</h2>
              <form onSubmit={handleSubmit}>
                <label className="block mb-1 font-medium text-sm">
                  Name<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded mb-2 text-sm"
                  required
                />
                {error && (
                  <div className="text-red-600 text-sm mb-2">{error}</div>
                )}
                <button
                  type="submit"
                  className="bg-gray-700 text-white px-4 py-2 rounded text-sm"
                  disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
              </form>
            </div>

            {/* Right: Role List */}
            <div className="w-2/3 bg-white p-4 rounded shadow border">
              <h2 className="text-lg font-semibold mb-4">Role List</h2>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 p-2 border rounded w-full text-sm"
              />

              <table className="w-full table-auto border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Role</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.map((role) => (
                    <tr key={role.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{role.name}</td>
                      <td className="p-2">System</td>
                      <td className="p-2">
                        <button
                          className="text-gray-600 hover:text-black"
                          onClick={() => router.push("/role/pag")}>
                          ✏️
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRoles.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-2 text-center text-gray-500">
                        No roles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="text-sm text-gray-500 mt-2">
                Records: 1 to {filteredRoles.length} of {roles.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleFormAndList;
