import { FC } from 'react'

interface IconProps {
  icon: string;
  className?: string;
}

const Icon: FC<IconProps> = ({ icon, className }) => (
  <i className={`iconoir-${icon} ${className || ''}`}></i>
)

export default Icon