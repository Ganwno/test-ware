import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import config from "../_configs/configs.json";
import { userActions, appActions } from "../_actions";
import { TopNavbar } from "../_components";
import { history } from "../_helpers";

function LoginPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const loggingIn = useSelector((state) => state.authentication.loggingIn);

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { username, password } = inputs;

  // Reset login status.
  useEffect(() => {
    dispatch(userActions.logout());
  }, [dispatch]);

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    setSubmitted(true);
    if (username && password) {
      // Get return url from location state or default to home page.
      const { from } = location.state || { from: { pathname: "/" } };
      dispatch(userActions.login(username, password, from));
    }
  }

  const goToGuestChallenge = () => {
    dispatch(appActions.setTrainingDataSet(config.DEFAULT_GUEST_CHALLENGE));
    history.push("/guest");
  };

  return (
    <>
      <TopNavbar />
      <div className="col-lg-8 offset-lg-3 verticalUpper">
        <h2 className="text-white">Login</h2>
        <br />
        <form name="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="text-white">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              className={
                "form-control" + (submitted && !username ? " is-invalid" : "")
              }
            />
            {submitted && !username && (
              <div className="invalid-feedback">Username is required</div>
            )}
          </div>
          <div className="form-group">
            <label className="text-white">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              className={
                "form-control" + (submitted && !password ? " is-invalid" : "")
              }
            />
            {submitted && !password && (
              <div className="invalid-feedback">Password is required</div>
            )}
          </div>
          <br />
          <div className="form-group">
            <button className="btn btn-primary">
              {loggingIn && (
                <span className="spinner-border spinner-border-sm mr-1"></span>
              )}
              Login
            </button>
            <Link to="/register" className="btn btn-link">
              Register
            </Link>
            <Link
              to="/guest"
              onClick={goToGuestChallenge}
              className="btn btn-link"
            >
              Try as Guest
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export { LoginPage };
