import React, { useState, useEffect } from 'react';
import { RootState } from '../../../store';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from "react-redux";
import Select from 'react-select';
interface ModalPlaceOnHoldProps {
    setOpenPlaceOnHoldModal: (value: boolean) => void;
}

const ModalPlaceOnHold: React.FC<ModalPlaceOnHoldProps> = ({ setOpenPlaceOnHoldModal }) => {

    const handleClose = () => {
        setOpenPlaceOnHoldModal(false);
    };
    const { t, i18n } = useTranslation();
    const language = useSelector((state: RootState) => state.language.language);
    const [valueRadio, setValueRadio] = useState('Indefinitely');
    console.log("🚀 ~ valueRadio:", valueRadio)
    const [isVisible, setIsVisible] = useState(false);
    // const [currentPassword, setCurrentPassword] = useState('');
    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => { console.log('xxxx', valueRadio) }, [valueRadio]);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={handleClose}></div>
            <div
                className={`bg-white rounded-lg transform transition-transform duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                    }`}
            >
                <div className=" mx-auto bg-white rounded-md">
                    <button onClick={handleClose} className="mt-4 absolute top-[-5px] right-[15px]">  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg></button>

                    <div className='w-[600px]'>
                        <div className='p-6 border-b border-1'>
                            <h2 className="text-xl font-semibold text-gray-700 text-left mb-1">Place on Hold</h2>
                            <p className='font-thin text-sm'>Please select how long to place this item on hold from .</p>

                        </div>

                        <form >
                            <div className="mb-4 pt-6 px-6">
                                <div className="">
                                    {/* Radio Option 1 */}
                                    <label className="flex cursor-pointer ">
                                        <input
                                            type="radio"
                                            name="radio"
                                            className="hidden peer"
                                            value='Indefinitely'
                                            checked={valueRadio === 'Indefinitely'}
                                            onChange={(e) => setValueRadio(e.target.value)}
                                        />
                                        <div className="mr-3 w-6 h-6 border-2 border-gray-300 rounded-xl flex items-start peer-checked:border-blue-500 peer-checked:bg-blue-500 p-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4" style={{ color: '#fff' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-normal">Indefinitely</p>
                                            <p className='text-gray-400 text-xs'>No actions will be taken by any policy until you manually remove the item from hold.</p>
                                        </div>
                                    </label>
                                    <label className="flex cursor-pointer pt-6">
                                        <input
                                            type="radio"
                                            name="radio"
                                            className="hidden peer"
                                            value='period'
                                            checked={valueRadio === 'period'}
                                            onChange={(e) => setValueRadio(e.target.value)}
                                        />
                                        <div className="mr-3 w-6 h-6 border-2 border-gray-300 rounded-xl flex items-start peer-checked:border-blue-500 peer-checked:bg-blue-500 p-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4" style={{ color: '#fff' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-normal">For a set period of time</p>
                                            <p className='text-gray-400 text-xs'>Remove the hold automatically after a set period of time.</p>
                                            {valueRadio === 'period' && <div className='pt-4 flex'>
                                                <input type='text' className='border border-1 border-[gainsboro] rounded-md w-[50px] h-[38px] mr-3' />
                                                <Select
                                                    className="text-sm h-[42px] rounded-md"
                                                    defaultValue={{ value: 'All Status', label: 'Day' }}
                                                    options={[
                                                        { value: 'All Status', label: 'Day' },
                                                        { value: 'active', label: 'Active' },
                                                    ]} />
                                            </div>}

                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end px-6 pb-6 border-t border-1 pt-6">
                                <button
                                    type="button"
                                    className="text-black px-4 py-2 text-sm border border-1 rounded-md mr-2 w-24"
                                    onClick={handleClose}
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#3758F9] text-white text-sm px-4 py-2 rounded-md  w-24 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default ModalPlaceOnHold;