export type FieldType = 'first_name' | 'last_name' | 'email' | 'date_of_birth' | 'monthly_income' | 'gender' | 'address' | 'contractor';

export interface LenderGetResponse {
  name: string;
  fields: Array<
    FieldType
  >;
}

export interface LenderGetResponseExtended {
  name: string;
  fields: Array<LenderFields>;
}

export interface LenderFields {
  name: FieldType;
  type: string;
  required: boolean;
  options?: Array<string>;
}

export interface LenderPostResponse {
  decision: 'accepted' | 'declined';
}
