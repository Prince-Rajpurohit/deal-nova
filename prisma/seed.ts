import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Clear existing data
  await prisma.clickLog.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.newsletter.deleteMany({});
  await prisma.blog.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.affiliateLink.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Users (Admin & regular user)
  const hashedAdminPassword = await bcrypt.hash("adminpass", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Deal Nova Admin",
      email: "admin@dealnova.com",
      password: hashedAdminPassword,
      role: "ADMIN",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
  });

  const hashedUserPassword = await bcrypt.hash("userpass", 10);
  const user = await prisma.user.create({
    data: {
      name: "Alex Mercer",
      email: "alex@dealnova.com",
      password: hashedUserPassword,
      role: "USER",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log("Created users:", { admin: admin.email, user: user.email });

  // 3. Create Categories
  const fashion = await prisma.category.create({
    data: {
      name: "Fashion",
      slug: "fashion",
      description: "Upgrade your wardrobe with premium style recommendations.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
    },
  });

  const sneakers = await prisma.category.create({
    data: {
      name: "Sneakers",
      slug: "sneakers",
      description: "Trending kicks, sports shoes, and rare sneaker deals.",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    },
  });

  const watches = await prisma.category.create({
    data: {
      name: "Watches",
      slug: "watches",
      description: "Premium horology, chronographs, and digital timepieces.",
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop&q=80",
    },
  });

  const gadgets = await prisma.category.create({
    data: {
      name: "Gadgets",
      slug: "gadgets",
      description: "Cutting-edge tech, personal audio, smart devices, and computer accessories.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    },
  });

  const home = await prisma.category.create({
    data: {
      name: "Home Essentials",
      slug: "home-essentials",
      description: "Aesthetic furniture, smart home devices, and daily home upgrades.",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
    },
  });

  const dailyDeals = await prisma.category.create({
    data: {
      name: "Daily Deals",
      slug: "daily-deals",
      description: "Flash discounts and high-demand bargains you cannot miss.",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80",
    },
  });

  console.log("Created categories:", [fashion.name, sneakers.name, watches.name, gadgets.name, home.name, dailyDeals.name]);

  // 4. Create Products & Affiliate Links
  // Product 1: Nike Air Max Pulse (Sneaker)
  const product1 = await prisma.product.create({
    data: {
      title: "Nike Air Max Pulse",
      slug: "nike-air-max-pulse-beige",
      description: "The Air Max Pulse pulls inspiration from the London music scene, bringing an underground touch to the iconic Air Max line. Its textile-wrapped midsole and point-loaded cushioning deliver a bouncy, clean look that's comfortable enough for all-day wear.",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80"
      ],
      priceOriginal: 13999,
      priceDiscounted: 9799,
      rating: 4.8,
      reviewsCount: 142,
      features: [
        "Point-loaded cushioning system features a plastic clip that distributes weight to targeted points across the Air unit",
        "Textile upper with leather and synthetic overlays offers durability and breathability",
        "Rubber Waffle outsole delivers traction and heritage style"
      ],
      specs: {
        "Style": "DR0453-001",
        "Colorway": "Cobblestone/Reflect Silver",
        "Country of Origin": "Vietnam",
        "Release Date": "2024"
      },
      pros: ["Extremely comfortable cushioning", "Sleek, modern lifestyle silhouette", "High-quality breathability"],
      cons: ["Priced on the higher side", "Light colors get dirty easily"],
      isTopPick: true,
      isBestSeller: false,
      isFeatured: true,
      categoryId: sneakers.id,
    },
  });

  await prisma.affiliateLink.createMany({
    data: [
      {
        productId: product1.id,
        storeName: "Amazon",
        url: "https://amazon.in/dp/mock-nike-pulse",
        price: 9999,
        isPrimary: false,
      },
      {
        productId: product1.id,
        storeName: "Flipkart",
        url: "https://flipkart.com/mock-nike-pulse",
        price: 9799,
        isPrimary: true,
      },
      {
        productId: product1.id,
        storeName: "Myntra",
        url: "https://myntra.com/mock-nike-pulse",
        price: 10499,
        isPrimary: false,
      }
    ],
  });

  // Product 2: Seiko 5 Sports Automatic (Watch)
  const product2 = await prisma.product.create({
    data: {
      title: "Seiko 5 Sports Automatic SBSA005",
      slug: "seiko-5-sports-automatic-blue",
      description: "For over 50 years, Seiko 5 Sports has delivered consistently high levels of reliability, durability, performance, and value. With a classic design, automatic hacking movement, and day/date display, it is the perfect luxury-inspired entry-level mechanical watch.",
      images: [
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80"
      ],
      priceOriginal: 28000,
      priceDiscounted: 22400,
      rating: 4.7,
      reviewsCount: 89,
      features: [
        "Automatic movement with manual winding capacity and 41-hour power reserve",
        "LumiBrite hands and markers for high legibility in the dark",
        "See-through screw case back showing off the 4R36 caliber"
      ],
      specs: {
        "Caliber Number": "4R36",
        "Case Material": "Stainless Steel",
        "Glass Type": "Hardlex",
        "Water Resistance": "10 bar (100 meters)"
      },
      pros: ["Incredibly reliable mechanical movement", "Beautiful see-through case back", "Excellent lume visibility"],
      cons: ["Hardlex crystal is less scratch-resistant than sapphire", "Runs slightly fast/slow (+45 to -35 seconds per day)"],
      isTopPick: false,
      isBestSeller: true,
      isFeatured: true,
      categoryId: watches.id,
    },
  });

  await prisma.affiliateLink.createMany({
    data: [
      {
        productId: product2.id,
        storeName: "Amazon",
        url: "https://amazon.in/dp/mock-seiko-sports",
        price: 22400,
        isPrimary: true,
      },
      {
        productId: product2.id,
        storeName: "Myntra",
        url: "https://myntra.com/mock-seiko-sports",
        price: 24500,
        isPrimary: false,
      }
    ],
  });

  // Product 3: Apple AirPods Pro 2 (Gadgets)
  const product3 = await prisma.product.create({
    data: {
      title: "Apple AirPods Pro (2nd Generation)",
      slug: "apple-airpods-pro-2",
      description: "AirPods Pro (2nd generation) with USB-C deliver up to 2x more Active Noise Cancellation than the previous generation. With Adaptive Audio, Transparency Mode, and Conversation Awareness, they offer a personalized acoustic performance anywhere.",
      images: [
        "https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80"
      ],
      priceOriginal: 24900,
      priceDiscounted: 18999,
      rating: 4.9,
      reviewsCount: 312,
      features: [
        "Apple-designed H2 chip drives advanced audio performance and active cancellation",
        "Up to 6 hours of listening time with Active Noise Cancellation enabled",
        "Dust, sweat, and water-resistant (IP54) AirPods and charging case"
      ],
      specs: {
        "Audio Tech": "Active Noise Cancellation, Spatial Audio",
        "Sensors": "Dual beamforming microphones, Skin-detect sensor",
        "Chip": "Apple H2 Headphone Chip",
        "Charging Case": "MagSafe (USB-C) with speaker and lanyard loop"
      },
      pros: ["Industry-leading Active Noise Cancellation", "Incredible soundstage and custom bass response", "Seamless integration inside Apple Ecosystem"],
      cons: ["High price point", "Limited customization options on Android devices"],
      isTopPick: true,
      isBestSeller: true,
      isFeatured: true,
      categoryId: gadgets.id,
    },
  });

  await prisma.affiliateLink.createMany({
    data: [
      {
        productId: product3.id,
        storeName: "Amazon",
        url: "https://amazon.in/dp/mock-airpods-pro2",
        price: 18999,
        isPrimary: true,
      },
      {
        productId: product3.id,
        storeName: "Flipkart",
        url: "https://flipkart.com/mock-airpods-pro2",
        price: 19499,
        isPrimary: false,
      }
    ],
  });

  // Product 4: Premium Oxford Cotton Shirt (Budget Fashion Shirt under 999)
  const product4 = await prisma.product.create({
    data: {
      title: "Zara Styled Slim Fit Beige Oxford Shirt",
      slug: "zara-styled-beige-oxford-shirt",
      description: "Made from premium 100% breathable Oxford cotton, this classic button-down shirt offers a luxury feel without the steep designer price tag. Perfect for both office meetings and casual weekend coffee meetups.",
      images: [
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&auto=format&fit=crop&q=80"
      ],
      priceOriginal: 1999,
      priceDiscounted: 899,
      rating: 4.2,
      reviewsCount: 54,
      features: [
        "100% pure premium long-staple cotton fibers",
        "Pre-washed to minimize shrinkage and enhance softness",
        "Classic button-down collar and sleek chest pocket detail"
      ],
      specs: {
        "Fit": "Slim Fit",
        "Fabric": "100% Oxford Cotton",
        "Color": "Sand Beige",
        "Pattern": "Solid Classic"
      },
      pros: ["High-grade heavy cotton fabric", "Excellent stitching detail", "Affordable pricing under ₹999"],
      cons: ["Requires warm steam ironing to remove creases", "Slightly tight in the shoulder area"],
      isTopPick: false,
      isBestSeller: true,
      isFeatured: false,
      categoryId: fashion.id,
    },
  });

  await prisma.affiliateLink.createMany({
    data: [
      {
        productId: product4.id,
        storeName: "Myntra",
        url: "https://myntra.com/mock-beige-shirt",
        price: 899,
        isPrimary: true,
      },
      {
        productId: product4.id,
        storeName: "Flipkart",
        url: "https://flipkart.com/mock-beige-shirt",
        price: 949,
        isPrimary: false,
      }
    ],
  });

  // Product 5: Budget Sneakers Under 500
  const product5 = await prisma.product.create({
    data: {
      title: "Aventur Classic Beige Canvas Sneakers",
      slug: "aventur-classic-canvas-sneakers-beige",
      description: "Get the timeless retro skater look with these lightweight, durable canvas sneakers. Features a double-stitched canvas upper, comfortable cushioned footbed, and vulcanized rubber sole for daily casual walking.",
      images: [
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80"
      ],
      priceOriginal: 999,
      priceDiscounted: 449,
      rating: 4.0,
      reviewsCount: 221,
      features: [
        "Lightweight and breathable canvas design",
        "Ortholite-inspired soft foam padded insole",
        "Skid-resistant vulcanized textured rubber outsole"
      ],
      specs: {
        "Material": "Canvas Upper",
        "Sole": "Vulcanized Rubber",
        "Fastening": "Lace-up closure",
        "Weight": "280g per shoe"
      },
      pros: ["Incredibly cheap price (Under ₹500)", "Classic design matches any outfit", "Easy to clean by hand"],
      cons: ["Arch support is minimal for long runs", "Inner sole padding flattens after months of heavy use"],
      isTopPick: false,
      isBestSeller: false,
      isFeatured: false,
      categoryId: sneakers.id,
    },
  });

  await prisma.affiliateLink.createMany({
    data: [
      {
        productId: product5.id,
        storeName: "Flipkart",
        url: "https://flipkart.com/mock-canvas-under500",
        price: 449,
        isPrimary: true,
      },
      {
        productId: product5.id,
        storeName: "Amazon",
        url: "https://amazon.in/dp/mock-canvas-under500",
        price: 499,
        isPrimary: false,
      }
    ],
  });

  console.log("Created products and affiliate links.");

  // 5. Create Deals
  const deal1 = await prisma.deal.create({
    data: {
      title: "Flat 45% OFF on Fossil Gen 6 Smartwatch",
      slug: "flat-45-off-fossil-gen6",
      description: "Upgrade to premium digital styling with the Fossil Gen 6 Smartwatch. Get Alexa integration, SpO2, and Heart Rate monitoring at an all-time low price.",
      image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&auto=format&fit=crop&q=80",
      discountPercentage: 45,
      originalPrice: 24995,
      dealPrice: 13747,
      storeName: "Amazon",
      affiliateUrl: "https://amazon.in/dp/mock-fossil-deal",
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
      isFeatured: true,
      categoryId: watches.id,
    },
  });

  const deal2 = await prisma.deal.create({
    data: {
      title: "Grab Adidas Originals Stan Smith at 60% OFF",
      slug: "adidas-stan-smith-60-off",
      description: "Get the iconic white/green Adidas Stan Smith leather sneakers at 60% discount during the Mid-Year Sale.",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80",
      discountPercentage: 60,
      originalPrice: 8999,
      dealPrice: 3599,
      storeName: "Myntra",
      affiliateUrl: "https://myntra.com/mock-adidas-deal",
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours from now
      isFeatured: true,
      categoryId: sneakers.id,
    },
  });

  const deal3 = await prisma.deal.create({
    data: {
      title: "Daily Flash Deal: Ergonomic Mesh Chair under ₹4,999",
      slug: "daily-deal-ergonomic-mesh-chair",
      description: "Relieve back pain with high-grade breathable mesh backrest, adjustable headrest, and heavy-duty nylon wheels.",
      image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=400&auto=format&fit=crop&q=80",
      discountPercentage: 55,
      originalPrice: 10999,
      dealPrice: 4949,
      storeName: "Flipkart",
      affiliateUrl: "https://flipkart.com/mock-chair-deal",
      endsAt: new Date(Date.now() + 1000 * 60 * 120), // 2 hours from now
      isFeatured: false,
      categoryId: home.id,
    },
  });

  console.log("Created deals:", [deal1.title, deal2.title, deal3.title]);

  // 6. Create Blogs
  const blog1 = await prisma.blog.create({
    data: {
      title: "Top 5 Luxury-Look Watches Under ₹25,000 (Mechanical Edition)",
      slug: "top-5-luxury-watches-under-25k",
      excerpt: "You don't need a million dollars to look like a millionaire. Here are the best luxury-styled mechanical watches that will turn heads.",
      content: `### Why Mechanical Watches Speak Luxury

There's something inherently artistic about a watch that functions without a battery. The sweep of the second hand, the ticking of the escapement wheel, and the weight of the metal on your wrist are hallmarks of high style. In this guide, we break down our top picks that give you the classic high-end style for under ₹25,000.

#### 1. Seiko 5 Sports Automatic (SBSA005)
A legendary watch from Seiko. With the caliber 4R36 movement, see-through exhibition case back, and iconic dive-watch bezel, it looks right at home beside luxury watches costing five times as much. You can find active deals on it for about ₹22,400.

#### 2. Citizen Tsuyosa Automatic
With vibrant dial choices (tiffany blue, yellow, forest green) and an integrated steel bracelet reminiscent of Swiss sports watches, the Citizen Tsuyosa offers modern elegance.

#### 3. Orient Bambino Gen 2
The ultimate dress watch. Domed mineral crystal, classic Roman numerals, and elegant hands. It is the perfect complement to a beige linen suit.

---

### Tips for Watch Enthusiasts
* **Change the strap:** Placing a high-quality leather strap on an entry-level watch instantly doubles its perceived value.
* **Keep it clean:** A quick wipe down with a microfiber cloth keeps the stainless steel shining.
`,
      coverImage: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&auto=format&fit=crop&q=80",
      tags: ["Watches", "Style Guide", "Affordable Luxury"],
      isPublished: true,
      viewCount: 421,
      categoryId: watches.id,
    },
  });

  const blog2 = await prisma.blog.create({
    data: {
      title: "How to Build a Minimalist Beige & Cream Wardrobe",
      slug: "build-minimalist-beige-cream-wardrobe",
      excerpt: "Unpack the secrets of quiet luxury. Learn how to style earth tones, creams, and beige for an ultra-premium aesthetic.",
      content: `### The Power of Earth Tones

Monochromatic beige and cream styles are sweeping high-fashion centers. These color palettes invoke warmth, cleanliness, and premium relaxation. The key to pulling off this look without looking washed out lies in two principles: **Texture** and **Fit**.

#### Layering Textures
When your outfit relies on a single color family, vary the fabrics:
1. **Linen & Cotton:** A cream linen button-down shirt paired with beige cotton chinos creates visual contrast.
2. **Knitwear:** Throw a textured cable-knit camel sweater over your shoulders for extra dimension.

#### Our Top Recommendations Under Budget
* **The Base:** Start with a Zara Styled Oxford Shirt in Sand Beige. It has a beautiful structured collar and retails for under ₹999.
* **The Footwear:** Clean white or sand leather sneakers (like Adidas Stan Smiths or Nike Air Max) add a contemporary sport finish.
`,
      coverImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
      tags: ["Fashion", "Earth Tones", "Minimalist"],
      isPublished: true,
      viewCount: 652,
      categoryId: fashion.id,
    },
  });

  console.log("Created blogs:", [blog1.title, blog2.title]);

  // 7. Create Comments
  await prisma.comment.create({
    data: {
      content: "Excellent watch guide. The Seiko 5 is indeed a masterpiece!",
      userId: user.id,
      blogId: blog1.id,
    },
  });

  // 8. Create Wishlists
  await prisma.wishlist.create({
    data: {
      userId: user.id,
      productId: product1.id,
    },
  });

  // 9. Add Newsletter Email
  await prisma.newsletter.create({
    data: {
      email: "hello@dealnova.com",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
