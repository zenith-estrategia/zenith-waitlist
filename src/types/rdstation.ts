export interface RDStationConversionPayload {
  conversion_identifier: string;
  email: string;
  name?: string;
  job_title?: string;
  state?: string;
  city?: string;
  country?: string;
  personal_phone?: string;
  mobile_phone?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  website?: string;
  company_name?: string;
  company_site?: string;
  company_address?: string;
  client_tracking_id?: string;
  traffic_source?: string;
  traffic_medium?: string;
  traffic_campaign?: string;
  traffic_value?: string;
  available_for_mailing?: boolean;
  tags?: string[];
  legal_bases?: Array<{
    category: "communications";
    type:
      | "pre_existent_contract"
      | "consent"
      | "legitimate_interest"
      | "judicial_process"
      | "vital_interest"
      | "public_interest";
    status: "granted" | "declined";
  }>;
  [key: `cf_${string}`]: string | number | boolean; // Campos personalizados
}

export interface RDStationEventRequest {
  event_type: "CONVERSION";
  event_family: "CDP";
  payload: RDStationConversionPayload;
}

export interface RDStationEventResponse {
  event_uuid: string;
}

export interface FormData {
  name: string;
  email: string;
  phone?: string;
}
