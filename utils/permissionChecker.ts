interface PermissionCheckResult {
  hasPermission: boolean;
  message?: string;
}

export const checkUserPermission = async (
  moduleName: string,
  action: string,
  staff_id: number
): Promise<PermissionCheckResult> => {
  try {
    const response = await fetch("/api/checkPermission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ moduleName, action, staff_id }),
    });

    const data = await response.json();

    if (response.ok) {
      return { hasPermission: data.hasPermission };
    } else {
      return {
        hasPermission: false,
        message: data.message || "Permission denied.",
      };
    }
  } catch (error) {
    console.error("Error checking permission:", error);
    return {
      hasPermission: false,
      message: "An error occurred while checking permissions.",
    };
  }
};

export const showPermissionDeniedAlert = (
  message: string = "You do not have permission to access this resource."
) => {
  alert(message);
};
