import React from 'react';

import "../index.css"; // 引入 CSS 文件

interface SwitchProps {
    value?: boolean;
    size?: "small" | "default";
    onChange?: (value: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ value, onChange, size }) => {
  return (
    <span
      onClick={() => onChange(!value)}
      className={`swagger-fields-generator_switch ${value ? " on" : ""} ${size ? " " + size : ""}
      }`}
    >
      <div className="switch-handle" />
    </span>
  );
};

export default Switch;