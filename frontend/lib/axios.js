import axios from "axios";

export const axiosInstance=axios.create({
    baseURL:"https://agro-mark.onrender.com",
    withCredentials:true,
})