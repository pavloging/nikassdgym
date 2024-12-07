import React from "react";
import "./CustomCheckbox.css";

interface CustomCheckboxProps {
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode; // Это позволит передавать любой контент, включая текст и ссылки
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ isChecked, setIsChecked, children }) => {
  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className="custom-checkbox">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className="custom-checkbox__input"
      />
      <span className="custom-checkbox__box"></span>
      <span className="custom-checkbox__text">{children}</span>
    </label>
  );
};

export default CustomCheckbox;
