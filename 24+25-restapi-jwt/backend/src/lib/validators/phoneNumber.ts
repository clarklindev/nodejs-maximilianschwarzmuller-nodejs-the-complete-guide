import { PhoneNumberUtil, RegionCode } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export const isPhoneNumber = (value: string, countryCode?: string) => {
  if (!value) {
    return 'number is undefined';
  }

  if (value.toString().includes('+')) {
    const phoneNumber = phoneUtil.parse(value as string);
    const isValid = phoneUtil.isValidNumber(phoneNumber);
    if (!isValid) {
      return 'number is invalid';
    }
  }

  if (countryCode?.length) {
    const strippedNonNumericCountryCode = countryCode.replace(/\D/g, ''); //remove non numeric chars eg. the prepended +
    const region = PhoneNumberUtil.getInstance().getRegionCodeForCountryCode(parseInt(strippedNonNumericCountryCode));

    if (region === ('ZZ' as RegionCode)) {
      return 'Country code incorrect';
    }

    const isValidNumber = phoneUtil.isValidNumberForRegion(phoneUtil.parse(value.toString(), region), region);
    if (!isValidNumber) {
      return `not a valid ${region} number`;
    }
  }
};
