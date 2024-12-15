export interface ApiGoldSpotResponse {
  date: string;
  items: {
    curr: string;
    xauPrice: number;
    xagPrice: number;
    chgXau: number;
    chgXag: number;
    pcXau: number;
    pcXag: number;
    xauClose: number;
    xagClose: number;
  };
}

export interface PriceRawItems {
  name: string;
  bid: number;
  ask: number;
  diff: string | number;
}

export interface ApiGoldTHResponse {
  date: string;
  price: {
    association: PriceRawItems;
    ninety_nine: PriceRawItems;
  };
}

export interface Association {
  name: string;
  bid: number;
  ask: number;
  diff: string | number;
}

export interface ApiGoldTH {
  status: string;
  response: ApiGoldTHResponse;
}

export interface ApiGoldSpot {
  status: string;
  response: ApiGoldSpotResponse;
}
