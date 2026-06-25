export const productService = {
  async fetchProducts({ limit, skip, sortBy, order, category }) {
    let url = category
      ? `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`
      : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

    // Note: DummyJSON category endpoint ignores sortBy/order, so we'll sort client-side
    if (sortBy && order && !category) {
      url += `&sortBy=${sortBy}&order=${order}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();

    return (data?.products ?? []).map((p) => ({
      id: p.id,
      name: p.title,
      price: `$${p.price}`,
      image: p.thumbnail,
      discountPercent: p.discountPercentage,
      rating: p.rating,
      category: p.category,
      isMall: false,
    }));
  },

  // Fetch multiple categories in parallel and union results
  async fetchProductsForCategories({ limit, skip, sortBy, order, categories }) {
    if (!categories || categories.length === 0) {
      return this.fetchProducts({ limit, skip, sortBy, order, category: '' });
    }

    if (categories.length === 1) {
      return this.fetchProducts({ limit, skip, sortBy, order, category: categories[0] });
    }

    // Multiple categories: fetch in parallel
    const results = await Promise.all(
      categories.map((cat) =>
        this.fetchProducts({ limit, skip, sortBy: '', order: '', category: cat })
      )
    );

    // Union: flatten + deduplicate
    const seen = new Set();
    const merged = [];
    for (const list of results) {
      for (const item of list) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          merged.push(item);
        }
      }
    }

    // Client-side sort (since DummyJSON doesn't support it on categories)
    return this.sortProducts(merged, sortBy, order);
  },

  // ── Client-side sorting utility ────────────────────────────────────────────
  sortProducts(products, sortBy, order) {
    if (!sortBy || !order) return products;

    const sorted = [...products].sort((a, b) => {
      let aVal, bVal;

      if (sortBy === 'price') {
        aVal = parseFloat(String(a.price).replace(/[^\d.]/g, ''));
        bVal = parseFloat(String(b.price).replace(/[^\d.]/g, ''));
      } else if (sortBy === 'rating') {
        aVal = a.rating ?? 0;
        bVal = b.rating ?? 0;
      } else if (sortBy === 'discountPercentage') {
        aVal = a.discountPercent ?? 0;
        bVal = b.discountPercent ?? 0;
      } else {
        return 0;
      }

      if (order === 'asc') return aVal - bVal;
      if (order === 'desc') return bVal - aVal;
      return 0;
    });

    return sorted;
  },
};