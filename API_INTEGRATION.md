# API Integration Documentation

## Overview

This project has been integrated with the Digital Health Assistant API. The integration includes articles and medicines endpoints.

**Base URL:** `https://digitalhealth.apiv1.wyvt.com`

## Setup

### Dependencies

- `axios`: HTTP client for making API requests

### Installation

```bash
npm install axios
```

## Project Structure

```
lib/
├── api-config.ts          # Axios configuration and interceptors
├── types.ts               # TypeScript interfaces for API responses
├── api/
│   ├── index.ts          # Barrel export file
│   ├── articles.ts       # Article API functions
│   └── medicines.ts      # Medicine API functions
```

## API Configuration

The API client is configured in `lib/api-config.ts` with:

- Base URL configuration
- Request/response interceptors
- Automatic token injection from localStorage
- Error handling
- 30-second timeout

## Available API Functions

### Articles API

```typescript
import {
  getAllArticles,
  searchArticles,
  getArticlesByCategory,
  getArticleBySlug,
} from "@/lib/api/articles";

// Get all articles with pagination
const articles = await getAllArticles(page, limit);

// Search articles
const results = await searchArticles(query, page, limit);

// Get articles by category
const categoryArticles = await getArticlesByCategory(category, page, limit);

// Get single article by slug
const article = await getArticleBySlug(slug);
```

### Medicines API

```typescript
import {
  getAllMedicines,
  searchMedicines,
  getMedicineBrands,
  getMedicinesByCategory,
  getMedicinesByBrand,
  getMedicineById,
  getMedicineBySlug,
} from "@/lib/api/medicines";

// Get all medicines with pagination
const medicines = await getAllMedicines(page, limit);

// Search medicines
const results = await searchMedicines(query, page, limit);

// Get all brands
const brands = await getMedicineBrands();

// Get medicines by category
const categoryMeds = await getMedicinesByCategory(category, page, limit);

// Get medicines by brand
const brandMeds = await getMedicinesByBrand(brand, page, limit);

// Get single medicine by ID
const medicine = await getMedicineById(id);

// Get single medicine by slug
const medicine = await getMedicineBySlug(slug);
```

## TypeScript Types

### Article Type

```typescript
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
  author: string;
  readTime: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Medicine Type

```typescript
interface Medicine {
  id: string;
  name: string;
  slug: string;
  genericName: string;
  brand: string;
  category: string;
  description: string;
  dosageForm: string;
  strength: string;
  price: number;
  manufacturer: string;
  prescriptionRequired: boolean;
  sideEffects: string[];
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}
```

### API Response Wrapper

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## Integrated Pages

### 1. Articles List Page (`/articles`)

- Fetches articles from API with pagination
- Search functionality
- Category filtering
- Loading and error states
- Responsive pagination

### 2. Article Detail Page (`/articles/[slug]`)

- Fetches single article by slug
- Displays full content, author, date, tags
- Loading and error states
- Back navigation

### 3. Medicines List Page (`/medicines`)

- Fetches medicines from API with pagination
- Search functionality
- Brand filtering
- Loading and error states
- Responsive grid layout

### 4. Medicine Detail Page (`/medicines/[id]`)

- Fetches single medicine by ID
- Displays comprehensive medicine information
- Side effects and warnings
- User reviews section
- Loading and error states

## Features

### Error Handling

All API calls include comprehensive error handling:

- Network errors
- Server errors (4xx, 5xx)
- Timeout errors
- User-friendly error messages

### Loading States

All pages show loading indicators while fetching data using Lucide's `Loader2` component.

### Pagination

- Page navigation controls
- Page number display
- Responsive to total pages
- Smooth scroll to top on page change

### Search

- Real-time search with Enter key support
- Search button for manual triggering
- Debouncing recommended for production

## Authentication (Future)

The API client is configured to automatically add JWT tokens from localStorage:

```typescript
// After login, store token
localStorage.setItem("authToken", token);

// All subsequent API calls will include:
// Authorization: Bearer <token>
```

## Error Messages

Common error scenarios are handled:

- `Failed to fetch articles/medicines` - Network/server errors
- `Search failed` - Search query errors
- `Article/Medicine not found` - 404 errors
- Custom error messages from API responses

## Next Steps

### Recommended Enhancements

1. **Caching**: Implement React Query or SWR for data caching
2. **Debouncing**: Add debounce to search inputs
3. **Infinite Scroll**: Replace pagination with infinite scroll
4. **Optimistic Updates**: For reviews and user interactions
5. **Image Optimization**: Use Next.js Image component for article/medicine images
6. **SEO**: Add meta tags using Next.js metadata API
7. **Analytics**: Track page views and searches

### Additional API Endpoints to Integrate

Based on the API documentation, you can also integrate:

- User authentication (`/api/users/login`, `/api/users/register`)
- Support tickets (`/api/tickets`)
- AI Meal Planner (`/api/meal-planner`)
- Admin panel endpoints (for admin users)

## Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_API_BASE_URL=https://digitalhealth.apiv1.wyvt.com
```

Update `lib/api-config.ts`:

```typescript
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://digitalhealth.apiv1.wyvt.com";
```

## Testing

Test the integration:

1. Start the development server: `npm run dev`
2. Navigate to `/articles` - should load articles from API
3. Navigate to `/medicines` - should load medicines from API
4. Try search functionality on both pages
5. Click on individual items to test detail pages

## Support

For API issues or questions, refer to:

- API Documentation: `API_DOCUMENTATION.md`
- API Base URL: `https://digitalhealth.apiv1.wyvt.com`
- Email: DigitalHealthAssistance@gmx.com
