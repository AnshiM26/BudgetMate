import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../libs/apiCalls.js";
import { toast } from "sonner";
import Input from "./input.jsx"
import { Button } from "./button.jsx";
const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const submitPasswordHandler = async (data) => {
    try {
      setLoading(true);
      const { data: res } = await api.put(`/user/change-password`, data);
      if (res?.status === "success") {
        toast.success(res?.message);
      }
    } catch (error) {
      console.error("Something went wrong: ", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="py-20">
      <form onSubmit={handleSubmit(submitPasswordHandler)}>
        <div className="">
          <p className="text-xl font-bold text-black dark:text-white mb-1 mt-10">
            Change Password
          </p>
          <span className="labelStyles">
            This will be used to log into your account and complete high
            severity actions.
          </span>
          <div className="mt-6 space-y-6">
            <Input
              disabled={loading}
              type="password"
              name="currpass"
              label="Current Password"
              className="inputStyle"
              {...register("currpass", {
                required: "Current Password is required",
              })}
              error={errors.currpass ? errors.currpass.message : ""}
            />
            <Input
              type="password"
              disabled={loading}
              name="newpass"
              label="New Password"
              className="inputStyle"
              {...register("newpass", {
                required: "New password is required!",
              })}
              error={errors.newpass ? errors.newpass.message : ""}
            />
            <Input
              type="password"
              disabled={loading}
              name="confirmpass"
              label="Confirm Password"
              className="inputStyle"
              {...register("confirmpass", {
                required: "Need to confirm password!",
                validate: (val) => {
                  const { newpass } = getValues();
                  return newpass === val || "Passwords do not match!";
                },
              })}
              error={errors.confirmpass ? errors.confirmpass.message : ""}
            />
          </div>
        </div>
        <div className="flex items-center gap-6 justify-end pb-10 border-b-2 border-gray-200 dark:border-gray-800 mt-6">
          <Button
            variant="outline"
            loading={loading}
            type="reset"
            className="px-6 bg-transparent text-black dark:text-black border-gray-200 dark:border-s-gray-700"
          >
            Reset
          </Button>
          <Button
            loading={loading}
            type="submit"
            className="px-8 bg-violet-800 text-white"
          >
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
