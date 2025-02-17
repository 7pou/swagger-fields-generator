interface Props {
    value?: boolean
    onChange?: (value: boolean) => void
}
import React from 'react';

import "../index.css"; // 引入 CSS 文件

interface SwitchProps {
    value?: boolean;
    onChange?: (value: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ value, onChange }) => {
  return (
    <span
      onClick={() => onChange(!value)}
      className={`swagger-fields-generator_switch ${value ? " on" : ""}`}
    >
      <div className="switch-handle" />
    </span>
  );
};

export default Switch;