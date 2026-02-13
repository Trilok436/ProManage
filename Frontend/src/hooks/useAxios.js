import axios from "axios";

export const api = axios.create({
  baseURL: "https://promanage-backend-lkfv.onrender.com",
});

