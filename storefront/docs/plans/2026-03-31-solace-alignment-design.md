# Solace Alignment Design

## Goal

Bring the current storefront visually and functionally in line with `solace-medusa-starter`, without Strapi CMS. All Strapi-driven content is replaced with static config or Medusa API data.

## Approach

Copy components directly from `solace-medusa-starter`, replacing Strapi data sources with:
- Static config file (`src/lib/config/home.ts`) for Hero and Mid Banner
- Medusa API for collections and products
- Local MDX files for blog content

---

## Section 1: Homepage

### Current state
- Blank / no hero banner
- No collections section
- No product carousel
- No blog preview

### Target state
| Block | Data source |
|-------|-------------|
| Hero Banner | `src/lib/config/home.ts` (static image URL + headline + CTA) |
| Collections grid | Medusa `getCollectionsList()` — first image from collection's products |
| Product Carousel | Medusa `getProductsList()` — already implemented |
| Mid Banner | `src/lib/config/home.ts` (static) |
| Blog "Get inspired" | Local `content/blog/*.mdx` via `getAllPosts()` |

### Files to create/modify
- `src/lib/config/home.ts` — static banner content
- `src/app/[countryCode]/(main)/page.tsx` — homepage orchestration
- `src/modules/home/components/hero/index.tsx`
- `src/modules/home/components/banner/index.tsx`
- `src/modules/home/components/collections/index.tsx`
- `src/modules/home/components/explore-blog/index.tsx`

---

## Section 2: Navigation

### Current state
- Simple top bar: logo + cart button
- No category/collection dropdown menus
- No profile button

### Target state
- Sticky top nav matching solace layout
- Desktop: `Navigation` with hover dropdowns for Shop (categories) and Collections
- `CollectionsMenu`: shows Medusa collections as simple list (no Strapi images)
- `SideMenu`: mobile hamburger with same links
- `ProfileButton` + `ProfileDropdown` with theme switcher
- `CartButton` unchanged

### Files to create
- `src/modules/layout/templates/nav/nav-content.tsx`
- `src/modules/layout/templates/nav/nav-actions.tsx`
- `src/modules/layout/templates/nav/navigation.tsx`
- `src/modules/layout/templates/nav/dropdown-menu.tsx`
- `src/modules/layout/templates/nav/collections-menu.tsx`
- `src/modules/layout/components/profile-button/index.tsx`
- `src/modules/layout/components/profile-dropdown/index.tsx`
- `src/lib/constants.ts` — `createNavigation()` helper

---

## Section 3: Loading States

Add `loading.tsx` skeleton screens to all browsable routes.

### Files to create
- `src/app/[countryCode]/(main)/store/loading.tsx`
- `src/app/[countryCode]/(main)/blog/loading.tsx`
- `src/app/[countryCode]/(main)/categories/[...category]/loading.tsx`
- `src/app/[countryCode]/(main)/collections/[handle]/loading.tsx`
- `src/app/[countryCode]/(main)/results/[query]/loading.tsx`

---

## Section 4: Password Reset UI

### Current state
- No reset password route

### Target state
- `/[countryCode]/reset-password?token=...&email=...` page
- Form: new password + confirm password fields
- On submit: call Medusa `/auth/customer/emailpass/update` (token from query)
- No email sending (no SendGrid configured)

### Files to create
- `src/app/[countryCode]/(main)/reset-password/page.tsx`
- `src/modules/account/components/reset-password-form/index.tsx`

---

## Section 5: Breadcrumbs + Category/Collection Layouts

### Files to create
- `src/modules/common/components/breadcrumbs/index.tsx`
- `src/app/[countryCode]/(main)/categories/[...category]/layout.tsx`
- `src/app/[countryCode]/(main)/collections/[handle]/layout.tsx`

---

## Section 6: Checkout Layout

### Files to create
- `src/modules/layout/templates/checkout-nav/index.tsx`
- `src/modules/layout/templates/checkout-footer/index.tsx`
- Update `src/app/[countryCode]/(checkout)/layout.tsx`

---

## Out of Scope

- Strapi CMS integration
- Meilisearch / search UI changes
- E2E tests
- Email sending for password reset
