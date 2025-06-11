export type DistrictWithSchoolCount = {
  admin1_description_ui_label: any;
  admin2_description: string;
  admin1_name?: string;
  admin2_name?: string;
  admin1_id?: string;
  admin2_id?: string;
  admin1_code: string;
  admin2_count?: number;
  school_count?: number;
  data?: Record<string, DistrictWithSchoolCount>;
}

export type CountryWithDistrictCount = {
  country_id: number;
  country_name: string;
  country_code: string;
  admin1_count: number;
  integration_status: number;
  data: Record<string, DistrictWithSchoolCount>;
};

export type SearchResultApi = {
  country_name: string
  admin2_name: string
  country_id: number
  id: number
  country_code: string
  admin1_name: string
  name: string;
  external_id: string;
}

export type SearchResultCollection = {
  countryName: string
  admin1Name: string
  admin2Name: string
  countryId: number
  countryCode: string
  name: string
  id: number
}

export type Country = {
  countryId: number;
  countryCode: string;
  name: string;
  countryName: string;
}

export type AdminType = {
  name: string;
  level?: number,
  adminCode?: string;
} & Country;

export type SearchType = {
  id: number;
  type: string;
  adminName?: string;
  schoolId?: number;
} & AdminType
