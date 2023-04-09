import { FC } from "react";

interface IconProps {
  icon: string;
}

const Icon: FC<IconProps> = ({ icon }) => (
  <span className={icon}></span>
)

export default Icon