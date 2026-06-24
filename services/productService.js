export const productService = {
  async fetchProducts({ limit, skip }) {
    const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error('Failed to fetch data');
    const data = await res.json();

    return (data?.products ?? []).map((p) => ({
      id: p.id,
      name: p.title,
      price: `$${p.price}`,
      image: p.thumbnail,
    }));
  },
};

