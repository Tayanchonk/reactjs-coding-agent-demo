import React, { useState, useEffect } from "react";
import HeaderAndFooter from "../Interface/InterfaceForm/BuilderAndBranding/HeaderAndFooter";
import MockImg from "../../../assets/images/mockimg.png";
import { Button, InputText, Toggle } from "../../../components/CustomComponent";
import HeaderIcon from "../../../assets/icons/page_header.png";
import TitleIcon from "../../../assets/icons/subheader.png";
import ThemeIcon from "../../../assets/icons/theme.png";
import ButtonIcon from "../../../assets/icons/buttons_alt.png";
import AuthenIcon from "../../../assets/icons/tv_signin.png";
import SubscriptionIcon from "../../../assets/icons/check_box.png";
import CssIcon from "../../../assets/icons/css.png";

const ConsentInterface = () => {
  // ------------- STATE -----------------
  const [openInterfaceAccordion, setOpenInterfaceAccordion] = useState(true);
  const [openScreenPersonalData, setOpenScreenPersonalData] = useState(false);
  const [openScreenConsentData, setOpenScreenConsentData] = useState(false);
  // ------------- FUNCTION -----------------
  const toggleInterfaceAccordion = () => {
    setOpenInterfaceAccordion(!openInterfaceAccordion);
  };

  const dataIcon = [
    {
      icon: HeaderIcon,
      text: "Header and Footer",
    },
    {
      icon: TitleIcon,
      text: "Title Page",
    },
    {
      icon: ThemeIcon,
      text: "Theme Settings",
    },
    {
      icon: ButtonIcon,
      text: "Button Settings",
    },
    {
      icon: AuthenIcon,
      text: "Authentication Screen",
    },
    {
      icon: SubscriptionIcon,
      text: "Subscription  Settings",
    },
    {
      icon: CssIcon,
      text: "Custom CSS",
    },
  ];
  return (
    <div className="bg-white flex">
      {openScreenPersonalData ? (
        <div className="w-4/12 py-5">
          {" "}
          <button 
            onClick={() => setOpenScreenPersonalData(false)}
            className="w-[20px] text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="size-6 h-[20px] w-[20px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
          personal
        </div>
      ) : openScreenConsentData ? (
        <div className="w-4/12 py-5">
        {" "}
        <button 
          onClick={() => setOpenScreenConsentData(false)}
          className="w-[20px] text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="size-6 h-[20px] w-[20px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
        consent
      </div>
      ): (
        <div className="w-4/12 py-5">
          <p className="text-[#3758F9] font-semibold px-4">Page</p>
          <div className="pt-3 pb-5 border-b">
            <div className="px-4">
              <Button
                className="flex rounded py-2 px-4 w-full border boder-[#3758F9]  hover:border-[#3758F9]"
                onClick={() => setOpenScreenPersonalData(true)}
              >
                <p className="w-11/12 m-auto text-left  pl-3 text-base font-semibold text-black hover:text-[#3758F9]">
                  Personal Data - ข้อมูลส่วนบุคคล
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#656668"
                  className="size-6 w-1/12 m-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </Button>
              <Button className="flex rounded py-2 px-4 w-full border boder-[#3758F9] mt-3 hover:border-[#3758F9]"
                onClick={() => setOpenScreenConsentData(true)}
              >
                <p className="w-11/12 m-auto text-base text-left pl-3 font-semibold text-black hover:text-[#3758F9] ">
                  Consent Data - ข้อมูลขอความยินยอม
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#656668"
                  className="size-6 w-1/12 m-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </Button>
            </div>
          </div>
          <div>
            <div id="accordion-collapse" data-accordion="collapse">
              <h2 id="accordion-collapse-heading-1">
                <button
                  type="button"
                  className=" flex items-center justify-between w-full px-5 py-3 font-base rtl:text-right font-semibold"
                  onClick={toggleInterfaceAccordion}
                  aria-expanded={openInterfaceAccordion}
                  aria-controls="accordion-collapse-body-1"
                >
                  <span>Interface Branding</span>
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 shrink-0 transition-transform ${
                      openInterfaceAccordion ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div
                id="accordion-collapse-body-1"
                className={`${openInterfaceAccordion ? "" : "hidden"}`}
                aria-labelledby="accordion-collapse-heading-1"
              >
                <div className="p-5 dark:border-gray-700 dark:bg-gray-900 flex flex-wrap">
                  {dataIcon.map((item, index) => {
                    return (
                      <div key={index} className="w-1/2 p-1.5 ">
                        <div className="border border-solid border-[#656668] p-3 rounded-md cursor-pointer hover:border-[#3758F9]">
                          <img src={item.icon} className="w-[26px] m-auto" />
                          <p className="text-center text-[#656668] text-base font-semibold">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-8/12">
        <img src={MockImg} />
      </div>
    </div>
  );
};
export default ConsentInterface;
