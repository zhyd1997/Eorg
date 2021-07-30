import React, { useRef } from "react";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
import { baseUrl } from "../baseUrl";

interface SignUpReqBody {
  username: string;
  password: string;
}

type SignUpProps = {
  setResponse: any;
  setTips: any;
};

export const SignUp = ({ setResponse, setTips }: SignUpProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
  } = useForm();

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
    if (errors.username || errors.password) {
      clearErrors();
    }
  }

  function signUp(reqBody: SignUpReqBody): void {
    fetch(`${baseUrl}users/signup`, {
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
        } else {
          setResponse(result.err.message);
          setTips("tips error");
          setTimeout(() => setTips("tips-fade"), 3000);
        }
      });
    });
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'evt' implicitly has an 'any' type.
  function handleSignUp(reqBody: SignUpReqBody, evt): void {
    signUp(reqBody);
    hideSignUpModal();
    evt.preventDefault();
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={showSignUpModal}>
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
                onClick={hideSignUpModal}></button>
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
                onClick={handleSubmit(handleSignUp)}>
                SignUp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
