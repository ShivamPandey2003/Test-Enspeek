import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "../../utils";
import type React from "react";

interface LoaderSpinnerProp {
    className?: string;
}

const LoaderSpinner:React.FC<LoaderSpinnerProp> = ({className}) => {
  return (
    <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-[999]'>
        <AiOutlineLoading3Quarters size={34} className={cn('animate-spin text-action', className)} />
    </div>
  )
}

export default LoaderSpinner