import { headers } from "next/headers";

const COUNTRY_HEADER_KEY = "x-user-country";

export function setUserCountryHeader(
  headers: Headers,
  country: string | undefined
) {
  if (country == null) {
    headers.delete(COUNTRY_HEADER_KEY);
  } else {
    headers.set(COUNTRY_HEADER_KEY, country);
  }
}

async function getUserCountry() {
    const header = await headers();
    return header.get(COUNTRY_HEADER_KEY) || undefined;
}


export async function getUserCoupon(){
   const country = await getUserCountry();
   if(country == null) return undefined;

   const coupon = ppp
}
