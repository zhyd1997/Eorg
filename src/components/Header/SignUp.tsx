import { Modal } from "bootstrap";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/hooks/useAuth";

export interface SignUpReqBody {
  username: string;
  email: string;
  password: string;
}

export const SignUp = () => {
  const auth = useAuth();

  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors
  } = useForm<SignUpReqBody>();

  const signUpModalRef = useRef<any>(null);

  function showSignUpModal() {
    const modalEle = signUpModalRef?.current;
    const signUpModal = new Modal(modalEle);
    signUpModal.show();
  }

  function hideSignUpModal() {
    const modalEle = signUpModalRef?.current;
    const signUpModal = Modal.getInstance(modalEle);
    signUpModal?.hide();
    if (errors.username || errors.email || errors.password) {
      clearErrors();
    }
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'evt' implicitly has an 'any' type.
  function handleSignUp(reqBody: SignUpReqBody, evt): void {
    auth.signup(reqBody);
    hideSignUpModal();
    evt.preventDefault();
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={showSignUpModal}
      >
        SignUp
      </button>
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
                onClick={hideSignUpModal}
              />
            </div>
            <div className="modal-body">
              <form>
                <label htmlFor="usernameForSignUp">username</label>
                <input
                  type="text"
                  id="usernameForSignUp"
                  className="form-control"
                  {...register("username", { required: true })}
                />
                {errors.username && <p>Username is required!</p>}
                <label htmlFor="emailForSignUp">email</label>
                <input
                  type="email"
                  id="emailForSignUp"
                  className="form-control"
                  {...register("email", { required: true })}
                />
                {errors.email && <p>Email is required!</p>}
                <label htmlFor="passwordForSignUp">password</label>
                <input
                  type="password"
                  id="passwordForSignUp"
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
                onClick={handleSubmit(handleSignUp)}
              >
                SignUp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
