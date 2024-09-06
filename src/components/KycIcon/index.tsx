import React from "react";

// Dùng svg element trong nextjs

const KycIcon = ({ size, top }: any) => {
  return (
    <>
      <div
        className={`verified-icon flex items-center w-${size} h-${size}`}
        style={{ top: top, position: "relative" }}
      >
        <div className={`w-${size} h-${size} flex`}>
          <svg viewBox="0 0 30 30" className="w-full">
            <path
              d="M13.474 2.801a2 2 0 0 1 3.052 0l.963 1.136a2 2 0 0 0 2 .65l1.447-.353a2 2 0 0 1 2.469 1.794l.11 1.485a2 2 0 0 0 1.237 1.702l1.378.564a2 2 0 0 1 .943 2.903l-.783 1.266a2 2 0 0 0 0 2.104l.783 1.266a2 2 0 0 1-.943 2.903l-1.378.564a2 2 0 0 0-1.236 1.702l-.111 1.485a2 2 0 0 1-2.47 1.794l-1.446-.353a2 2 0 0 0-2 .65l-.963 1.136a2 2 0 0 1-3.052 0l-.963-1.136a2 2 0 0 0-2-.65l-1.447.353a2 2 0 0 1-2.469-1.794l-.11-1.485a2 2 0 0 0-1.237-1.702l-1.378-.564a2 2 0 0 1-.943-2.903l.783-1.266a2 2 0 0 0 0-2.104l-.783-1.266a2 2 0 0 1 .943-2.903l1.378-.564a2 2 0 0 0 1.236-1.702l.111-1.485a2 2 0 0 1 2.47-1.794l1.446.353a2 2 0 0 0 2-.65l.963-1.136Z"
              fill="#2081e2"
            />
            <path
              d="M13.5 17.625 10.875 15l-.875.875 3.5 3.5 7.5-7.5-.875-.875-6.625 6.625Z"
              fill="#fff"
              stroke="#fff"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default KycIcon;
