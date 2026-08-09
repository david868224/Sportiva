/* ==========================================================================
   SPORTIVA — Catálogo de produtos
   Gera imagens de produto localmente (SVG) para que o portfólio funcione
   sempre, mesmo sem ligação a serviços externos de imagens.
   ========================================================================== */

const CATEGORY_META = {
  futebol:     { label: "Futebol",     emoji: "⚽", color1: "#16A34A", color2: "#166534" },
  fitness:     { label: "Fitness",     emoji: "🏋️", color1: "#166534", color2: "#0F172A" },
  boxe:        { label: "Boxe",        emoji: "🥊", color1: "#0F172A", color2: "#166534" },
  corrida:     { label: "Corrida",     emoji: "🏃", color1: "#22C55E", color2: "#15803D" },
  basquetebol: { label: "Basquetebol", emoji: "🏀", color1: "#166534", color2: "#052e13" },
  tenis:       { label: "Ténis",       emoji: "🎾", color1: "#16A34A", color2: "#0F172A" },
};

/**
 * Gera uma imagem SVG (data URI) para um produto, usando o emoji e as cores
 * da categoria — mantém uma identidade visual coerente em toda a loja.
 */
function generateProductImage(category, emoji, seed = 0) {
  const meta = CATEGORY_META[category] || CATEGORY_META.fitness;
  const icon = emoji || meta.emoji;
  const rot = (seed * 37) % 20 - 10;
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
    <defs>
      <linearGradient id="g${seed}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${meta.color1}"/>
        <stop offset="100%" stop-color="${meta.color2}"/>
      </linearGradient>
    </defs>
    <rect width="500" height="500" fill="${meta.color1}" opacity="0.08"/>
    <rect width="500" height="500" fill="url(#g${seed})" opacity="0.06"/>
    <circle cx="250" cy="250" r="170" fill="url(#g${seed})" opacity="0.16"/>
    <circle cx="250" cy="250" r="120" fill="url(#g${seed})" opacity="0.9"/>
    <text x="250" y="278" font-size="150" text-anchor="middle" transform="rotate(${rot} 250 250)">${icon}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function productImages(category, emoji, seed) {
  return [
    generateProductImage(category, emoji, seed),
    generateProductImage(category, emoji, seed + 1),
    generateProductImage(category, emoji, seed + 2),
  ];
}

const PRODUCTS = [
  {
    id: 1, name: "Bola de Futebol Pro Match", category: "futebol",
    price: 25000, oldPrice: 32000, rating: 4.7, reviews: 128, stock: 24,
    badge: "oferta", sizes: null, popularity: 92,
    description: "Bola de futebol de competição com câmara de látex de alta retenção de ar e costura reforçada. Ideal para treinos intensivos e jogos oficiais em relva natural ou sintética.",
    images: productImages("futebol", "⚽", 1),
  },
  {
    id: 2, name: "Camisola Sportiva Performance", category: "futebol",
    price: 15000, oldPrice: null, rating: 4.5, reviews: 76, stock: 40,
    badge: "novo", sizes: ["S", "M", "L", "XL"], popularity: 70,
    description: "Camisola desportiva em tecido respirável de secagem rápida, com tecnologia anti-odor. Corte atlético para máxima liberdade de movimento durante o treino ou jogo.",
    images: productImages("futebol", "👕", 2),
  },
  {
    id: 3, name: "Chuteiras Sportiva Strike FG", category: "futebol",
    price: 48500, oldPrice: 58000, rating: 4.8, reviews: 203, stock: 15,
    badge: "mais vendido", sizes: ["38", "39", "40", "41", "42", "43", "44"], popularity: 98,
    description: "Chuteiras de piso firme com pisos multidireccionais para tracção explosiva. Cabedal sintético leve que se adapta ao pé, garantindo controlo de bola superior.",
    images: productImages("futebol", "👟", 3),
  },
  {
    id: 4, name: "Luvas de Guarda-Redes Guardian", category: "futebol",
    price: 18500, oldPrice: null, rating: 4.4, reviews: 54, stock: 22, badge: null,
    sizes: ["7", "8", "9", "10"], popularity: 58,
    description: "Luvas com espuma de látex de alta aderência mesmo em condições de humidade. Punho ajustável com fecho de velcro para maior segurança.",
    images: productImages("futebol", "🧤", 4),
  },
  {
    id: 5, name: "Halteres Emborrachados 2x5kg", category: "fitness",
    price: 22000, oldPrice: null, rating: 4.6, reviews: 89, stock: 30, badge: "novo",
    sizes: null, popularity: 80,
    description: "Par de halteres com revestimento emborrachado anti-deslize e núcleo de ferro fundido. Pega ergonómica sextavada que evita que rolem no chão.",
    images: productImages("fitness", "🏋️", 5),
  },
  {
    id: 6, name: "Tapete de Exercício Premium", category: "fitness",
    price: 17500, oldPrice: 21000, rating: 4.5, reviews: 142, stock: 50, badge: "oferta",
    sizes: null, popularity: 88,
    description: "Tapete antiderrapante de 8mm com espuma de alta densidade para conforto nas articulações. Ideal para yoga, pilates e treino funcional.",
    images: productImages("fitness", "🧘", 6),
  },
  {
    id: 7, name: "Corda de Saltar Speed Rope", category: "fitness",
    price: 9500, oldPrice: null, rating: 4.3, reviews: 61, stock: 60, badge: null,
    sizes: null, popularity: 45,
    description: "Corda de saltar com rolamentos de alta velocidade e cabo de aço revestido, ajustável ao comprimento ideal para o teu treino cardiovascular.",
    images: productImages("fitness", "🪢", 7),
  },
  {
    id: 8, name: "Kit de Treino Funcional Total", category: "fitness",
    price: 35000, oldPrice: 42000, rating: 4.7, reviews: 97, stock: 18, badge: "mais vendido",
    sizes: null, popularity: 95,
    description: "Kit completo com bandas de resistência, argolas e faixas ajustáveis para treino funcional em casa ou no ginásio. Inclui saco de transporte.",
    images: productImages("fitness", "💪", 8),
  },
  {
    id: 9, name: "Luvas de Boxe Sportiva Power", category: "boxe",
    price: 28000, oldPrice: null, rating: 4.6, reviews: 73, stock: 26, badge: "novo",
    sizes: ["10oz", "12oz", "14oz", "16oz"], popularity: 72,
    description: "Luvas de boxe em couro sintético de alta durabilidade com espuma multicamada para absorção de impacto e protecção máxima dos punhos.",
    images: productImages("boxe", "🥊", 9),
  },
  {
    id: 10, name: "Saco de Boxe Sportiva 120cm", category: "boxe",
    price: 75000, oldPrice: 89000, rating: 4.8, reviews: 112, stock: 8, badge: "oferta",
    sizes: null, popularity: 90,
    description: "Saco de pancada reforçado com enchimento denso e uniforme. Corrente de suspensão giratória incluída para maior liberdade de movimento.",
    images: productImages("boxe", "🥋", 10),
  },
  {
    id: 11, name: "Ligaduras de Boxe Elásticas", category: "boxe",
    price: 6500, oldPrice: null, rating: 4.2, reviews: 38, stock: 70, badge: null,
    sizes: null, popularity: 35,
    description: "Ligaduras elásticas de 4,5m para proteção dos pulsos e nós dos dedos durante o treino de boxe ou kickboxing. Fecho de velcro resistente.",
    images: productImages("boxe", "🎗️", 11),
  },
  {
    id: 12, name: "Garrafa Desportiva Sportiva Flow 1L", category: "corrida",
    price: 6500, oldPrice: null, rating: 4.4, reviews: 156, stock: 90, badge: null,
    sizes: null, popularity: 63,
    description: "Garrafa desportiva livre de BPA, com marcações de volume e bico anti-fugas. Leve e resistente, perfeita para acompanhar-te em qualquer treino.",
    images: productImages("corrida", "🍶", 12),
  },
  {
    id: 13, name: "Mochila Desportiva Sportiva Trail 25L", category: "corrida",
    price: 32000, oldPrice: 38500, rating: 4.6, reviews: 84, stock: 20, badge: "oferta",
    sizes: null, popularity: 77,
    description: "Mochila desportiva com compartimento ventilado para calçado, bolso para hidratação e tecido resistente à água. Ideal para treino ou viagem.",
    images: productImages("corrida", "🎒", 13),
  },
  {
    id: 14, name: "Cinto Porta-Objetos para Corrida", category: "corrida",
    price: 8500, oldPrice: null, rating: 4.1, reviews: 29, stock: 45, badge: "novo",
    sizes: null, popularity: 40,
    description: "Cinto leve e ajustável com bolsos elásticos para telemóvel, chaves e gel energético. Não desliza mesmo durante corridas de longa distância.",
    images: productImages("corrida", "🏃", 14),
  },
  {
    id: 15, name: "Ténis de Corrida Sportiva Air Runner", category: "corrida",
    price: 45000, oldPrice: 52000, rating: 4.8, reviews: 231, stock: 33, badge: "mais vendido",
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"], popularity: 99,
    description: "Ténis de corrida com entressola de espuma reativa e câmara de ar para amortecimento superior. Malha respirável que se adapta ao formato do pé.",
    images: productImages("corrida", "👟", 15),
  },
  {
    id: 16, name: "Bola de Basquetebol Sportiva Court", category: "basquetebol",
    price: 27000, oldPrice: null, rating: 4.5, reviews: 68, stock: 28, badge: null,
    sizes: null, popularity: 66,
    description: "Bola de basquetebol em couro sintético com aderência superior em qualquer condição, mantendo o ressalto consistente dentro e fora de portas.",
    images: productImages("basquetebol", "🏀", 16),
  },
  {
    id: 17, name: "Camisola de Basquetebol Sportiva Team", category: "basquetebol",
    price: 16500, oldPrice: 19500, rating: 4.3, reviews: 41, stock: 35, badge: "oferta",
    sizes: ["S", "M", "L", "XL"], popularity: 52,
    description: "Camisola sem mangas em tecido leve e respirável, com decote em V e acabamento reforçado nas costuras para maior durabilidade em jogo.",
    images: productImages("basquetebol", "🏀", 17),
  },
  {
    id: 18, name: "Raquete de Ténis Sportiva Ace Pro", category: "tenis",
    price: 39500, oldPrice: null, rating: 4.6, reviews: 57, stock: 16, badge: "novo",
    sizes: null, popularity: 74,
    description: "Raquete de ténis em grafite leve com equilíbrio ideal entre potência e controlo. Grip ergonómico que reduz a vibração no impacto.",
    images: productImages("tenis", "🎾", 18),
  },
  {
    id: 19, name: "Bolas de Ténis Sportiva Match (Pack 3)", category: "tenis",
    price: 7500, oldPrice: null, rating: 4.2, reviews: 33, stock: 80, badge: null,
    sizes: null, popularity: 30,
    description: "Pack de 3 bolas de ténis com feltro de alta durabilidade e pressão consistente, aprovadas para treino e competição amadora.",
    images: productImages("tenis", "🎾", 19),
  },
  {
    id: 20, name: "Ténis de Court Sportiva Grip Zero", category: "tenis",
    price: 41000, oldPrice: 47000, rating: 4.7, reviews: 89, stock: 12, badge: "oferta",
    sizes: ["38", "39", "40", "41", "42", "43", "44"], popularity: 81,
    description: "Calçado específico para court com sola em padrão herringbone para tracção multidireccional e reforço lateral para travagens rápidas.",
    images: productImages("tenis", "👟", 20),
  },
];

/* ---------------- Helpers ---------------- */

function formatKz(value) {
  return new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 }).format(value) + " Kz";
}

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

function getRelatedProducts(product, count = 4) {
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, count);
}

function renderStars(rating) {
  const full = Math.round(rating);
  let icons = "";
  for (let i = 1; i <= 5; i++) icons += i <= full ? "★" : "☆";
  return icons;
}

function badgeLabel(badge) {
  if (badge === "novo") return "Novo";
  if (badge === "oferta") return "Oferta";
  if (badge === "mais vendido") return "Mais vendido";
  return "";
}

function badgeClass(badge) {
  if (badge === "novo") return "badge-novo";
  if (badge === "oferta") return "badge-oferta";
  if (badge === "mais vendido") return "badge-maisvendido";
  return "";
}
