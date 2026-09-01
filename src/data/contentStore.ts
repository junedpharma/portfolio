export interface NoticeItem {
  id: string;
  type: 'holiday' | 'stock' | 'general';
  badgeText: string;
  title: string;
  description: string;
  pdfUrl?: string;
  pdfName?: string;
}

export interface SchemeProduct {
  id: string;
  name: string;
  minPurchaseQty: number;
  awardedArticle: string;
  articleImage?: string;
}

export interface SalesRep {
  id: string;
  name: string;
  role: string;
  territory: string;
  phone: string;
  operatorNumber: string;
}

export interface BranchInfo {
  managerName: string;
  managerTitle: string;
  phone: string;
  email: string;
  address: string;
  operatingHours: string;
  heroImage: string;
}

export interface SiteContent {
  branchInfo: BranchInfo;
  notices: NoticeItem[];
  schemes: SchemeProduct[];
  salesTeam: SalesRep[];
}
