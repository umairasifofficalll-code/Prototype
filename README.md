# Lahore Digital — website prototypes

A studio homepage plus three concept sites for Lahore local businesses. Plain HTML, CSS and JavaScript — no build step and no framework.

## Pages

- `index.html` — the Lahore Digital studio homepage, with three interactive demos (`home.css`, `home.js`).
- `restaurant.html` — a menu-led charcoal-grill restaurant concept.
- `salon.html` — an appointment-led hair studio concept.
- `garage.html` — an inspection and repair concept.

The three concept pages share `styles.css` and `demos.js`.

## Homepage features

- **Interactive demos** that build a ready-to-send WhatsApp message as you use them:
  - Restaurant: add dishes with quantity buttons, pick a spice level and table, see a running subtotal.
  - Salon: choose a treatment, stylist, day and an open time slot (some slots show as booked).
  - Auto workshop: choose the car and symptoms, mark urgency, optionally attach a Google Maps location.
- **Lead form** that checks the Pakistani mobile number and opens WhatsApp with the enquiry filled in.
- **Light and dark themes** that follow the visitor's system setting and remember their choice.
- Mobile menu, keyboard-accessible demo dialog (Esc closes it), reduced-motion support, and SEO and social-sharing metadata.

## Before publishing

1. **Replace the placeholder WhatsApp number.** Edit the `STUDIO` settings at the top of `home.js`:
   ```js
   const STUDIO = {
     whatsapp: '923001234567',   // digits only, starting with 92
     display: '+92 300 1234567',
     name: 'Lahore Digital'
   };
   ```
   All WhatsApp links, the call button and the displayed number use these values.
2. Check the studio address in the contact section of `index.html`.
3. On the concept pages, the forms open email drafts to reserved `example.com` addresses — replace them with real ones if you use those pages.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

To publish free on GitHub Pages: repository **Settings → Pages → Deploy from a branch → `main` / root**.

## Notes

These are demonstrations, not real client websites. All business names, addresses, menus, prices, hours and images are illustrative. Images were generated for these prototypes and do not depict actual businesses. Replace them with each prospect's approved details before presenting or publishing.
