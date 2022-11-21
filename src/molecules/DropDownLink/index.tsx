import React, { useState } from "react";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";

type DropDownLinkProps = {
  label?: string;
  children?: React.ReactNode;
  className?: string;
};

const DropDownLink: React.FC<DropDownLinkProps> = ({
  label = "",
  children,
  className = "",
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="inline-flex flex-col justify-start items-start relative ">
      <button
        className={`${className} text-white flex items-center space-x-1`}
        onClick={() => setShow(!show)}
      >
        <span>{label}</span>
        <span>
          {!show ? (
            <BiDownArrow className="text-white text-xs" />
          ) : (
            <BiUpArrow className="text-white text-xs" />
          )}
        </span>
      </button>

      {show && (
        <div className="absolute top-full translate-y-2 z-20 shadow-md left-0 rigth-0 bg-white text-gray-700 rounded-md overflow-hidden min-w-[350px] p-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default DropDownLink;
