import React from "react";
import "../style/popUp.css";

export default function Index({ children, isShow }) {
  return <>{isShow ? <div className="pop-up">{children}</div> : <></>}</>;
}
