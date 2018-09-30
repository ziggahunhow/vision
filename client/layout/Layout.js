import React from "react";
import "../style/index.scss";
// import { connect } from "react-redux";

const Layout = ({ children }) => {
  return (
    <div>
      {/* <Nav /> */}
      {children}
      {/* <Footer /> */}
    </div>
  );
};

// const mapStateToProps = state => {
// };

// export default connect(mapStateToProps)(Layout);
export default Layout;
