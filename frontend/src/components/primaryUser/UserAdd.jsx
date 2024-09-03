import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const CompanyAdd = ({
  process,
  UserData,
  handleUserData,
  handleEditedData,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (UserData) {
      for (const [key, value] of Object.entries(UserData)) {
        setValue(key, value)
      }
    }
  }, [UserData, setValue])

  const onSubmit = (data) => {
    if (process === "Registration") {
      handleUserData(data)
    } else if (process === "Edit") {
      handleEditedData(data)
    }
  }

  return (
    <div className="container justify-center items-center min-h-screen py-8 bg-gray-100">
      <div className="w-5/6 bg-white shadow-lg rounded p-8 mx-auto">
        <h2 className="text-2xl font-semibold mb-6">User Registration</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="input"
            />
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>

          <div>
            <label>Mobile</label>
            <input
              {...register("mobile", {
                required: "Mobile is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit mobile number",
                },
              })}
              className="input"
            />
            {errors.mobile && <p className="error">{errors.mobile.message}</p>}
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="input"
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="input"
            />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit" className="btn">
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default CompanyAdd
