export interface CrmEvent {
  id: string;
  type: string;
  date: string;
  description: string;
}

export interface CrmNote {
  id: string;
  author: string;
  date: string;
  content: string;
}

export interface CrmPerson {
  wuid: string;
  name: string;
  email?: string;
  org?: string;

  isNodlr: boolean;
  isMeshCustomer: boolean;
  isFounderOrPartner: boolean;
  isMeshInt?: boolean;

  address?: string;
  phone1?: string;
  phone2?: string;
  affiliateReferrer?: string;

  createdAt: string;
  lastContact?: string;

  activeNodes: number;
  l1Affiliates: number;
  l2Affiliates: number;

  events: CrmEvent[];
  notes: CrmNote[];
}
