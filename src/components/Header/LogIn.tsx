import React, { useRef } from "react";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
import { baseUrl } from "@/baseUrl";

export interface LogInReqBody {
  username: string;
  password: string;
}

type LogInProps = {
  setResponse: any;
  setTips: any;
  storeCollector: any;
};

export const LogIn = ({ setResponse, setTips, storeCollector }: LogInProps) => {
  const logInModalRef = useRef<any>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
  } = useForm();

  function showLogInModal() {
    const modalEle = logInModalRef?.current;
    const logInModal = new Modal(modalEle);
    logInModal.show();
  }

  function hideLogInModal() {
    const modalEle = logInModalRef?.current;
    const logInModal = Modal.getInstance(modalEle);
    logInModal?.hide();
    if (errors.username || errors.password) {
      clearErrors();
    }
  }

  function logIn(reqBody: LogInReqBody): void {
    fetch(`${baseUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
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

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'evt' implicitly has an 'any' type.
  function handleLogIn(reqBody: LogInReqBody, evt): void {
    logIn(reqBody);
    hideLogInModal();
    evt.preventDefault();
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={showLogInModal}>
        LogIn
      </button>
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
              <form>
                <label htmlFor="usernameForLogin">username</label>
                <input
                  type="text"
                  id="usernameForLogin"
                  className="form-control"
                  {...register("username", { required: true })}
                />
                {errors.username && <p>Username is required!</p>}
                <label htmlFor="passwordForLogin">password</label>
                <input
                  type="password"
                  id="passwordForLogin"
                  className="form-control"
                  {...register("password", { required: true })}
                />
                {errors.password && <p>Password is required!</p>}
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit(handleLogIn)}>
                LogIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
