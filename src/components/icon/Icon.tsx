import { FC } from "react";

interface IconProps {
  icon: string;
  className?: string;
}

const Icon: FC<IconProps> = ({ icon, className }) => (
  <span className={`${icon} ${className || ''}`}></span>
)

export default Icon