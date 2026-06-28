# ElectroMelilla website

Static professional website for electricity and plumbing services in Melilla.

## Pages

- `index.html`: main landing page
- `gallery.html`: public work gallery
- `add.html`: hidden local page to add job photos. It is not linked from the public menu.
- `works-data.js`: permanent gallery data. Use image paths like `IMAGE/file-name.jpg`.
- `IMAGE/`: folder for real job photos.

The hidden add page creates a local preview and generates code for `works-data.js`. For public/published photos, put the image file in `IMAGE/` and paste the generated object into `works-data.js`.
