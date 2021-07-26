import React, { useState } from "react";
import { Nav, NavItem } from "reactstrap";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
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
  const [signUpModal, setSignUpModal] = useState(false);
  const [logInModal, setLogInModal] = useState(false);

  function toggleSignUp(): void {
    setSignUpModal(!signUpModal);
  }

  function toggleLogIn(): void {
    setLogInModal(!logInModal);
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
    toggleSignUp();
    evt.preventDefault();
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'evt' implicitly has an 'any' type.
  function handleLogIn(evt): void {
    logIn();
    toggleLogIn();
    evt.preventDefault();
  }

  return (
    <div className="Header">
      <span className={tips}>{response}</span>
      <Nav className="ml-auto" navbar>
        <NavItem>
          {!isLogIn ? (
            <div>
              <Button
                variant="contained"
                color="secondary"
                onClick={toggleLogIn}>
                LogIn
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button
                variant="contained"
                color="secondary"
                onClick={toggleSignUp}>
                SignUp
              </Button>
            </div>
          ) : (
            <div>
              <div className="navbar-text mr-3">{username}</div>
              <Button variant="contained" color="secondary" onClick={logOut}>
                LogOut
              </Button>
            </div>
          )}
        </NavItem>
      </Nav>
      <Dialog open={signUpModal}>
        <DialogTitle>
          SignUp
          <IconButton onClick={toggleSignUp}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div>
            username&nbsp;&nbsp;
            <input
              type="text"
              onChange={(event) => setUsername(event.target.value)}
            />
            <br />
            <br />
            password&nbsp;&nbsp;
            <input
              type="password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <br />
            <br />
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleSignUp}>
            SignUp
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={logInModal}>
        <DialogTitle>
          LogIn
          <IconButton onClick={toggleLogIn}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div>
            username&nbsp;&nbsp;
            <input
              type="text"
              onChange={(event) => setUsername(event.target.value)}
            />
            <br />
            <br />
            password&nbsp;&nbsp;
            <input
              type="password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <br />
            <br />
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleLogIn}>
            LogIn
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Header;
