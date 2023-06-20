import React from "react";
import {
  AiFillLeftCircle,
  AiOutlineIdcard,
  AiOutlineHistory,
} from "react-icons/ai";
import { User } from "../../../pages";
import { Breadcrumbs } from "./breadscrumb";
import { NavLink } from "react-router-dom";
import { BiPackage } from "react-icons/bi";
import { TbPackages } from "react-icons/tb";

export function UserSideBar({ children }) {
  const [toggle, setToggle] = React.useState(true);
  return (
    <div>
      <div className="h-root">
        <div>
          <div className="h-form">
            <span
              onClick={() => {
                setToggle(true);
              }}
              className={toggle ? "" : "hero"}
            ></span>
            <span className={toggle ? "sbar-root hide" : "sbar-root"}>
              <div>
                <div className="sbar-header">
                  <div className="sbar-title">Menu</div>
                  <AiFillLeftCircle
                    className={toggle ? "sbar-toggle right" : "sbar-toggle"}
                    onClick={() => {
                      setToggle((e) => !e);
                    }}
                  ></AiFillLeftCircle>
                </div>
                <div>
                  <div className={toggle ? "form-label" : ""}>
                    {/* 1. Order */}
                    <NavLink
                      className={({ isActive }) => {
                        return isActive ? "sbar-link active" : "sbar-link";
                      }}
                      to={"order/me"}
                    >
                      <div className="sbar-icon-frame">
                        <TbPackages className="sbar-icon"></TbPackages>
                      </div>
                      <p className={toggle ? "sbar-txt txt-hide" : "sbar-txt"}>
                        My Order
                      </p>
                    </NavLink>
                    {/* 2. Create new order */}
                    <NavLink
                      className={({ isActive }) => {
                        return isActive ? "sbar-link active" : "sbar-link";
                      }}
                      to={"/user/order/create"}
                    >
                      <div className="sbar-icon-frame">
                        <BiPackage className="sbar-icon"></BiPackage>
                      </div>
                      <p className={toggle ? "sbar-txt txt-hide" : "sbar-txt"}>
                        Create new Order
                      </p>
                    </NavLink>
                    {/* 3. History */}
                    <NavLink
                      className={({ isActive }) => {
                        return isActive ? "sbar-link active" : "sbar-link";
                      }}
                      to={"/user/history"}
                    >
                      <div className="sbar-icon-frame">
                        <AiOutlineHistory className="sbar-icon"></AiOutlineHistory>
                      </div>
                      <p className={toggle ? "sbar-txt txt-hide" : "sbar-txt"}>
                        History
                      </p>
                    </NavLink>
                    {/* 4. User information */}
                    <NavLink
                      className={({ isActive }) => {
                        return isActive ? "sbar-link active" : "sbar-link";
                      }}
                      to={"/user/info"}
                    >
                      <div className="sbar-icon-frame">
                        <AiOutlineIdcard className="sbar-icon"></AiOutlineIdcard>
                      </div>
                      <p className={toggle ? "sbar-txt txt-hide" : "sbar-txt"}>
                        Information
                      </p>
                    </NavLink>
                  </div>
                </div>
              </div>
            </span>
            <span className="h-ctn">
              <div className=""></div>
              <div className="h-ctn-inner">
                <div className="h-header">
                  <Breadcrumbs></Breadcrumbs>
                </div>
                <div className="h-content-frame">
                  {children || <User></User>}
                </div>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
