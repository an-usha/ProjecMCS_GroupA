import React, { useState } from "react";

function BankXpLayout() {
  const [isHovered, setIsHovered] = useState(false);
  const bankxpUrl=process.env.REACT_APP_BANKXP_URL;

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <br />
      <h3>
        Navigate to &nbsp;
        <a
          // href="http://192.168.76.57:8080/banksmart-admin/"
          href={bankxpUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit BankXP website"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          BankXP
        </a> &nbsp;
        application
      </h3>
      {isHovered && <div>Click to visit the BankXP portal.</div>}
    </>
  );
}

export default BankXpLayout;
