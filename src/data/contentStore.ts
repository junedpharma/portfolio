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

export const INITIAL_SITE_CONTENT: SiteContent = {
  branchInfo: {
    managerName: "JUNED PATEL",
    managerTitle: "BRANCH MANAGER — ATC PHARMA",
    phone: "+91 98250 12345",
    email: "juned.patel@atcpharma.com",
    address: "Commercial Pharma Plaza, Wholesale Medical Market, Central Beat Zone",
    operatingHours: "Mon – Sat: 9:00 AM – 8:00 PM (Sunday Closed)",
    heroImage: "/juned-patel.jpg"
  },
  notices: [
    {
      id: "notice-1",
      type: "holiday",
      badgeText: "Holiday Closure",
      title: "Branch Closure on Rakshabandhan",
      description: "ATC Pharma branch office will remain closed on Friday, 28th August 2026 on account of the festival of Rakshabandhan. Regular branch billing and dispatch operations will resume on Saturday, 29th August 2026."
    },
    {
      id: "notice-2",
      type: "stock",
      badgeText: "New Stock Arrival",
      title: "Fresh Antibiotic Stock",
      description: "Fresh 2026 manufacturing batches for ATC-CEF 200mg & ATC-CLAV 625mg have arrived at the branch warehouse. Complete technical compositions and scheme details are updated below."
    }
  ],
  schemes: [
    {
      id: "atc-fungi-6",
      name: "Fungi 6 Tube",
      minPurchaseQty: 10,
      awardedArticle: "1 Cold Inhaler Jar Free",
      articleImage: "/inhaler-jar.jpg"
    },
    {
      id: "atc-clav-625",
      name: "ATC-CLAV 625",
      minPurchaseQty: 10,
      awardedArticle: "1 Bonus Box + 5% Cash Discount",
      articleImage: ""
    },
    {
      id: "atc-pan-d",
      name: "ATC-PAN D",
      minPurchaseQty: 10,
      awardedArticle: "3 Bonus Capsule Boxes Free",
      articleImage: ""
    },
    {
      id: "atc-para-650",
      name: "ATC-PARA 650",
      minPurchaseQty: 20,
      awardedArticle: "5 Free Boxes Awarded",
      articleImage: ""
    },
    {
      id: "atc-cal-d3",
      name: "ATC-CAL D3",
      minPurchaseQty: 10,
      awardedArticle: "2 Free Tablet Strips Awarded",
      articleImage: ""
    },
    {
      id: "atc-cough-100",
      name: "ATC-COUGH SYRUP",
      minPurchaseQty: 12,
      awardedArticle: "3 Free 100ml Bottles Awarded",
      articleImage: ""
    }
  ],
  salesTeam: [
    {
      id: "sales-1",
      name: "Ramesh Sharma",
      role: "Senior Area Sales Executive",
      territory: "Central Market & Station Road Beat",
      phone: "+91 98230 11223",
      operatorNumber: ""
    },
    {
      id: "sales-2",
      name: "Aman Khan",
      role: "Territory Sales Representative",
      territory: "Hospital Zone & Civil Line Chemists",
      phone: "+91 98901 22334",
      operatorNumber: ""
    },
    {
      id: "sales-3",
      name: "Vikas Patel",
      role: "Field Representative & Institutional Sales",
      territory: "Suburban Wholesale Markets & Outer Beats",
      phone: "+91 97654 33445",
      operatorNumber: ""
    }
  ]
};
