import React, { Fragment, useState, useEffect } from "react";
import { Button } from "../components/button.jsx";
import useStore from "../store/index.js";
import { useForm } from "react-hook-form";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import Input from "../components/input.jsx";
import { BsChevronExpand } from "react-icons/bs";
import { BiCheck } from "react-icons/bi";
import { fetchCountries } from "../libs/index.js";
import { toast } from "sonner";
import api from "../libs/apiCalls.js";
export const SettingForm = () => {
  const { user } = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: user ?? {} });
  const [selectedCountry, setSelectedCountry] = useState(
    user
      ? {
          country: user.country,
          currency: user.currency,
        }
      : ""
  );
  const [fname, setFname] = useState(user?.firstname || "");
  const [lname, setLname] = useState(user?.lastname || "");
  const [query, setQuery] = useState("");
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const newData = {
        fname: fname, // manually added
        lname: lname, // manually added
        contact: values.contact,
        email: values.email, // not needed in update, but won't hurt
        country: selectedCountry.country,
        currency: selectedCountry.currency,
      };

      const { data: res } = await api.put(`/user`, newData);
      if (res?.user) {
        const newUser = { ...res.user, token: user.token };
        localStorage.setItem("user", JSON.stringify(newUser));
        toast.success(res?.message);
      }
    } catch (error) {
      console.error("Something went wrong", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCountries =
    query === ""
      ? countriesData
      : countriesData.filter((country) =>
          country.country
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  const getCountriesList = async () => {
    const data = await fetchCountries();
    setCountriesData(data);
  };
  useEffect(() => {
    getCountriesList();
  }, []);
  const Countries = () => {
    return (
      <div className="w-full">
        <Combobox value={selectedCountry} onChange={setSelectedCountry}>
          <div className="relative mt-1">
            <div className="">
              <ComboboxInput
                className="inputStyles"
                displayValue={(country) => country?.country}
                onChange={(e) => setQuery(e.target.value)}
              />
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                <BsChevronExpand className="text-gray-400" />
              </ComboboxButton>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-900 py-1">
                {filteredCountries.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-gray-500">
                    Nothing found
                  </div>
                ) : (
                  filteredCountries?.map((country, index) => (
                    <ComboboxOption
                      key={country.country + index}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-violet-600/20 text-white"
                            : "text-gray-900"
                        }`
                      }
                      value={country}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center gap-2">
                            <img
                              src={country?.flag}
                              alt={country.country}
                              className="w-8 h-5 rounded-sm object-cover"
                            />
                            <span
                              className={`block truncate text-gray-700 dark:text-gray-500 ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {country?.country}
                            </span>
                          </div>
                          {selected ? (
                            <span>
                              <BiCheck className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ComboboxOption>
                  ))
                )}
              </ComboboxOptions>
            </Transition>
          </div>
        </Combobox>
      </div>
    );
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <Input
            name="fname"
            label="First Name"
            placeholder="John"
            {...register("fname", { required: true })}
            defaultValue={user?.firstname}
            onChange={(e) => setFname(e.target.value)}
            className="inputStyles"
          />
        </div>
        <div className="w-full">
          <Input
            name="lname"
            label="Last Name"
            placeholder="Doe"
            {...register("lname", { required: true })}
            defaultValue={user?.lastname}
            onChange={(e) => setLname(e.target.value)}
            className="inputStyles"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <Input
            name="email"
            label="Email"
            readOnly
            placeholder="youremail@example.com"
            error={errors.email?.message}
            {...register("email")}
            className="w-full text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
          />
        </div>
        <div className="w-full">
          <Input
            name="contact"
            label="Phone Number"
            placeholder="0123456789"
            error={errors.contact?.message}
            {...register("contact")}
            className="w-full text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <span className="labelStyles">Country</span>
          <Countries />
        </div>
        <div className="w-full">
          <span className="labelStyles">Currency</span>
          <select className="inputStyles">
            <option>{selectedCountry?.currency || user?.country}</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-6 justify-end pb-10 border-b-2 border-gray-200 dark:border-gray-800">
        <Button
          variant="outline"
          loading={loading}
          type="reset"
          className="px-6 bg-transparent text-black dark:text-white border border-gray-200 dark:border-s-gray-700"
        >
          Reset
        </Button>
        <Button
          loading={loading}
          type="submit"
          className="px-8 bg-violet-800 text-white"
        >
          Save
        </Button>
      </div>
    </form>
  );
};
