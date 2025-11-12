import React from 'react';
import '../../../styles/iconfont.css'
import "../index.css"; // 引入 CSS 文件

interface SwitchProps {
    if?: boolean;
    value?: boolean;
    loading?: boolean;
    size?: "small" | "default";
    onChange?: (value: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ if:condition = true,value, onChange, size, loading }) => {
  if (condition !== true) return null;
  return (
    <span
      onClick={() => onChange(!value)}
      className={`swagger-fields-generator_switch ${value ? " on" : ""} ${size ? " " + size : ""}
      }`}
    >
      <div className={`switch-handle ${loading ? "iconfont icon-loading" : ""}`} />
    </span>
  );
};

export default Switch;
