import { useState } from "react";
import axios, { Axios } from "axios";
import { timeout } from "../config";
import { Alert, notification } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BACKEND_URL } from "../config";
import { logout } from "../store/slice/authSlice";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = BACKEND_URL;
axios.defaults.timeout = 50000;

const cache = {};

export const useNotification = () => {
  const callNotification = (description, type) => {
    notification.open({
      message: "info",
      description: description,
      duration: 3, // Duration in seconds, 0 means the notification won't close automatically,
      type: type,
    });
  };
  return { callNotification };
};

const useApiFetch = (url, executeOnMount = false) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { callNotification } = useNotification();


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const fetchData = async (data) => {
    try {
      setLoading(true);
      const  resData = await axios.get(url,  {
        params: data,
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "application/json",
        },
      });
      setResponse(resData?.data);
    } catch (error) {
      console.log(error);
      callNotification("Session expired.", "error");

      dispatch(logout());
      navigate("/auth/login");
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (executeOnMount) {
      fetchData();
    }
  }, []);

  return [loading, response, error, fetchData];
};


const useFetch = (url, executeOnMount = false, useCache = false) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  const fetchData = async () => {
    if (useCache && cache[url]) {
      setData(cache[url]);
    } else {
      try {
        const { data } = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
        });
        if (useCache) cache[url] = data;

        setData(data);
      } catch (err) {
        console.log(err);
        if (err) {
          //unauthenticated
          if (err.response?.status === 401) {
            dispatch(logout())
            navigate("/")
            //navigate("/auth/login")
          }
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (executeOnMount) {
      fetchData();
    }
  }, []);

  return [loading, data, error, fetchData];
};


export { useApiFetch, useFetch };
