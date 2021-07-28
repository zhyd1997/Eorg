import React, { useState, useRef } from "react";
import { Modal } from "bootstrap";
import { baseUrl } from "./baseUrl";

type HeaderProps = {
  storeCollector: () => void;
  isLogIn: boolean;
};

const Header = ({ storeCollector, isLogIn }: HeaderProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [tips, setTips] = useState("tips");

  const signUpModalRef = useRef<any>(null);
  const logInModalRef = useRef<any>(null);

  function showSignUpModal() {
    const modalEle = signUpModalRef?.current;
    const signUpModal = new Modal(modalEle);
    signUpModal.show();
  }

  function hideSignUpModal() {
    const modalEle = signUpModalRef?.current;
    const signUpModal = Modal.getInstance(modalEle);
    signUpModal?.hide();
  }

  function showLogInModal() {
    const modalEle = logInModalRef?.current;
    const logInModal = new Modal(modalEle);
    logInModal.show();
  }

  function hideLogInModal() {
    const modalEle = logInModalRef?.current;
    const logInModal = Modal.getInstance(modalEle);
    logInModal?.hide();
  }

  function signUp(): void {
    const state = {
      username,
      password,
    };
    fetch(`${baseUrl}users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    }).then((res) => {
      res.json().then((result) => {
        if (result.success === true) {
          setResponse(result.status);
          setTips("tips success");
          setTimeout(() => setTips("tips-fade"), 3000);
        } else {
          setResponse(result.err.message);
          setTips("tips error");
          setTimeout(() => setTips("tips-fade"), 3000);
        }
      });
    });
  }

  function logIn(): void {
    const state = {
      username,
      password,
    };
    fetch(`${baseUrl}users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    }).then((res) => {
      res.json().then((result) => {
        if (result.success === true) {
          setResponse(result.status);
          setTips("tips success");
          setTimeout(() => setTips("tips-fade"), 3000);
          localStorage.setItem(
            "login",
            JSON.stringify({
              login: true,
              token: result.token,
            })
          );
          storeCollector();
        } else {
          setResponse(result.err.message);
          setTips("tips error");
          setTimeout(() => setTips("tips-fade"), 3000);
        }
      });
    });
  }

  function logOut(): void {
    fetch(`${baseUrl}users/logout`, {
      method: "GET",
    }).then(() => {
      localStorage.removeItem("login");
      storeCollector();
      setResponse("Logout Successful!");
      setTips("tips success");
      setTimeout(() => setTips("tips-fade"), 3000);
    });
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'evt' implicitly has an 'any' type.
  function handleSignUp(evt): void {
    signUp();
    hideSignUpModal();
    evt.preventDefault();
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'evt' implicitly has an 'any' type.
  function handleLogIn(evt): void {
    logIn();
    hideLogInModal();
    evt.preventDefault();
  }

  return (
    <div className="Header">
      <span className={tips}>{response}</span>
      {!isLogIn ? (
        <div>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={showLogInModal}>
            LogIn
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={showSignUpModal}>
            SignUp
          </button>
        </div>
      ) : (
        <div>
          <span>{username}</span>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={logOut}>
            LogOut
          </button>
        </div>
      )}
      <div className="modal fade" tabIndex={-1} ref={signUpModalRef}>
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">SignUp</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={hideSignUpModal}></button>
            </div>
            <div className="modal-body">
              <div>
                username&nbsp;&nbsp;
                <input
                  type="text"
                  className="form-control"
                  onChange={(event) => setUsername(event.target.value)}
                />
                password&nbsp;&nbsp;
                <input
                  type="password"
                  className="form-control"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSignUp}>
                SignUp
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" tabIndex={-1} ref={logInModalRef}>
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">LogIn</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={hideLogInModal}></button>
            </div>
            <div className="modal-body">
              <div>
                username&nbsp;&nbsp;
                <input
                  type="text"
                  className="form-control"
                  onChange={(event) => setUsername(event.target.value)}
                />
                password&nbsp;&nbsp;
                <input
                  type="password"
                  className="form-control"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleLogIn}>
                LogIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
