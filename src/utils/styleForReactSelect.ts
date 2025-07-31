import React from "react";
import { InputProps, StylesConfig, components } from 'react-select';



const customStyles: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    background: '#fff',
    borderColor: '#e5e7eb',
    minHeight: '32px',
    height: '42px',
    // boxShadow: state.isFocused ? '' : '',
    borderRadius: '6px',
    '& input': {

      boxShadow: state.isFocused ? 'none!important' : provided.boxShadow,
    },
    // boxShadow: "none", // เอา shadow ออก
    // input border ไม่มี
    // borderColor: state.isFocused ? "#ff5733" : "#ccc", // เปลี่ยนสีเส้นขอบเมื่อโฟกัส
    // boxShadow: state.isFocused ? "0 0 5px rgba(255, 87, 51, 0.5)" : "none",


  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: '32px',
    padding: '0 6px',
  }),

  input: (provided) => ({
    ...provided,
    outline: "none", // ป้องกันเส้นขอบ default
  }),

  indicatorSeparator: (state) => ({
    display: 'none',
  }),

  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: '32px',
  }),
};

export default customStyles;