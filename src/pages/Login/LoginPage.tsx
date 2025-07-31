import React, { useState, useEffect } from "react";
import Maskgroup from "../../assets/images/Maskgroup.png";
import Group from "../../assets/images/Group.png";
import logoiconwhite from "../../assets/images/logoiconwhite.png";
import bgImages from "../../assets/images/bg.png";
import logoicon from "../../assets/images/logoicon.png";
import logoSuperAppPDPA from "../../assets/images/logoSuperAppPDPA.png";
import checkBox from "../../assets/images/check_circle.png";
import cancelBox from "../../assets/images/cancel.png";
import { RootState } from "../../store"; // ตรวจสอบ path ให้ถูกต้องตามโปรเจคของคุณ
import "./LoginPage.css"; // Import CSS file
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOpenLoadingTrue, setOpenLoadingFalse } from "../../store/slices/loadingSlice";
import { Button, InputText } from "../../components/CustomComponent";

import {
  loginUser,
  sendResetEmail,
  resetPassword,
  verifyCode,
  verifyToken,
  getUserInfo,
  resendCode,
} from "../../services/authenticationService";
import {
  validateEmail,
  validatePassword,
  validateNewPassword,
} from "../../utils/validation";
import { setLanguageEn, setLanguageTh } from "../../store/slices/languageSlice";
import { useTranslation } from "react-i18next";
import { ProgressIndicator } from "../../components/ProgressIndicator";
import Alert from "../../components/Alert";
import { setOpenFalse } from "../../store/slices/openSidebarSlice";
import notification from "../../utils/notification";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const ENV = import.meta.env;
  console.log(ENV)
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const verificationCode = searchParams.get("verifycode");
  const loading = useSelector((state: RootState) => state.loading.loading);
  const [language, setLanguage] = useState(localStorage.getItem("i18nextLng") || "en");
  const companylogoicon = localStorage.getItem("companylogoicon") || logoicon;
  const { t, i18n } = useTranslation();
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [typeAlert, setTypeAlert] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value)
    if (e.target.value === "en") {
      dispatch(setLanguageEn());
    } else {
      dispatch(setLanguageTh());
    }
    let leg = language === "en" ? "th" : "en";
    localStorage.setItem("i18nextLng", leg);
    i18n.changeLanguage(leg);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword((prevState: any) => !prevState);
  };
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prevState: any) => !prevState);
  };

  useEffect(() => {
    const checkVerificationCode = async () => {
      if (
        !verificationCode &&
        location.pathname.startsWith("/reset-password")
      ) {
        navigate("/login");
        return;
      }
      if (verificationCode) {
        try {
          dispatch(setOpenLoadingTrue())
          await verifyCode(verificationCode);
          dispatch(setOpenLoadingFalse())
        } catch (error) {
          dispatch(setOpenLoadingFalse())
          navigate("/login");
        }
      }
    };
    const checkAuthentication = async () => {
      try {
        dispatch(setOpenLoadingTrue())
        await verifyToken();
        dispatch(setOpenLoadingFalse())

        navigate("/");
      } catch (error) {
        dispatch(setOpenLoadingFalse())
      }
    };
    if (location.pathname === "/login") {
      checkAuthentication();
      dispatch(setOpenFalse())
    }
    checkVerificationCode();
  }, [verificationCode, location.pathname, navigate]);

  const [showPassword, setShowPassword] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validateResetPassword, setValidateResetPassword] = useState({
    haslength: false,
    hasUpperLowerCase: false,
    hasNumber: false,
    hasSpecialCharacter: false,
  });
  const [newPassword, setNewPassword] = useState("");
  const [sendMailStatus, setSendMailStatus] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginError, setloginError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [isResendDisabled, setIsResendDisabled] = useState<Boolean>(false);
  const [openAlert, setOpenAlert] = useState<Boolean>(false);

  const [verificationCodeTwoFa, setVerificationCodeTwoFa] = useState(Array(6).fill(''));
  const [verificationCodeError, setVerificationCodeError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newCode = [...verificationCodeTwoFa];
      newCode[index] = value;
      setVerificationCodeTwoFa(newCode);

      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`verificationCode-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (ENV.PROD)
      return;
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '');
    if (digits) {
      const newCode = Array(6).fill('');
      let lastFocusedInputIndex = -1;
      for (let i = 0; i < digits.length && i < 6; i++) {
        newCode[i] = digits[i];
        lastFocusedInputIndex = i;
      }
      setVerificationCodeTwoFa(newCode);
      if (lastFocusedInputIndex !== -1 && lastFocusedInputIndex < 5) {
        const nextInput = document.getElementById(`verificationCode-${lastFocusedInputIndex + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      } else if (lastFocusedInputIndex === 5) {
        const currentInput = document.getElementById(`verificationCode-${lastFocusedInputIndex}`);
        if (currentInput) {
          currentInput.focus();
        }
      }
    }
  };

  const handleKeyDown = (e: any, index: any) => {
    if (e.key === 'Backspace' && verificationCodeTwoFa[index] === '' && index > 0) {
      const prevInput = document.getElementById(`verificationCode-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState: any) => !prevState);
  };

  const handleForgotPassword = () => {
    setSendMailStatus(false);
    navigate("/forgot-password");
  };

  const handleEmailBlur = () => {
    if (validateEmail(email)) {
      setEmailError("");
    }
  };

  const handlePasswordBlur = () => {
    if (validatePassword(password)) {
      setPasswordError("");
    }
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    let isValid = true;
    if (location.pathname !== "/2fa") {


      if (!validateEmail(email)) {
        setEmailError(t("loginPage.emailError"));
        isValid = false;
      } else {
        setEmailError("");
      }

      if (!validatePassword(password)) {
        setPasswordError(t("loginPage.passwordError"));
        isValid = false;
      } else {
        setPasswordError("");
      }
    } else {

      if (!validateEmail(location.state.email) || !validatePassword(location.state.password)) {
        navigate("/login")
      }

      console.log(verificationCodeTwoFa);

      // check ค่าว่าง verificationCodeTwoFa
      if (verificationCodeTwoFa.some(code => code === '')) {
        setVerificationCodeError(t("loginPage.verificationCodeError"));
      } else {
        setVerificationCodeError('');

      }





    }
    if (isValid) {
      dispatch(setOpenLoadingTrue());
      try {

        const dataSend = {
          email: email,
          password: password
        }
        if (location.pathname === "/2fa") {
          dataSend.email = location.state.email;
          dataSend.password = location.state.password
        }

        const resp: any = await loginUser(dataSend.email, dataSend.password, verificationCodeTwoFa.join(''));
        console.log(resp);

        if (resp.data.message === "2fa") {
          navigate("/2fa",
            {
              state: { email: email, password: password },
            }
          );
          dispatch(setOpenLoadingFalse());
          return;

        }
        await getUserInfo();
        const redirectPath = location.state?.from || "/";
        dispatch(setOpenLoadingFalse());
        navigate(redirectPath);
      } catch (error: any) {
        console.log(error);
        dispatch(setOpenLoadingFalse());
        setloginError(t("loginPage.loginError"));
        if (error.response.status === 400) {
          if (error.response.data.message === "Password has expired") {
            window.open(`reset-password?verifycode=${error.response.data.verificationCode}`, '_blank');


            // navigate(`reset-password?verifycode=${error.response.data.verificationCode}`);
          }
          if (error.response.data.message === "Verification link has already been used" ||
            error.response.data.message === "Operation is not valid due to the current state of the object."
          ) {
            setTypeAlert("error")
            setAlertMessage(t('loginPage.verificationCodeErrorForUsed'))
            setOpenAlert(true)
            setTimeout(() => {
              setOpenAlert(false)
            }, 3000)
          }



        }
      }
    }
  };

  const handleResendCode = async () => {
    setIsResendDisabled(true);

    try {
      if (location.state.email) {
        const resp = await resendCode(location.state.email)
        setTypeAlert("success")
        setAlertMessage("Send Success")
        setOpenAlert(true)
        setIsResendDisabled(false);

        setTimeout(() => {
          setOpenAlert(false)
        }, 3000)
      } else {
        navigate("/login")
      }


    } catch (error) {
      setTypeAlert("error")
      setAlertMessage("Send Fail")
      setOpenAlert(true)

      setIsResendDisabled(false);
      setTimeout(() => {
        setOpenAlert(false)
      }, 3000)
      console.log(error);

    }


  }

  const handleSendEmail = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError(t("loginPage.emailError"));
      isValid = false;
    } else {
      setEmailError("");
    }

    if (isValid) {
      setSendMailStatus(true);
      try {
        await sendResetEmail(email);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleResetPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    let isValid = true;
    const countTrueValues = Object.values(validateResetPassword).filter(value => value === true).length;

    if (countTrueValues !== 4) {
      setNewPasswordError("");
      isValid = false;
    } else {
      setNewPasswordError("");
    }

    // Validate same password
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(t("loginPage.passwordMatch"));
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (isValid) {
      if (verificationCode) {
        try {
          await resetPassword(verificationCode, newPassword);
          notification.success(t("loginPage.resetPasswordSuccess"));
          navigate("/login");
        } catch (error) {
          if (
            error instanceof Error &&
            "response" in error &&
            (error as any).response.data
          ) {
            setNewPasswordError((error as any).response.data.message);
          } else {
            setNewPasswordError("");
          }
        }
      } else {
        console.log("Verification code is missing.");
      }
    }
  };

  useEffect(() => {
    setEmailError("")
  }, [email])
  useEffect(() => {
    setPasswordError("")
  }, [password])
  useEffect(() => {
    setConfirmPasswordError("")
  }, [confirmPassword])
  useEffect(() => {
    setValidateResetPassword(validateNewPassword(newPassword));
    setNewPasswordError("")
  }, [newPassword])

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 m-4 z-10">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-2 rounded border h-10"
        >
          <option value="en">English</option>
          <option value="th">ไทย</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-8">
        <div className="hidden md:block md:col-span-5 bg-image">
          {/* <img className="maskgroup" src={bgImages} alt="Maskgroup" /> */}
          {/* <img className="group" src={bgImages} alt="Group" /> */}
          <div className="text-login ">
            <img src={logoSuperAppPDPA} alt="" className="logoSuperAppPDPA" />
            <h6 className="easily text-medium text-base">
              Easily manage and orchestrate customer consent and preferences
            </h6>
            <p className="powered text-base">
              Powered by{" "}
              <b className="font-extrabold">MetroSystems</b>{" "}
            </p>
          </div>
        </div>
        <div className="col-span-1 md:col-span-3 bg-from">
          <div className="mt-10 p-16">
            <img src={companylogoicon} alt="" className="logoicon" />

            {/* ส่วนของการเข้าสู่ระบบ */}
            {location.pathname === "/login" && (
              <>
                <h2 className="text-xxl font-semibold" >
                  {t("loginPage.signIn")}
                </h2>
                <p className="text-base" >
                  {t("loginPage.signInWithYourEmailandPassword")}
                </p>
                <form className="space-y-6 mt-5" onSubmit={handleLogin}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-base/6 font-medium text-gray-900"
                    >
                      {t("loginPage.email")} <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="mt-2">
                      <InputText
                        type={"text"}
                        id={"email"}
                        value={email}
                        className=""
                        isError={emailError != ""}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("loginPage.placeholderEmail")}
                      />
                      {/* <input
                        type="email"
                        name="username"
                        id="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailBlur}
                        autoComplete="username"
                        placeholder={t("loginPage.placeholderEmail")}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-base/6"
                      /> */}
                      {emailError && (
                        <p className="text-red-500 text-base pt-1">{emailError}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-base/6 font-medium text-gray-900"
                      >
                        {t("loginPage.password")} <span style={{ color: "red" }}>*</span>
                      </label>
                    </div>
                    <div className="mt-2">
                      <div className="relative mt-2">
                        <InputText
                          id={"password"}
                          type={showPassword ? "password" : "text"}
                          value={password}
                          className=""
                          onChange={(e) => setPassword(e.target.value)}
                          isError={passwordError != ""}
                        />
                        {/* <InputText
                          type={showPassword ? "password" : "text"}
                          name="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onBlur={handlePasswordBlur}
                          autoComplete="password"
                          required
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-base/6"
                        /> */}
                      </div>
                      {passwordError && (
                        <p className="text-red-500 text-base pt-1">{passwordError}</p>
                      )}
                    </div>
                    <div className="text-base mt-3">
                      <a
                        className=" font-semibold text-[#625B5B] cursor-pointer"
                        onClick={handleForgotPassword}
                      >
                        {t("loginPage.forgotPassword")}
                      </a>
                    </div>
                  </div>

                  <div>
                    {loginError && (
                      <p className="text-red-500 text-base pb-1">{loginError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-base/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {loading ? (
                        <>
                          <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                          {t("loginPage.loading")}...
                        </>
                      ) : (
                        t("loginPage.loginButton")
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ส่วน Forgot Password */}
            {location.pathname === "/forgot-password" &&
              (sendMailStatus ? (
                <>
                  <h2 className="text-xxl font-semibold" >
                    {t("loginPage.checkYourEmail")}
                  </h2>
                  <h6 className="text-base w-full" >
                    {t("loginPage.pleaseCheckTheEmailDddress")}{" "}
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 900,
                        marginRight: "3px",
                      }}
                    >
                      {email}
                    </span>
                    {t("loginPage.forInstructionsToResetYourPassword")}
                  </h6>
                  <div className="text-center mt-5">
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-base/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => {
                        navigate("/login");
                      }}
                    >
                      {t("loginPage.backToSignIn")}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xxl font-semibold" >
                    {t("loginPage.forgotYourPassword")}
                  </h2>
                  <h6 className="text-base w-full" >
                    {t("loginPage.emailResetInstructions")}
                  </h6>
                  <form className="space-y-6 mt-5" onSubmit={handleSendEmail}>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-base/6 font-medium text-gray-900"
                      >
                        {t("loginPage.emailAddress")} <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="mt-2">
                        <InputText
                          type={"text"}
                          id={"email"}
                          value={email}
                          isError={emailError != ""}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t("loginPage.placeholderEmail")}
                        />
                        {/* <input
                          type="email"
                          name="email"
                          id="email"
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          autoComplete="email"
                          placeholder={t("loginPage.pleaseCheckTheEmailDddress")}
                          required
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-base/6"
                        /> */}
                        {emailError && (
                          <p className="text-red-500 text-base">{emailError}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-base/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {t("loginPage.sendEmail")}
                      </button>
                    </div>
                  </form>
                </>
              ))}

            {/* ส่วน Reset/Set Password */}
            {(location.pathname === "/reset-password" || location.pathname === "/set-password") && loading == false && (
              <>
                <h2 className="text-xxl font-semibold" >
                  {(() => {
                    switch (location.pathname) {
                      case "/reset-password":
                        return t("loginPage.createNewPassword");
                      case "/set-password":
                        return t("loginPage.setUpYourPassword");
                      default:
                        return "";
                    }
                  })()}
                </h2>
                <h6 className="text-base w-full" >
                  {t("loginPage.EnterANewPasswordToContinue")}
                </h6>
                <form className="space-y-6 mt-5" onSubmit={handleResetPassword}>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-base/6 font-medium text-gray-900"
                    >
                      {t("loginPage.newPassword")}  <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="relative w-full mt-2">
                      <InputText
                        id="password"
                        type={showNewPassword ? "password" : "text"}
                        value={newPassword}
                        isError={newPasswordError != ""}
                        onChange={(e) => { setNewPassword(e.target.value) }
                        }
                        placeholder={t("loginPage.placeholderNewPassword")}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-base/6 font-medium text-gray-900"
                    >
                      {t("loginPage.confirmpassword")} <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="relative w-full mt-2">
                      <InputText
                        id="confirm-password"
                        type={showConfirmPassword ? "password" : "text"}
                        value={confirmPassword}
                        isError={confirmPasswordError != ""}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t("loginPage.placeholderNewPassword")}
                      />
                    </div>
                    {confirmPasswordError && (
                      <p className="text-red-500 text-base pt-1">{confirmPasswordError}</p>
                    )}
                  </div>
                  <ProgressIndicator
                    progress={
                      Object.values(validateResetPassword).filter(
                        (value) => value === true
                      ).length
                    }
                  />
                  <div className=" mt-3">
                    <p className="text-base/6 flex font-semibold text-[#625B5B]">
                      <img
                        src={
                          validateResetPassword?.haslength ? checkBox : cancelBox
                        }
                        className="mr-2"
                        style={{
                          width: "15px",
                          height: "15px",
                          marginTop: "3px",
                        }}
                        alt=""
                      />{" "}
                      <span>
                        {t("loginPage.mustbeatLast8Characterslong")}
                      </span>
                    </p>
                    <p className="text-base/6 flex font-semibold text-[#625B5B]">
                      <img
                        src={
                          validateResetPassword.hasUpperLowerCase
                            ? checkBox
                            : cancelBox
                        }
                        className="mr-2"
                        style={{
                          width: "15px",
                          height: "15px",
                          marginTop: "3px",
                        }}
                        alt=""
                      />{" "}
                      <span>
                        {t("loginPage.mustcontainanuppercaseandlowercaseletter")}
                      </span>
                    </p>
                    <p className="text-base/6 flex font-semibold text-[#625B5B]">
                      <img
                        src={
                          validateResetPassword?.hasNumber ? checkBox : cancelBox
                        }
                        className="mr-2"
                        style={{
                          width: "15px",
                          height: "15px",
                          marginTop: "3px",
                        }}
                        alt=""
                      />{" "}
                      <span>{t("loginPage.mustcontainanumber")}</span>
                    </p>
                    <p className="text-base/6 flex font-semibold text-[#625B5B]">
                      <img
                        src={
                          validateResetPassword?.hasSpecialCharacter
                            ? checkBox
                            : cancelBox
                        }
                        className="mr-2"
                        style={{
                          width: "15px",
                          height: "15px",
                          marginTop: "3px",
                        }}
                        alt=""
                      />{" "}
                      <span>{t("loginPage.mustContainaSpecialCharacter")}</span>
                    </p>
                  </div>
                  {newPasswordError && (
                    <p className="text-red-500 text-base ">{newPasswordError}</p>
                  )}
                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-base/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {(() => {
                        switch (location.pathname) {
                          case "/reset-password":
                            return t("loginPage.resetPassword");
                          case "/set-password":
                            return t("loginPage.setPassword");
                          default:
                            return "";
                        }
                      })()}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ส่วนของการเข้าสู่ระบบ */}
            {location.pathname === "/2fa" && (
              <>
                <h2 className="text-xxl font-semibold" >
                  {t("loginPage.twoFactorAuthentication")}
                </h2>
                <p className="text-base" >
                  {t("loginPage.enterTheCodeSentToYourEmail")}- <strong>{location.state?.email}</strong>
                </p>
                <form className="space-y-6 mt-5" onSubmit={handleLogin}>
                  <div>
                    <label
                      htmlFor="verificationCode"
                      className="block text-base/6 font-medium text-gray-900"
                    >
                      <span style={{ color: "red" }}>*</span> {t("loginPage.verificationCode")}
                    </label>
                    <div className="mt-2 flex space-x-2 md:space-x-4">
                      {verificationCodeTwoFa.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          id={`verificationCode-${index}`}
                          name={`verificationCode-${index}`}
                          value={digit}
                          onChange={(e) => handleChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          autoComplete="off"
                          maxLength={1}
                          style={{ border: '1px solid #E3E8EC' }}
                          className="flex-grow w-10 h-14 text-center rounded-lg bg-white text-base text-gray-900  outline-[#E3E8EC] placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                        />
                      ))}
                    </div>
                    {verificationCodeError && (
                      <p className="text-red-500 text-base pt-1">{verificationCodeError}</p>
                    )}

                    {/* remember  */}
                    {/* 
                    <div className="mt-5 justify-center justify-items-center">
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox rounded-sm border-[#DFE4EA]" />
                        <span className="ml-2 text-base/6 text-[#656668]">
                          {t("loginPage.rememberMeLogin")}
                        </span>
                      </label>
                    </div> */}

                  </div>

                  <div>

                    <button
                      type="submit"
                      disabled={loading || verificationCodeTwoFa.some(code => code === '')}
                      className="flex w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-base/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {loading ? (
                        <>
                          <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                          {t("loginPage.loading")}...
                        </>
                      ) : (
                        t("loginPage.verifyCode")
                      )}
                    </button>
                  </div>

                  <div className="justify-items-center">

                    {/* resend code */}
                    <p className="text-base flex items-center" >
                      {t("loginPage.didNotgetCode")}
                    </p>
                    <p
                      className={`flex items-center text-base text-[#3758F9] cursor-pointer ${isResendDisabled ? 'disabled' : ''}`}
                      style={isResendDisabled ? { fontSize: "12px", cursor: "not-allowed", color: "#A0AEC0" } : {}}
                      onClick={!isResendDisabled ? handleResendCode : undefined}
                    >
                      {t("loginPage.resendCode")}
                    </p>
                  </div>
                </form>
              </>
            )}

            <div className="text-base mt-5 text-center">
              <a href="#" className="text-center font-semibold text-[#625B5B]">
                ©2025 MetroSystems | Privacy Policy
              </a>
            </div>
          </div>

          <div className="version absolute bottom-1 right-1">
            <p className="text-[#656668]" ></p>{" "}
            Version202511.1.7
          </div>
        </div>
      </div>
      {openAlert && <Alert typeAlert={typeAlert} description={alertMessage} />}
    </div>
  );
};

export default LoginPage;
