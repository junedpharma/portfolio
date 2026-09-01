export interface Product {
  id: string;
  name: string;
  minPurchaseQty: number;
  awardedArticle: string;
  articleImage?: string;
}

export const PRODUCTS_DATA: Product[] = [
  {
    id: "atc-fungi-6",
    name: "Fungi 6 Tube",
    minPurchaseQty: 10,
    awardedArticle: "1 Cold Inhaler Jar Free",
    articleImage: undefined
  },
  {
    id: "atc-clav-625",
    name: "ATC-CLAV 625",
    minPurchaseQty: 10,
    awardedArticle: "1 Bonus Box + 5% Cash Discount",
    articleImage: undefined
  },
  {
    id: "atc-pan-d",
    name: "ATC-PAN D",
    minPurchaseQty: 10,
    awardedArticle: "3 Bonus Capsule Boxes Free",
    articleImage: undefined
  },
  {
    id: "atc-para-650",
    name: "ATC-PARA 650",
    minPurchaseQty: 20,
    awardedArticle: "5 Free Boxes Awarded",
    articleImage: undefined
  },
  {
    id: "atc-cal-d3",
    name: "ATC-CAL D3",
    minPurchaseQty: 10,
    awardedArticle: "2 Free Tablet Strips Awarded",
    articleImage: undefined
  },
  {
    id: "atc-cough-100",
    name: "ATC-COUGH SYRUP",
    minPurchaseQty: 12,
    awardedArticle: "3 Free 100ml Bottles Awarded",
    articleImage: undefined
  },
  {
    id: "atc-azi-500",
    name: "ATC-AZI 500",
    minPurchaseQty: 10,
    awardedArticle: "2 Free Tablet Strips Awarded",
    articleImage: undefined
  },
  {
    id: "atc-mont-lc",
    name: "ATC-MONT LC",
    minPurchaseQty: 10,
    awardedArticle: "2 Free Boxes + 3% Cash Discount",
    articleImage: undefined
  },
  {
    id: "atc-diclo-gel",
    name: "ATC-DICLO GEL",
    minPurchaseQty: 15,
    awardedArticle: "4 Free Gel Tubes Awarded",
    articleImage: undefined
  },
  {
    id: "atc-rab-dsr",
    name: "ATC-RAB DSR",
    minPurchaseQty: 10,
    awardedArticle: "2 Free Capsule Strips Awarded",
    articleImage: undefined
  },
  {
    id: "atc-vit-gold",
    name: "ATC-VIT GOLD",
    minPurchaseQty: 10,
    awardedArticle: "3 Free Softgel Boxes Awarded",
    articleImage: undefined
  },
  {
    id: "atc-inj-neuro",
    name: "ATC-NEURO INJ",
    minPurchaseQty: 10,
    awardedArticle: "2 Free Ampoule Packs Awarded",
    articleImage: undefined
  }
];
