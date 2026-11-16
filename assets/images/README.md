# Photography slots

The page ships with original line-art illustrations so it renders with no external image dependencies.
To use real dog lifestyle photography, drop JPG files here with these exact names, then set
`USE_PHOTOS = true` at the top of `js/script.js`:

| File                    | Used in                     | Suggested crop        |
| ----------------------- | --------------------------- | --------------------- |
| `hero-main.jpg`         | Hero, large frame           | 4:5 portrait          |
| `hero-detail.jpg`       | Hero, small overlapping     | 1:1 square            |
| `collection-walk.jpg`   | Collection: Walking         | tall portrait         |
| `collection-rest.jpg`   | Collection: Beds & Comfort  | 16:9 landscape        |
| `collection-play.jpg`   | Collection: Toys & Play     | 1:1 square            |
| `collection-feed.jpg`   | Collection: Feeding         | 3:4 portrait          |
| `campaign.jpg`          | Lifestyle campaign          | 4:5 portrait          |

Each photo is placed over its illustration with `object-fit: cover`, so the illustration stays as the fallback.
