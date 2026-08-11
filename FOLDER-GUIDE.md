# Folder guide

```
Wellnesscurecare/
├── package.json                 # Root commands: run/build the frontend
├── README.md                    # Setup instructions
└── frontend/
    ├── package.json             # Frontend dependencies (React, Vite, Three.js)
    ├── package-lock.json        # Locked dependency versions; keep this file
    ├── index.html               # HTML entry page
    └── src/
        ├── App.jsx              # Current complete homepage
        ├── main.jsx             # React startup file
        ├── 3d/                  # Future 3D scene files
        ├── components/          # Future reusable UI components
        ├── pages/               # Future route/page files
        ├── styles/
        │   └── global.css       # All homepage styling
        └── utils/               # Future shared helpers/data
```

There are **two `package.json` files by design**:

- `Wellnesscurecare/package.json` — lets you run `npm run frontend` and `npm run frontend:build` from the root.
- `Wellnesscurecare/frontend/package.json` — contains the React/Vite/Three.js dependencies required by the website.

Keep both files in their shown folders. Do not place either inside `src/`.
