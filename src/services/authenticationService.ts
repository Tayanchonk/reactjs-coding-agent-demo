import { getAppDatetimePreference } from "./dateandtimeService";
import api from "./index";
import axios from "axios";
import { store } from "../store";
import { setDateTimeFormat } from "../store/slices/dateTimeFormatSlice";
import { setCurrentUser } from "../store/slices/currentUserSlice";
import { setSession } from "../store/slices/sessionSlice";
import { getAppSession } from "./sessionSettingService";

export const loginUser = async (email_address: string, password: string, TwoFactorCode?:string) => {
  return axios.post(
    `/api/login`,
    { email_address, password ,TwoFactorCode },
    { withCredentials: true }
  );
};

export const sendResetEmail = async (email_address: string) => {
  return api.post(`/forgot-password`, {
    email_address,
  });
};

export const verifyToken = async () => {
  return api.get(`/verify`, {
    withCredentials: true,
  });
};

export const logOutUser = async () => {
  return api.post(`/logout`, {
    withCredentials: true,
  });
};

export const verifyCode = async (verification_code: string) => {
  return api.post(`/verify-reset-password`, {
    verification_code,
  });
};

export const resetPassword = async (
  verification_code: string,
  password: string
) => {
  return api.post(`/reset-password-by-verify-code`, {
    verification_code,
    password,
  });
};

export const resetNewPassword = async (
  password: string
) => {
  return axios.post(`/api/reset-password`, {
    password,
    withCredentials: true
  });
};

export const refreshToken = async () => {
  return api.post(
    `/refresh`,
    {
      email_address: "string",
    },
    {
      withCredentials: true,
    }
  );
};

export const getUserInfo = async () => {
  const response = await api.get("/me", {
    withCredentials: true,
  });
  setupSession(response)
  setUserInfo(response)
  setDateTimeFormats(response)
  return response;
};

// เก็บข้อมูล user ลง sessionStorage
const setUserInfo = async (response: any) => {
  const userdata = {
    user_account_id: response.data.user_account_id,
    first_name: response.data.first_name,
    last_name: response.data.last_name,
    customer_id: response.data.customer_id,
    job_title: response.data.job_title,
    manager: response.data.manager,
    email: response.data.email,
    profile_image_base64: response.data.profile_image_base64,
    organizationId: response.data.organizationId
  };
  store.dispatch(setCurrentUser(userdata));
  sessionStorage.setItem("user", JSON.stringify(userdata));
};

// เก็บข้อมูล datetime ลง localStorage
const setDateTimeFormats = async (response: any) => {
  const datetimePreference = await getAppDatetimePreference(response.data.customer_id)
  const datetime = {
    dateFormat: datetimePreference.data.data.dateFormat,
    timeFormat: datetimePreference.data.data.timeFormat,
    timeZoneName: datetimePreference.data.data.timeZoneName,
  }
  store.dispatch(setDateTimeFormat(datetime));
  localStorage.setItem("datetime", JSON.stringify(datetime));
};

// เก็บข้อมูล setupSession
const setupSession = async (response: any) => {
  const Sessionresp = (await getAppSession(response.data.customer_id)).data;
  const Session = {
    enableSessionProtection: Sessionresp.enableSessionProtection,
    sessionTimeoutTimeType: Sessionresp.sessionTimeoutTimeType,
    sessionTimeoutDuration: Sessionresp.sessionTimeoutTimeType === "Hour" ? Sessionresp.sessionTimeoutDuration * 3600 : Sessionresp.sessionTimeoutDuration * 60,
    enableRememberLastOrganization: Sessionresp.enableRememberLastOrganization
  }
  //console.log(Session.sessionTimeoutDuration)
  store.dispatch(setSession(Session));
};

export const resendCode = async (email_address: string) => {
  return api.post(`/resend-code`, {
    email_address,
  });
};