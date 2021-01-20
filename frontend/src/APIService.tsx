import axios from "axios";
import { store } from "react-notifications-component";

export async function getUserData(
  showNotifications = true
): Promise<User | null> {
  /* Retrieves token from localStorage and gets user information */
  const token = localStorage.getItem("token");
  if (!token) {
    if (showNotifications) {
      store.addNotification({
        type: "danger",
        message: "User not logged in",
        container: "bottom-right",
        dismiss: {
          duration: 3000,
          showIcon: true,
        },
      });
    }
    return null;
  }

  try {
    const response = await axios.get("/api/user/get_user_info", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (showNotifications) {
      store.addNotification({
        container: "bottom-right",
        type: "danger",
        message:
          error?.response?.data?.message ||
          error.message ||
          error?.response?.statusText,
        dismiss: {
          duration: 3000,
          showIcon: true,
        },
      });
    }

    return null;
  }
}

export const updateUserData = async (
  userData: User,
  showNotifications: boolean = true
) => {
  try {
    const token = localStorage.getItem("token");
    const data: any = {};
    if (userData.userType === "applicant") {
      data.education = userData.education!.map((entry) => {
        if (String(entry.endYear) === "") {
          return {
            institutionName: entry.institutionName,
            startYear: entry.startYear,
          };
        } else {
          return entry;
        }
      });
      data.skills = userData.skills!;
    } else if (userData.userType === "recruiter") {
      data.contact = userData.contact!;
      data.bio = userData.bio!;
    }

    const response = await axios.post(
      "/api/user/update_user_info",
      {
        userType: userData.userType,
        name: userData.name,
        ...data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (showNotifications) {
      store.addNotification({
        container: "bottom-right",
        type: "success",
        message: response.data.message,
        dismiss: {
          duration: 3000,
          showIcon: true,
        },
      });
    }
  } catch (error) {
    if (showNotifications) {
      store.addNotification({
        container: "bottom-right",
        type: "danger",
        message:
          error?.response?.data?.message ||
          error.message ||
          error?.response?.statusText,
        dismiss: {
          duration: 3000,
          showIcon: true,
        },
      });
    }
  }
};
