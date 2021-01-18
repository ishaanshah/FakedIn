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
      if (error.response) {
        store.addNotification({
          container: "bottom-right",
          type: "danger",
          message: error.response?.data?.message || error.response.statusText,
          dismiss: {
            duration: 3000,
            showIcon: true,
          },
        });
      } else {
        store.addNotification({
          container: "bottom-right",
          type: "danger",
          message: error.message,
          dismiss: {
            duration: 3000,
            showIcon: true,
          },
        });
      }
    }

    return null;
  }
}
