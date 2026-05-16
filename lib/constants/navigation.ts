export const mainNavigation = [
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Shop All", href: "/shop" },
  { label: "Best Sellers", href: "/shop?sort=popularity" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNavigation = [
  { label: "Shop", href: "/shop" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "About", href: "/about" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
] as const;

export const accountNavigation = [
  { label: "Wishlist", href: "/wishlist" },
  { label: "Bag", href: "/bag" },
  { label: "Contact", href: "/contact" },
] as const;

export const adminNavigation = [
  { label: "Overview", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
] as const;
