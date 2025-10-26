import { useState, useEffect } from "react";
import axios from "axios";
import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

axios.defaults.baseURL = BACKEND_URL;
axios.defaults.timeout = 50000;

// Optional: response interceptor to catch 401s globally
axios.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If you have logout action and navigation, you can dispatch it here
      // but careful: useNavigate can't be used here, maybe dispatch logout only
      // or you can trigger an event for the app to react.
    }
    return Promise.reject(error);
  }
);

export const useNotification = () => {
  const callNotification = (description, type) => {
    notification.open({
      message: type === "error" ? "Error" : "Info",
      description,
      duration: 3,
      type,
    });
  };
  return { callNotification };
};

/**
 * Flexible API hook: can do GET, POST, etc.
 * @param {string} url - relative URL (axios baseURL applies)
 * @param {boolean} executeOnMount - whether to call GET on mount
 * @param {boolean} skipToken - whether to skip sending auth token
 * @returns [loading, response, error, callApi]
 */
export const useApiFetch = (url, executeOnMount = false, skipToken = false) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { callNotification } = useNotification();

  const authState = useSelector((state) => state.auth);
  const userInfo = authState?.userInfo;

  // Debug log
  console.log("useApiFetch: userInfo =", userInfo);

  const callApi = async ({ method = "GET", data = null, params = null } = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Build headers
      const headers = { "Content-Type": "application/json" };
      if (!skipToken && userInfo?.token) {
        headers["Authorization"] = `Bearer ${userInfo.token}`;
      }

      let res;
      const methodUpper = method.toUpperCase();
      if (methodUpper === "GET") {
        res = await axios.get(url, { headers, params });
      } else if (methodUpper === "POST") {
        res = await axios.post(url, data, { headers });
      } else {
        // other methods
        res = await axios({
          url,
          method: methodUpper,
          data,
          params,
          headers,
        });
      }

      setResponse(res.data);
      return res.data;
    } catch (err) {
      console.error("useApiFetch error:", err);
      setError(err);

      // Optionally show notification
      const msg = err.response?.data?.message || err.message || "API error";
      callNotification(msg, "error");

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // On mount, if executeOnMount = true, call GET automatically
  useEffect(() => {
    if (executeOnMount) {
      // Only call if skipToken or userInfo exists
      if (skipToken || userInfo) {
        callApi({ method: "GET" });
      }
    }
  }, [executeOnMount, userInfo, url]);

  return [loading, response, error, callApi];
};
