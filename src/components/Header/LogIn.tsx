import { Modal } from "bootstrap";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/hooks/useAuth";

export interface LogInReqBody {
  email: string;
  password: string;
}

export const LogIn = () => {
  const auth = useAuth();
  const logInModalRef = useRef<any>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors
  } = useForm<LogInReqBody>();

  function showLogInModal() {
    const modalEle = logInModalRef?.current;
    const logInModal = new Modal(modalEle);
    logInModal.show();
  }

  function hideLogInModal() {
    const modalEle = logInModalRef?.current;
    const logInModal = Modal.getInstance(modalEle);
    logInModal?.hide();
    if (errors.email || errors.password) {
      clearErrors();
    }
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'evt' implicitly has an 'any' type.
  function handleLogIn(reqBody: LogInReqBody, evt): void {
    auth.signin(reqBody);
    hideLogInModal();
    evt.preventDefault();
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={showLogInModal}
      >
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
                onClick={hideLogInModal}
              />
            </div>
            <div className="modal-body">
              <form>
                <label htmlFor="emailForLogin">email</label>
                <input
                  type="email"
                  id="emailForLogin"
                  className="form-control"
                  {...register("email", { required: true })}
                />
                {errors.email && <p>Email is required!</p>}
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
                onClick={handleSubmit(handleLogIn)}
              >
                LogIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
