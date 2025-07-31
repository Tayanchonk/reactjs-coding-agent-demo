import React, { useState } from "react";
import {
  MultipleSelect,
  InputText,
  MutipleSelectOption,
} from "../../../components/CustomComponent";

const TestPages = () => {
  const [value, setValue] = useState([
    { label: "Option 1", selected: false, value: "1" },
    { label: "Option 2", selected: false },
    { label: "Option 3", selected: false },
    { label: "Option 4", selected: false },
    { label: "Option 5", selected: false },
    { label: "Option 6", selected: false },
  ]);
  const [selectedValues, setSelectedValues] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  const onItemChange = (label: string) => {
    const newValue = value.map((item) =>
      item.label === label ? { ...item, selected: !item.selected } : item
    );
    setValue(newValue);
    const selected = newValue.filter((item) => item.selected);
    setSelectedValues(selected);
  };

  const filterValue = value.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="h-[100vh] flex flex-col items-center justify-center">
      <h1>TestPages</h1>
      <MultipleSelect
        onSearch={(e) => setQuery(e.target.value)}
        search
        value={selectedValues}
        onClose={() => setQuery("")}
      >
        {filterValue.map((item) => (
          <MutipleSelectOption
            key={item.label}
            selected={item.selected}
            onChange={() => onItemChange(item.label)}
          >
            <p className="text-sm">{item.label}</p>
          </MutipleSelectOption>
        ))}
      </MultipleSelect>
    </div>
  );
};

export default TestPages;
