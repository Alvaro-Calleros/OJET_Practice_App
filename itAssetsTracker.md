# Office IT Inventory - Oracle JET MVP Plan

**Purpose:** A very small Oracle JET front-end practice app to show basic comfort with JET routing, ViewModels, data providers, table rendering, dialogs/forms, and one chart.

**Scope:** Super MVP. One local data array, one chart, one table, simple CRUD.

**Data layer:** Fully simulated. There is no backend. All data lives in `src/js/data/mockData.js`.

**Source/build note:** Edit files in `src/`. The `web/` folder is generated/staged output from `ojet build web` or `ojet serve web`.

---

## 1. MVP Concept

The app tracks office IT stock counts, not individual asset assignment.

The app does not track:

- employees
- assigned assets
- serial numbers
- repair status
- audit logs
- asset history
- multiple workflow states

The app only tracks:

- item name
- category
- quantity
- minimum stock threshold
- location

This keeps the data model simple enough for a frontend/OJET demo while still looking like a practical inventory screen.

---

## 2. Final MVP Screens

Keep the existing Oracle JET app shell and use four simple routes:

| Visible Tab | Route | MVP Behavior |
|---|---|---|
| Dashboard | `dashboard` | Shows summary numbers and one chart |
| Stock | `assets` | Main CRUD table for stock items |
| Low Stock | `employees` | Simple filtered view of low-stock items |
| About | `history` | Short placeholder/about screen |

Route names can stay as-is internally for speed. Visible labels should match the MVP.

---

## 3. Data Model

Use one object shape only:

```js
{
  id: "ITM-001",
  name: "Laptop",
  category: "Computer",
  quantity: 12,
  minimumStock: 3,
  location: "IT Storage"
}
```

Seed sample rows:

```js
[
  { id: "ITM-001", name: "Laptop", category: "Computer", quantity: 12, minimumStock: 3, location: "IT Storage" },
  { id: "ITM-002", name: "Monitor", category: "Display", quantity: 8, minimumStock: 2, location: "IT Storage" },
  { id: "ITM-003", name: "Keyboard", category: "Peripheral", quantity: 15, minimumStock: 5, location: "Supply Closet" },
  { id: "ITM-004", name: "Mouse", category: "Peripheral", quantity: 18, minimumStock: 5, location: "Supply Closet" },
  { id: "ITM-005", name: "USB-C Dock", category: "Docking", quantity: 4, minimumStock: 3, location: "IT Storage" },
  { id: "ITM-006", name: "Headset", category: "Audio", quantity: 2, minimumStock: 3, location: "Supply Closet" },
  { id: "ITM-007", name: "Phone", category: "Mobile", quantity: 3, minimumStock: 2, location: "IT Storage" }
]
```

---

## 4. Mock Data Helpers

Replace the current asset/employee/log helpers with simple stock helpers:

```js
getItems()
getItemById(id)
addItem(item)
updateItem(id, data)
deleteItem(id)
getLowStockItems()
getSummary()
getUnitsByCategory()
```

Suggested helper behavior:

```js
getSummary() -> {
  totalItemTypes,
  totalUnits,
  lowStockCount,
  outOfStockCount
}
```

```js
getUnitsByCategory() -> [
  { id: "Computer", series: "Computer", group: "Units", value: 12 },
  { id: "Peripheral", series: "Peripheral", group: "Units", value: 33 }
]
```

No logs. No employee lookup. No assignment helper.

---

## 5. Stock Page

Use the existing `assets` route and files, but make the visible page a Stock screen.

Files:

- `src/js/views/assets.html`
- `src/js/viewModels/assets.js`

Table columns:

```text
ID | Name | Category | Quantity | Minimum | Location | Actions
```

Dialog fields:

```text
Name
Category
Quantity
Minimum Stock
Location
```

Actions:

- Add Item
- Edit
- Delete
- Save
- Cancel

Validation:

- Name is required.
- Category is required.
- Quantity is required and should be numeric.
- Minimum Stock is required and should be numeric.
- Location is optional for MVP.

Important JET component note:

- Do not import `ojs/ojtextarea` for this MVP.
- The current app hit a runtime error because `js/libs/oj/20.1.2/debug/ojtextarea.js` returned 404.
- For MVP, remove the Notes field entirely. If text area is needed later, first verify the correct JET module for this installed version.

---

## 6. Dashboard

Dashboard should show summary cards and one chart.

Summary cards:

```text
Total Item Types
Total Units
Low Stock Items
Out of Stock Items
```

Chart:

```text
Units by Category
```

Use one `oj-chart`.

The existing dashboard composite can be simplified instead of replaced:

- keep `my-dropdown-with-chart` if that is faster
- remove the dropdown if it adds complexity
- keep only one chart
- chart data should come from `mockData.getUnitsByCategory()`

Files:

- `src/js/views/dashboard.html`
- `src/js/viewModels/dashboard.js`
- `src/js/jet-composites/my-dropdown-with-chart/*`, if reusing the composite

---

## 7. Low Stock Page

Use the existing `employees` route as a simple filtered page.

Visible label:

```text
Low Stock
```

Behavior:

- Display items where `quantity <= minimumStock`.
- A simple table or list is enough.
- No editing required here for MVP.

Files:

- `src/js/views/employees.html`
- `src/js/viewModels/employees.js`

---

## 8. About Page

Use the existing `history` route as a simple placeholder/about page.

Visible label:

```text
About
```

Behavior:

- Static text is enough.
- Mention that this is a local Oracle JET demo using simulated data.

Files:

- `src/js/views/history.html`
- `src/js/viewModels/history.js`

---

## 9. Navigation Labels

Update `src/js/appController.js` visible labels:

```js
Dashboard
Stock
Low Stock
About
```

Update app title:

```js
Office IT Inventory
```

Internal route names may stay:

```js
dashboard
assets
employees
history
```

Keeping internal route names avoids unnecessary file renames.

---

## 10. Implementation Order

1. Replace `mockData.js` with the simple stock data model and helpers.
2. Simplify `assets.js` and `assets.html` into the Stock CRUD screen.
3. Remove the `ojs/ojtextarea` import and Notes field.
4. Update navigation labels and app title.
5. Simplify dashboard to one chart using `getUnitsByCategory()`.
6. Build the Low Stock page from `getLowStockItems()`.
7. Make About a static placeholder.
8. Run `ojet build web`.
9. Start `ojet serve web --server-port=8000 --server-only` and manually click:
   - Dashboard
   - Stock
   - Add Item
   - Edit Item
   - Delete Item
   - Low Stock

---

## 11. OJET Commands

Use the local Windows wrapper:

```powershell
.\node_modules\.bin\ojet.cmd build web
.\node_modules\.bin\ojet.cmd serve web --server-port=8000
.\node_modules\.bin\ojet.cmd serve web --server-port=8000 --server-only
.\node_modules\.bin\ojet.cmd clean
```

Create a local composite component later only if needed:

```powershell
.\node_modules\.bin\ojet.cmd create component stock-summary-chart
.\node_modules\.bin\ojet.cmd build component stock-summary-chart
```

For MVP, avoid creating new components unless the existing dashboard composite becomes harder to simplify than replace.

---

## 12. Success Criteria

The MVP is done when:

- The app title says `Office IT Inventory`.
- Dashboard shows summary numbers and one chart.
- Stock page shows one table.
- Stock page can add, edit, and delete stock items.
- Low Stock page shows only low-stock rows.
- No runtime error appears for `ojs/ojtextarea`.
- `ojet build web` succeeds.

