import React, { useState, useEffect } from 'react';
import { RootState } from '../../../store';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from "react-redux";
import checkBox from "../../../assets/images/check_circle.png";
import cancelBox from "../../../assets/images/cancel.png";
import { validateNewPassword } from "../../../utils/validation";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLoading3Quarters } from "react-icons/ai";
import { loginUser, resetNewPassword } from '../../../services/authenticationService';
import { ProgressIndicator } from "../../../components/ProgressIndicator";
import { useConfirm, ModalType } from "../../../context/ConfirmContext";
import { InputText } from '../../CustomComponent';

interface ModalChangePasswordProps {
  setOpenChangePassword: (value: boolean) => void;
}

const ModalChangePassword: React.FC<ModalChangePasswordProps> = ({ setOpenChangePassword }) => {
  const confirm = useConfirm();
  const handleClose = () => {
    setOpenChangePassword(false);
  };
  const { t, i18n } = useTranslation();
  const language = useSelector((state: RootState) => state.language.language);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCurrentPasswordError, setIsCurrentPasswordError] = useState(false);
  const [isNewPasswordError, setIsNewPasswordError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [validateResetPassword, setValidateResetPassword] = useState({
    haslength: false,
    hasUpperLowerCase: false,
    hasNumber: false,
    hasSpecialCharacter: false,
  });
  const [isloading, setIsloading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [newPasswordError, setNewPasswordError] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleShowCurrentpassword = () => {
    setShowCurrentPassword((prevState: any) => !prevState);
  };
  const toggleShowNewPassword = () => {
    setShowNewPassword((prevState: any) => !prevState);
  };
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prevState: any) => !prevState);
  };

  const handleResetPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    let isValid = true;
    setIsloading(true);
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const email = user.email
    const countTrueValues = Object.values(validateResetPassword).filter(value => value === true).length;

    if (countTrueValues !== 4) {
      setNewPasswordError("");
      isValid = false;
    } else {
      setNewPasswordError("");
    }

    if (newPassword !== confirmPassword) {
      isValid = false;
      setIsNewPasswordError(true);
      setNewPasswordError(t("loginPage.passwordMatch"));
    } else {
      setNewPasswordError("");
    }

    try {
      await loginUser(email, currentPassword);
    } catch (error) {
      isValid = false;
      setIsCurrentPasswordError(true);
      setNewPasswordError(t("changePassword.currentPasswordMatch"));
    }

    setIsloading(false);
    if (isValid) {
      setOpenChangePassword(false);
      confirm({
        modalType: ModalType.Save,
        onConfirm: async () => {
          await resetNewPassword(newPassword);
        },
        successMessage: t("changePassword.success"),
        errorMessage: t("changePassword.error")
      });
    }
  };

  useEffect(() => {
    setIsNewPasswordError(false);
    setValidateResetPassword(validateNewPassword(newPassword));
  }, [newPassword]);

  useEffect(() => {
    setIsCurrentPasswordError(false);
  }, [currentPassword]);


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={handleClose}></div>
      <div
        className={`bg-white rounded-lg transform transition-transform duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
      >
        <div className=" mx-auto bg-white rounded-md">
          <button
            className=" text-right flex justify-end absolute mt-[10px] w-[30px] right-[22px] top-[15px] text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg"
            onClick={handleClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 h-[30px] w-[30px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          {/* <button onClick={handleClose} className="mt-4 absolute top-[-5px] right-[15px]">  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg></button> */}

          <div className='w-[600px]'>
            <div className='p-6 border-b border-1'>
              <h2 className="text-xl font-semibold text-gray-700 text-left mb-1">{t('changePassword.changePassword')}</h2>
              <p className='font-sm'>{t('changePassword.description')}</p>

            </div>

            <form onSubmit={handleResetPassword}>
              {/* Current Password */}
              <div className="mb-4 pt-6 px-6">
                <label htmlFor="current-password" className="block text-sm font-medium"><span className='text-red-500'>* </span>{t('changePassword.currentpassword')}</label>
                <div className="relative w-full mt-2">
                  <InputText
                    id="current-password"
                    type={showCurrentPassword ? "password" : "text"}
                    value={currentPassword}
                    disabled={isloading}
                    className=""
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={t("changePassword.placeholderCurrentPassword")}
                    isError={isCurrentPasswordError}
                  />
                </div>
              </div>
              {/* New Password */}
              <div className="mb-4 px-6">
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-600"><span className='text-red-500'>* </span>
                  {t('changePassword.newpassword')}
                </label>
                <div className="relative w-full mt-2">
                  <InputText
                    id="new-password"
                    type={showNewPassword ? "password" : "text"}
                    value={newPassword}
                    disabled={isloading}
                    className=""
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t("changePassword.placeholderNewPassword")}
                    isError={isNewPasswordError}
                  />
                </div>
              </div>
              {/* Confirm Password */}
              <div className="mb-4 px-6">
                <label htmlFor="confirm-password" className="block text-sm font-medium"><span className='text-red-500'>* </span>{t('changePassword.confirmpassword')}</label>
                <div className="relative w-full mt-2">
                  <InputText
                    id="new-password"
                    type={showConfirmPassword ? "password" : "text"}
                    value={confirmPassword}
                    disabled={isloading}
                    className=""
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("changePassword.placeholderConfirmPassword")}
                  />
                </div>
              </div>
              {/* Strength Meter */}
              <div className="mb-4 px-6">

                <ProgressIndicator
                  progress={
                    Object.values(validateResetPassword).filter(
                      (value) => value === true
                    ).length
                  }
                />
                {/* <div className="h-2 w-full rounded-md bg-gray-300">
                  <div className={`h-full ${getStrengthColor()} rounded-md transition-all`} style={{ width: `${(strength / 4) * 100}%` }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {t('changePassword.strength')}: {['Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength]}
                </p> */}
              </div>
              <div className="mb-4 px-8 pb-3 pt-1">
                <p className="text-sm/6 flex font-semibold text-[#625B5B]">
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
                  <span>{t('changePassword.condition1')}</span>
                </p>
                <p className="text-sm/6 flex font-semibold text-[#625B5B]">
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
                    {t('changePassword.condition2')}
                  </span>
                </p>
                <p className="text-sm/6 flex font-semibold text-[#625B5B]">
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
                  <span>{t('changePassword.condition3')}</span>
                </p>
                <p className="text-sm/6 flex font-semibold text-[#625B5B]">
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
                  <span>{t('changePassword.condition4')}</span>
                </p>
                {newPasswordError && (
                  <p className="text-red-500 text-sm pt-2">{newPasswordError}</p>
                )}
              </div>
              <div className="flex justify-end px-6 pb-6 border-t border-1 pt-6">
                <button
                  type="button"
                  className="text-black px-4 py-2 text-sm border border-1 rounded-md mr-2"
                  onClick={handleClose}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isloading}
                  className="bg-[#3758F9] text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {t("applyChanges")}
                </button>
              </div>
            </form>
          </div>


        </div>
      </div>
    </div>
  );
};

export default ModalChangePassword;