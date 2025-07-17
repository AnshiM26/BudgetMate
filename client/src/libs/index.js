import {v4 as uuidv4} from "uuid";
export const MaskAccountNumber=(accountNumber)=>{
    if(typeof accountNumber !== "string" || accountNumber.length <12){
        return accountNumber;
    }
    const firstFour=accountNumber.substring(0,4);
    const lastFour=accountNumber.substring(accountNumber.length-4);
    const maskedDigits="*".repeat(accountNumber.length-8);
    return `${firstFour}${maskedDigits}${lastFour}`
}
export const formatCurrency=(value)=>{
    const user=JSON.parse(localStorage.getItem("user"));
    if(isNaN(value)){
        return "Invalid input";
    }
    const numberValue= typeof value === "string" ? parseFloat(value):value;
    return new Intl.NumberFormat("en-US",{
        style:"currency",
        currency:user?.currency || "USD",
        minimumFractionDigits:2,
    }).format(numberValue);
};

export async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,currencies");
    const data = await response.json();

    if (response.ok) {
      const countries = data.map((country) => {
        const currencies = country.currencies || {};
        const currencyCode = Object.keys(currencies)[0];

        return {
          country: country.name?.common || "",
          flag: country.flags?.png || "",
          currency: currencyCode || "",
        };
      });

      const sortedCountries = countries.sort((a, b) =>
        a.country.localeCompare(b.country)
      );

      return sortedCountries;
    } else {
      console.error(`Error: ${data.message}`);
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return [];
  }
}
