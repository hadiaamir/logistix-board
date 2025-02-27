import axios from "axios";

const instance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Flatten axios response nesting
instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const error = {
      ...err.response?.data?.error, // Ensure optional chaining to avoid errors
      ...err,
    };
    return Promise.reject(error);
  }
);

// Function for image upload
export const uploadFile = async ({ route, formData, options = {} }) => {
  let headers = { "Content-Type": "multipart/form-data" };

  if (options.headers) headers = { ...headers, ...options.headers };

  return instance.post(route, formData, { ...options, headers });
};

export default instance;
