import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Navbar,NavItem,NavLink } from "shards-react";
import { NavbarBrand } from "shards-react";

import NavbarSearch from "./NavbarSearch";
import NavbarNav from "./NavbarNav/NavbarNav";
import NavbarToggle from "./NavbarToggle";

const MainNavbar = ({ layout, stickyTop }) => {
  const classes = classNames(
    "main-navbar",
    "bg-white",
    "p-0",
    "m-0",
    "px-5",
    stickyTop && "sticky-top"
  );

  return (
    <div className={classes}>
      {/* <Container className="p-0"> */}
        <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
          <NavbarBrand
            // className="w-100 mr-0"
            href="/"
            style={{ lineHeight: "25px" }}
          >
            <div className="d-table m-auto">
              <img
                id="main-logo"
                className="d-inline-block align-top mr-1"
                style={{ maxWidth: "25px" }}
                src={require("../../../images/ceebios_logo.png")}
                alt="Shards Dashboard"
              />
                <span className="d-none d-md-inline ml-1">
                  CEEBIOS <span style={{color:"#fb2056"}}>POKEDEX</span>
                </span>
            </div>
          </NavbarBrand>
          <NavbarSearch />
          <NavbarBrand href="/explore">
            <div className="d-table m-auto">
                <span className="d-none d-md-inline ml-1">
                  Explore
                </span>
            </div>
            </NavbarBrand>
          <NavbarNav />
          {/* <NavbarToggle /> */}
        </Navbar>
      {/* </Container> */}
    </div>
  );
};

MainNavbar.propTypes = {
  /**
   * The layout type where the MainNavbar is used.
   */
  layout: PropTypes.string,
  /**
   * Whether the main navbar is sticky to the top, or not.
   */
  stickyTop: PropTypes.bool
};

MainNavbar.defaultProps = {
  stickyTop: true
};

export default MainNavbar;
