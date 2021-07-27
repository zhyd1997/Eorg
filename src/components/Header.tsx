import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
  const [response, setResponse] = useState("");
  const [tips, setTips] = useState("tips");
  const [signUpModal, setSignUpModal] = useState(false);
  const [logInModal, setLogInModal] = useState(false);

  const { register, handleSubmit } = useForm();

  function toggleSignUp(): void {
    setSignUpModal(!signUpModal);
  }

  function toggleLogIn(): void {
    setLogInModal(!logInModal);
  }

  function signUp(state: any): void {
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

  function logIn(state: any): void {
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
              username: result.username,
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
  function handleSignUp(state, evt): void {
    signUp(state);
    toggleSignUp();
    evt.preventDefault();
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'evt' implicitly has an 'any' type.
  function handleLogIn(state, evt): void {
    logIn(state);
    toggleLogIn();
    evt.preventDefault();
  }

  return (
    <div className="Header">
      <span className={tips}>{response}</span>
      {!isLogIn ? (
        <div>
          <Button variant="contained" color="secondary" onClick={toggleLogIn}>
            LogIn
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button variant="contained" color="secondary" onClick={toggleSignUp}>
            SignUp
          </Button>
        </div>
      ) : (
        <div>
          <span>{JSON.parse(localStorage.getItem("login")!).username}</span>
          <Button variant="contained" color="secondary" onClick={logOut}>
            LogOut
          </Button>
        </div>
      )}
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
            <input type="text" {...register("username", { required: true })} />
            <br />
            <br />
            password&nbsp;&nbsp;
            <input
              type="password"
              {...register("password", { required: true })}
            />
            <br />
            <br />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit(handleSignUp)}>
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
            <input type="text" {...register("username", { required: true })} />
            <br />
            <br />
            password&nbsp;&nbsp;
            <input
              type="password"
              {...register("password", { required: true })}
            />
            <br />
            <br />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit(handleLogIn)}>
            LogIn
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Header;
