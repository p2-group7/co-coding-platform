'use client'

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";


const schema = z.object({
  text: z.string()
});

type FormFields = z.infer<typeof schema>;

const EditDescript = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormFields>({
    resolver: zodResolver(schema)
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [text, setText] = useState("Description");

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const onSubmit: SubmitHandler<FormFields> = (data) =>{
    setText(data.text);
    setIsEditMode(false);
  }

  return (
    <div>
      {isEditMode ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("text")}
            defaultValue={text}
            className="text-white-700 rounded-lg border-2 border-secondary bg-secondary bg-gradient-to-b from-muted/50 to-muted p-6 text-lg no-underline outline-none focus:shadow-md"
          />
          {errors.text && <p>{errors.text.message}</p>}
          <br />
          <button type="submit" className="flex-row cursor-pointer items-center justify-center rounded-md m-2 p-2 shadow-md hover:bg-secondary">Save</button>
          <button type="button" className="flex-row cursor-pointer items-center justify-center rounded-md m-2 p-2 shadow-md hover:bg-secondary" onClick={toggleEditMode}>Cancel</button>
        </form>
      ) : (
        <div>
          <p className="text-white-700 rounded-lg border-2 border-secondary bg-secondary bg-gradient-to-b from-muted/50 to-muted p-6 text-lg no-underline outline-none focus:shadow-md">{text}</p>
          <button type="button" className="flex cursor-pointer items-center justify-center rounded-md m-2 p-2 shadow-md hover:bg-secondary" onClick={toggleEditMode}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default EditDescript;
