
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../../../components/CustomComponent';
import DirectLink from './DirectLink';
import IframeScrip from './IframeScrip';
import CustomAPI from './CustomAPI';
import Alert from '../../../../../../components/Alert';
import notification from '../../../../../../utils/notification';


interface IConsentInterface {
  consentInterface: any;
  setConsentInterface: (data: any) => void;
}


function index({ consentInterface, setConsentInterface }: IConsentInterface) {
  let { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = React.useState(0);
  const [isAlert, setIsAlert] = React.useState(false);

  const handleActiveTab = (index: number) => {
    setActiveTab(index);
  }



  // ฟังก์ชันสำหรับคัดลอกข้อความไปยังคลิปบอร์ด
  function handleCopy(id: string) {
    const el = document.getElementById(id);
    const text = el?.textContent?.trim() || '';

    if (!text) {
      alert('ไม่พบข้อความที่จะคัดลอก');
      return;
    }

    // ตรวจสอบก่อนว่า clipboard API ใช้ได้ไหม
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text)
        .then(() => {
          notification.success("Copy Success");
        })
        .catch(err => {
          console.error('Error copying text (clipboard):', err);
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // ป้องกัน scroll jump
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const success = document.execCommand('copy');
      if (success) {
        notification.success("Copy Success");
      } else {
        alert('เบราว์เซอร์ไม่อนุญาตให้คัดลอก');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      alert('ไม่สามารถคัดลอกข้อความได้');
    }

    document.body.removeChild(textarea);
  }








  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        event.preventDefault(); // ป้องกันการเปลี่ยนหน้า
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div ref={containerRef} className="p-4 bg-white">
      <div className="flex " style={{ borderBottom: "1px solid #E3E8EC" }}>
        <div className="pb-3 " >
          <h2 className="text-xl font-semibold ">{t('integrations.title')}</h2>
          <p className="text-base">
            {t('integrations.description')}
          </p>
        </div>

      </div>
      <div className="flex  mt-3 justify-between bg-[#fff] item-center pt-3 pb-3 pl-16 pr-16 border-1  rounded-md" style={{ border: "1px solid #E3E8EC" }}>
        <div >
          <Button onClick={
            () => handleActiveTab(0)
          }

            className={activeTab === 0 ? "bg-[#f5f7ff] text-base font-semibold" : ""}

          >

            <span className="text-base text-[#3758F9] ">{t('integrations.directLink')}</span>
          </Button>
        </div>
        <div>
          <Button onClick={
            () => handleActiveTab(1)
          }
            className={activeTab === 1 ? "bg-[#f5f7ff] text-base font-semibold" : ""}
          >
            <span className="text-base text-[#3758F9] ">{t('integrations.iframeScript')}</span>
          </Button>
        </div>
        <div> <Button onClick={
          () => handleActiveTab(2)
        }
          className={activeTab === 2 ? "bg-[#f5f7ff] text-base font-semibold" : ""}
        >
          <span className="text-base text-[#3758F9] ">{t('integrations.customAPI')}</span>
        </Button></div>
      </div>

      <div className="mt-3 " style={{borderTop:"1px solid #E3E8EC"}} >

        {activeTab === 0 && <DirectLink handleCopy={handleCopy} setConsentInterface={setConsentInterface} consentInterface={consentInterface} />}

        {activeTab === 1 && <IframeScrip handleCopy={handleCopy} setConsentInterface={setConsentInterface} consentInterface={consentInterface} />}

        {activeTab === 2 && <CustomAPI handleCopy={handleCopy} setConsentInterface={setConsentInterface} consentInterface={consentInterface} />}

      </div>


      {isAlert &&
        <Alert
          typeAlert={"success"}
          description={"Copy Success"}
        />
      }
    </div>

  )
}

export default index