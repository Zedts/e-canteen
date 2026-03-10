export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  rating: number;
}

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
