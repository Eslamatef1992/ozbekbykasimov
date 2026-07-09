// Simple emoji fallback for category icons until real icon/photo assets are
// pulled from Figma. Keyed by category slug.
const ICONS = {
  salad: '🥗',
  juice: '🧃',
  rice: '🍚',
  chicken: '🍗',
  meat: '🥩',
  fish: '🐟',
  pasta: '🍝',
  soup: '🍲',
  desserts: '🍰',
  drinks: '🥤',
};

export default function categoryIcon(slug) {
  return ICONS[slug] || '🍽️';
}
