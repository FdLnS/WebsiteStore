export interface ProductType {
  id: string;
  type: string;
  price: number;
  label?: string;
  subtitle?: string;
}

export interface Product {
  id: string;
  name: string;
  logo?: string;
  types: ProductType[];
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export const PRODUCT_CATEGORIES: Category[] = [
  {
    id: "streaming",
    name: "Streaming Apps",
    products: [
      {
        id: "netflix",
        name: "Netflix Sharing",
        logo: "/logo/netflix.jpg",
        types: [
          { id: "1p1u", type: "1P1U", price: 22000, subtitle: "/bulan" },
          { id: "1p2u", type: "1P2U", price: 13500, subtitle: "/bulan" },
          { id: "semi", type: "SemiPriv", price: 28000, subtitle: "/bulan" },
          { id: "private", type: "Private", price: 100000, subtitle: "/bulan" },
        ]
      },
      {
        id: "disney",
        name: "Disney (Sharing)",
        logo: "/logo/disney.jpg",
        types: [
          { id: "sharing", type: "Sharing", price: 18000, subtitle: "/bulan" },
        ]
      },
      {
        id: "bstation",
        name: "Bstation",
        logo: "/logo/bstation.jpg",
        types: [
          { id: "sharing-bulanan", type: "Sharing", price: 5000, subtitle: "/bulan" },
          { id: "sharing-tahunan", type: "Sharing", price: 15000, subtitle: "/tahun" },
          { id: "private", type: "Private", price: 28000, subtitle: "/bulan" },
        ]
      },
      {
        id: "loklok",
        name: "Loklok",
        logo: "/logo/loklok.jpg",
        types: [
          { id: "private-20h", type: "Private 20h", price: 13000 }
        ]
      },
      {
        id: "primevideo",
        name: "Prime Video",
        logo: "/logo/primevideo.jpg",
        types: [
          { id: "private", type: "Private", price: 9000, subtitle: "/bulan" }
        ]
      },
      {
        id: "viu",
        name: "Viu",
        logo: "/logo/viu.jpg",
        types: [
          { id: "private-bulanan", type: "Private", price: 5000, subtitle: "/bulan" },
          { id: "private-6bulan", type: "Private", price: 10000, subtitle: "/6 bulan" }
        ]
      },
      {
        id: "visionplus",
        name: "Vision+ Sports",
        logo: "/logo/visionplus.jpg",
        types: [
          { id: "sports", type: "Vision+ Sports", price: 20000, subtitle: "/bulan" }
        ]
      },
      {
        id: "vidioplatinum",
        name: "Vidio Private",
        logo: "/logo/vidio.jpg",
        types: [
          { id: "platinum", type: "Platinum", price: 25000, subtitle: "/bulan" }
        ]
      },
      {
        id: "iqiyi",
        name: "Iqiyi Private",
        logo: "/logo/iqiyi.jpg",
        types: [
          { id: "standar", type: "Standar", price: 18000, subtitle: "/bulan" },
          { id: "premium", type: "Premium", price: 25000, subtitle: "/bulan" }
        ]
      },
      {
        id: "youtube",
        name: "Youtube",
        logo: "/logo/youtube.jpg",
        types: [
          { id: "private-3bulan", type: "Private 3 Bulan", price: 20000, subtitle: "/3 bulan" }
        ]
      },
    ]
  },
  {
    id: "editing",
    name: "Editing Apps",
    products: [
      {
        id: "alightmotion",
        name: "Alight Motion",
        logo: "/logo/alightmotion.jpg",
        types: [
          { id: "private", type: "Private", price: 5000, subtitle: "/tahun" }
        ]
      },
      {
        id: "capcut",
        name: "Capcut",
        logo: "/logo/capcut.jpg",
        types: [
          { id: "private-mingguan", type: "Private", price: 5000, subtitle: "/7 hari" },
          { id: "private-bulanan", type: "Private", price: 10000, subtitle: "/1 bulan" }
        ]
      },
      {
        id: "canva",
        name: "Canva",
        logo: "/logo/canva.jpg",
        types: [
          { id: "owner", type: "Owner", price: 6000, subtitle: "/bulan" },
          { id: "edu", type: "Edu Lifetime (invite)", price: 5000 }
        ]
      },
      {
        id: "picsart",
        name: "Picsart",
        logo: "/logo/picsart.jpg",
        types: [
          { id: "member", type: "Member", price: 5000, subtitle: "/bulan" }
        ]
      },
    ]
  },
  {
    id: "music",
    name: "Music Apps",
    products: [
      {
        id: "spotify",
        name: "Spotify",
        logo: "/logo/spotify.jpg",
        types: [
          { id: "private", type: "Private", price: 16000, subtitle: "/bulan" }
        ]
      },
    ]
  },
  {
    id: "ai",
    name: "AI Apps",
    products: [
      {
        id: "gpt",
        name: "GPT",
        logo: "/logo/gpt.jpg",
        types: [
          { id: "sharing", type: "Sharing 8 user", price: 28000, subtitle: "/bulan" },
          { id: "private", type: "Private", price: 55000, subtitle: "/bulan" }
        ]
      },
      {
        id: "perplexity",
        name: "Perplexity",
        logo: "/logo/perplexity.jpg",
        types: [
          { id: "private", type: "Private", price: 18000, subtitle: "/bulan" }
        ]
      },
    ]
  },
  {
    id: "drive",
    name: "Drive Apps",
    products: [
      {
        id: "gdrive",
        name: "Google Drive",
        logo: "/logo/gdrive.jpg",
        types: [
          { id: "1tb", type: "1TB", price: 16000, subtitle: "/bulan" }
        ]
      },
    ]
  }
];
