import { adminAboutUs, adminSchools, editAdminCountry, editAdminSchools, editCountryDailySummary, editCountrySummary, editSchoolDailySummary, editSchoolSummary } from "~/core/routes";

export const routeObject = {
  "Country": editAdminCountry,
  "Country Summary": editCountrySummary,
  "Country Daily Connectivity Summary": editCountryDailySummary,
  "School": editAdminSchools,
  "School Summary": editSchoolSummary,
  "School Daily Connectivity Summary": editSchoolDailySummary,
  "About Us": adminAboutUs,
  "Slider Image": adminAboutUs,
  "File Import": adminSchools
}
