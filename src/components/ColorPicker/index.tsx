import React, { useState, useEffect } from 'react';
import "./style.css";

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  hideInput?: boolean;
  squre?: boolean;
  disabled?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value = '#000000', onChange,hideInput,squre,disabled }) => {
  const [color, setColor] = useState<string>(value);

  useEffect(() => {
    setColor(value);
  }, [value]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColor(newColor);
    if (onChange) {
      onChange(newColor);
    }
  };

  return (
    <div className="flex py-2">
      <div className="color-pick" style={squre ? {borderRadius: 4,width:30,height:30,border:'1px solid black'} : {}}>
        <input
          type="color"
          disabled={disabled}
          name="mainMenuBgColor"
          value={color}
          onChange={handleColorChange}
          className="w-[45px] h-[45px] rounded-full"
        />
      </div>
      {hideInput ? null :  <input
        type="text"
        value={color}
        readOnly
        className="border w-[60%] ml-2 rounded-md p-1"
      />}
     
    </div>
  );
};

export default ColorPicker;