// src/lib/fetchProductsFromSheet.ts

export async function fetchProductsFromSheet() {
  const url = "https://gsx2json.com/api?id=1q9C9FtdXKOihpzjysQlDB2YTRVpSB8JuMNdVmBAzK6c&sheet=Sheet1";
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  // data.rows HARUS array, kalau tidak ada rows return []
  const rows = Array.isArray(data.rows) ? data.rows : [];
  // mapping rows sesuai kebutuhan
  return rows.map((row: any) => ({
    ...row,
    price: Number(row.price ?? 0),
  }));
}


// Util untuk group-by kategori dan produk
export function groupProducts(rows: any[]) {
  const categoryMap: Record<string, any> = {};

  rows.forEach((row) => {
    if (!categoryMap[row.category_id]) {
      categoryMap[row.category_id] = {
        category_id: row.category_id,
        category_name: row.category_name,
        products: [],
      };
    }
    const cat = categoryMap[row.category_id];
    let prod = cat.products.find((p: any) => p.product_id === row.product_id);
    if (!prod) {
      prod = {
        product_id: row.product_id,
        product_name: row.product_name,
        logo: row.logo,
        types: [],
      };
      cat.products.push(prod);
    }
    prod.types.push({
      type_id: row.type_id,
      type_name: row.type_name,
      price: row.price,
      subtitle: row.subtitle,
    });
  });

  return Object.values(categoryMap);
}
