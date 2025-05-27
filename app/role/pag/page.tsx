"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface FeaturePermission {
  name: string;
  permissionId: number;
  permissions: {
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
  };
}

interface ModulePermissions {
  moduleId: number;
  module: string;
  features: FeaturePermission[];
}

interface NewFeatureInput {
  name: string;
  permissions: {
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
  };
}

const PermissionsPage: React.FC = () => {
  const [permissionsData, setPermissionsData] = useState<ModulePermissions[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [newFeatureInputs, setNewFeatureInputs] = useState<
    Record<string, NewFeatureInput>
  >({});

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4001/gym/site/apis/module-permission"
        );
        const formatted = formatPermissions(response.data.data);
        setPermissionsData(formatted);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const formatPermissions = (data: any[]): ModulePermissions[] => {
    return data.map((mod) => ({
      moduleId: mod.id,
      module: mod.name,
      features: mod.permissions.map((perm: any) => ({
        name: perm.feature_name.replace(/^"+|"+$/g, ""),
        permissionId: perm.id,
        permissions: {
          view: perm.can_view === "All",
          add: perm.can_add === "All",
          edit: perm.can_update === "All",
          delete: perm.can_delete === "All",
        },
      })),
    }));
  };

  const togglePermission = (
    moduleIndex: number,
    featureIndex: number,
    action: keyof NewFeatureInput["permissions"]
  ) => {
    const updated = [...permissionsData];
    updated[moduleIndex].features[featureIndex].permissions[action] =
      !updated[moduleIndex].features[featureIndex].permissions[action];
    setPermissionsData(updated);
  };

  const toggleNewFeaturePermission = (
    moduleIndex: number,
    action: keyof NewFeatureInput["permissions"]
  ) => {
    const key = `mod-${moduleIndex}`;
    setNewFeatureInputs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        permissions: {
          ...prev[key]?.permissions,
          [action]: !prev[key]?.permissions?.[action],
        },
      },
    }));
  };

  const handleAddFeatureClick = (moduleIndex: number) => {
    const key = `mod-${moduleIndex}`;
    setNewFeatureInputs((prev) => ({
      ...prev,
      [key]: {
        name: "",
        permissions: { view: false, add: false, edit: false, delete: false },
      },
    }));
  };

  const handleNewFeatureNameChange = (moduleIndex: number, value: string) => {
    const key = `mod-${moduleIndex}`;
    setNewFeatureInputs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        name: value,
      },
    }));
  };

  const handleSaveNewFeature = async (moduleIndex: number) => {
    const module = permissionsData[moduleIndex];
    const key = `mod-${moduleIndex}`;
    const input = newFeatureInputs[key];
    if (!input?.name.trim()) return alert("Feature name is required");

    const body = {
      module_id: module.moduleId,
      feature_name: input.name,
      can_view: input.permissions.view ? "All" : "None",
      can_add: input.permissions.add ? "All" : "None",
      can_update: input.permissions.edit ? "All" : "None",
      can_delete: input.permissions.delete ? "All" : "None",
    };

    try {
      const res = await axios.post(
        "http://localhost:4001/gym/site/apis/createPermission",
        body
      );
      const newFeature: FeaturePermission = {
        name: res.data.permission.feature_name,
        permissionId: res.data.permission.id,
        permissions: {
          view: res.data.permission.can_view === "All",
          add: res.data.permission.can_add === "All",
          edit: res.data.permission.can_update === "All",
          delete: res.data.permission.can_delete === "All",
        },
      };

      const updated = [...permissionsData];
      updated[moduleIndex].features.push(newFeature);
      setPermissionsData(updated);

      const updatedInputs = { ...newFeatureInputs };
      delete updatedInputs[key];
      setNewFeatureInputs(updatedInputs);
    } catch (error) {
      console.error("Error saving new feature:", error);
      alert("Failed to save new feature");
    }
  };

  const handleSave = async () => {
    const payload = {
      roleId: 1, // Replace with dynamic roleId if needed
      permissions: permissionsData.map((module) => ({
        module: module.module,
        features: module.features.map((feature) => ({
          name: feature.name,
          permissions: feature.permissions,
        })),
      })),
    };

    const isValidPayload = payload.permissions.every((module) =>
      module.features.every((feature) =>
        ["view", "add", "edit", "delete"].every(
          (perm) =>
            typeof feature.permissions[
              perm as keyof typeof feature.permissions
            ] === "boolean"
        )
      )
    );

    if (!isValidPayload) {
      alert("Invalid payload. Please check the data and try again.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4001/gym/site/apis/save",
        payload
      );
      alert("Permissions saved successfully!");
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error saving permissions:", error);
      alert("Failed to save permissions. Please check the console.");
    }
  };

  if (loading) return <div className="p-6">Loading permissions...</div>;

  return (
    <div className="wrapper px-2 sm:px-4 max-w-screen-xl mx-auto">
      <div className="page-container">
        <div className="container mt-4">
          <div className="p-4 sm:p-6 bg-white shadow rounded-xl">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Assign Permissions
            </h2>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-5 py-3 text-left">Module</th>
                    <th className="border px-5 py-3 text-left">Feature</th>
                    <th className="border px-5 py-2 text-center">View</th>
                    <th className="border px-5 py-2 text-center">Add</th>
                    <th className="border px-5 py-2 text-center">Edit</th>
                    <th className="border px-5 py-2 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {permissionsData.map((module, moduleIndex) => {
                    const newKey = `mod-${moduleIndex}`;
                    return (
                      <React.Fragment key={module.moduleId}>
                        {module.features.map((feature, featureIndex) => (
                          <tr key={`${feature.name}-${featureIndex}`}>
                            {featureIndex === 0 && (
                              <td
                                rowSpan={
                                  module.features.length +
                                  (newFeatureInputs[newKey] ? 2 : 1)
                                }
                                className="border px-5 py-4 font-semibold align-top">
                                {module.module}
                              </td>
                            )}
                            <td className="border px-5 py-4">{feature.name}</td>
                            {(["view", "add", "edit", "delete"] as const).map(
                              (action) => (
                                <td
                                  key={action}
                                  className="border px-4 py-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={feature.permissions[action]}
                                    onChange={() =>
                                      togglePermission(
                                        moduleIndex,
                                        featureIndex,
                                        action
                                      )
                                    }
                                  />
                                </td>
                              )
                            )}
                          </tr>
                        ))}
                        {newFeatureInputs[newKey] && (
                          <tr>
                            <td className="border px-5 py-2">
                              <input
                                type="text"
                                className="border p-1 w-full"
                                placeholder="Feature Name"
                                value={newFeatureInputs[newKey].name}
                                onChange={(e) =>
                                  handleNewFeatureNameChange(
                                    moduleIndex,
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            {(["view", "add", "edit", "delete"] as const).map(
                              (action) => (
                                <td
                                  key={action}
                                  className="border px-4 py-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={
                                      newFeatureInputs[newKey]?.permissions?.[
                                        action
                                      ] || false
                                    }
                                    onChange={() =>
                                      toggleNewFeaturePermission(
                                        moduleIndex,
                                        action
                                      )
                                    }
                                  />
                                </td>
                              )
                            )}
                          </tr>
                        )}
                        <tr>
                          <td
                            colSpan={6}
                            className="border px-5 py-3 text-right">
                            {newFeatureInputs[newKey] ? (
                              <button
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                onClick={() =>
                                  handleSaveNewFeature(moduleIndex)
                                }>
                                Save Feature
                              </button>
                            ) : (
                              <button
                                className="bg-green-500 text-white px-4 py-1 rounded text-sm hover:bg-green-600 transition"
                                onClick={() =>
                                  handleAddFeatureClick(moduleIndex)
                                }>
                                + Add Feature
                              </button>
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="block md:hidden space-y-6">
              {permissionsData.map((module, moduleIndex) => {
                const newKey = `mod-${moduleIndex}`;
                return (
                  <div
                    key={module.moduleId}
                    className="border rounded-lg p-4 shadow-sm bg-gray-50">
                    <h3 className="font-semibold text-base mb-3 text-gray-800">
                      {module.module}
                    </h3>
                    <div className="space-y-4">
                      {module.features.map((feature, featureIndex) => (
                        <div
                          key={`${feature.name}-${featureIndex}`}
                          className="border rounded p-3 bg-white">
                          <div className="font-medium mb-2">{feature.name}</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {(["view", "add", "edit", "delete"] as const).map(
                              (action) => (
                                <label
                                  key={action}
                                  className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={feature.permissions[action]}
                                    onChange={() =>
                                      togglePermission(
                                        moduleIndex,
                                        featureIndex,
                                        action
                                      )
                                    }
                                  />
                                  <span className="capitalize">{action}</span>
                                </label>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                      {newFeatureInputs[newKey] && (
                        <div className="border rounded p-3 bg-white space-y-2">
                          <input
                            type="text"
                            className="border p-2 w-full text-sm"
                            placeholder="Feature Name"
                            value={newFeatureInputs[newKey].name}
                            onChange={(e) =>
                              handleNewFeatureNameChange(
                                moduleIndex,
                                e.target.value
                              )
                            }
                          />
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {(["view", "add", "edit", "delete"] as const).map(
                              (action) => (
                                <label
                                  key={action}
                                  className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={
                                      newFeatureInputs[newKey]?.permissions?.[
                                        action
                                      ] || false
                                    }
                                    onChange={() =>
                                      toggleNewFeaturePermission(
                                        moduleIndex,
                                        action
                                      )
                                    }
                                  />
                                  <span className="capitalize">{action}</span>
                                </label>
                              )
                            )}
                          </div>
                          <div className="text-right">
                            <button
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                              onClick={() => handleSaveNewFeature(moduleIndex)}>
                              Save Feature
                            </button>
                          </div>
                        </div>
                      )}
                      {!newFeatureInputs[newKey] && (
                        <div className="text-right">
                          <button
                            className="bg-green-500 text-white px-4 py-1 rounded text-sm"
                            onClick={() => handleAddFeatureClick(moduleIndex)}>
                            + Add Feature
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-right">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                onClick={handleSave}>
                Save All Permissions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsPage;
