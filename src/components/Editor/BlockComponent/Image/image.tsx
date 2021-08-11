import React from "react";
import { useForm } from "react-hook-form";

import { baseUrl } from "@/baseUrl";
import { useAuth } from "@/hooks/useAuth";

type ImageProps = {
  blockKey: string;
  update: (name: string) => void;
  save: (name?: string) => void;
};

const Image = ({
  blockKey, update, save
}: ImageProps) => {
  const { register, handleSubmit } = useForm();
  let image: File;
  const auth = useAuth();
  // @ts-ignore
  function onSubmit(data, e) {
    e.preventDefault();
    const TOKEN = `Bearer ${auth.token.token}`;
    const formData = new FormData();
    formData.append("test", data.test[0]);
    formData.append("blockKey", blockKey);
    fetch(`${baseUrl}/api/v1/figures/upload`, {
      method: "POST",
      headers: {
        // There is no need to assign a header:
        // 'Content-Type': 'multipart/form-data',
        // The browser substitutes its own.
        Authorization: TOKEN
      },
      body: formData
    }).then(() => update(image.name));
  }

  function handleClick() {
    save(image.name);
  }

  return (
    <form className="img-form" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="fileElem">
        <input
          type="file"
          id="fileElem"
          accept="image/png, image/jpeg"
          className="visually-hidden"
          {...register("test")}
        />
      </label>
      <br />
      <button type="submit" className="TeXEditor-saveButton">
        Upload
      </button>
      <button
        type="button"
        className="TeXEditor-removeButton"
        onClick={handleClick}
      >
        Cancel
      </button>
    </form>
  );
};

export default Image;
