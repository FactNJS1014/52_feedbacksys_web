import axios from "axios";

export default defineNuxtPlugin(() => {
  const api = axios.create({
    baseURL: "http://172.22.64.11/52_feedbacksys/52_feedbacksys_api",

    withCredentials: true,

    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
  });

  return {
    provide: {
      api,
    },
  };
});
