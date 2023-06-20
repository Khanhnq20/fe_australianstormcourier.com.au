import React from "react";
import "../style/preventDriver.css";
import { CgSandClock } from "react-icons/cg";

export default function Index() {
  return (
    <div className="prevent">
      <div>
        <div className="txt-center">
          <CgSandClock className="clock-logo"></CgSandClock>
        </div>
        <h2 className="txt-center">Thanks for your participation!</h2>
        <h5 className="mes-title txt-center">
          Please wait in few hour for admin's inspection.
        </h5>
      </div>
    </div>
  );
}
