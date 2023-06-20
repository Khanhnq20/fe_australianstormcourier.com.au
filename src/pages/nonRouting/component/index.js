import React from "react";
import { ThreeDots } from "react-loader-spinner";
import { Container } from "react-bootstrap";
import { MdOutlineFrontHand } from "react-icons/md";
import "../style/nonRouting.css";

export default function Index() {
  return (
    <Container className="p-success-root">
      <div className="p-stop-icon-form">
        <MdOutlineFrontHand className="p-success-icon"></MdOutlineFrontHand>
      </div>
      <div>
        <h2 className="txt-center">Stop Your Action !</h2>
        <p className="p-txt-grey txt-center">
          You don't have permission to access this page
        </p>
        <div className="threedots-stop">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="var(--clr-txt-error)"
            ariaLabel="loading"
            wrapperStyle
          />
        </div>
      </div>
    </Container>
  );
}
