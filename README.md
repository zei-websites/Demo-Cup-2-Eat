# Cup2Eat website

Open `index.html` in a browser (or host the folder on any static host).

- `css/style.css`  all styles (rem based, mobile first, dark mode)
- `js/app.js`      menu, cart, OTP login, QR payment, admin
- `images/`        logo and food photos

## Edit quickly (top of js/app.js)
- `MAP_Q`       shop address for Google Maps
- `ADMIN_PASS`  admin password (open `index.html#admin`)
- `DEF`         menu items and prices

## Demo mode vs production
Right now data is saved in the browser (localStorage) and OTP is shown on screen.
For a live shop connect a backend: replace `ld/sv` (orders, menu, QR), the OTP step
(`#so` / `#vo` handlers) and `mail()` (delivery confirmation email).
