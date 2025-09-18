# Image Resizing API

An Express + TypeScript API that resizes images on demand and caches results for faster subsequent access.  
Implemented for the Udacity Image Processing API project.

---

## Prerequisites
- Node.js ≥ 18  
- npm ≥ 9

---

## Setup
```bash
# install dependencies
npm install
```

---

## NPM Scripts
```json
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "start": "node build/server.js",
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "test": "npm run build && jasmine",
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  }
}
```

---

## How to Run
- **Development** (watch mode):
```bash
npm run dev
```

- **Production build + start**:
```bash
npm run build
npm start
```

- App runs on: **http://localhost:3000**

---

## Endpoint Documentation

### `GET /api/images`
Resize or convert an image and return the processed result. If the same request was made before, the cached version is returned.

**Query Parameters:**
| Name      | Description |
|-----------|-------------|
| `filename`| Source image name from `assets/full/` (e.g. `fjord.jpg`) |
| `width`   | Desired width in pixels (positive integer) |
| `height`  | Desired height in pixels (positive integer) |
| `format`  | Output format: `jpg`, `jpeg`, `png`, `webp`, `avif` (default: same as source) |

**Example success:**
```
GET /api/images?filename=fjord.jpg&width=300&height=200&format=webp
```
Response: `200 OK` (resized image)

**Example error (missing param):**
```
GET /api/images?filename=fjord.jpg&width=300
```
Response: `400 Bad Request`

**Example error (file not found):**
```
GET /api/images?filename=notfound.jpg&width=200&height=200
```
Response: `404 Not Found`

---

## Validation & Error Handling
- **400 Bad Request** → missing/invalid parameters.  
- **404 Not Found** → image file does not exist.  

---

## Caching Behavior
- First request: processes image with Sharp and saves it in `assets/thumbs/`.  
- Subsequent identical requests: return cached file instantly.  

---

## Project Structure
```
.
├─ src/
│  ├─ app.ts
│  ├─ server.ts
│  ├─ routes/images.ts
│  ├─ utils/
│  │  ├─ filePaths.ts
│  │  ├─ ensureDir.ts
│  │  └─ imageProcess.ts
│  └─ middlewares/validateParams.ts
├─ assets/
│  ├─ full/      # input images
│  └─ thumbs/    # cached resized images
├─ build/        # compiled JS output
├─ tests/        # Jasmine + SuperTest
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## Additional Notes / Other Functionality
- **Logging:** requests logged with `morgan('dev')`.  
- **Type Safety:** full TypeScript support.  
- **Testing:** Jasmine + SuperTest (`npm test`).  
- **Performance:** Sharp (libvips) for fast, memory-efficient processing.  
- **Extensible:** can add more Sharp options (fit, position, quality).  

---

## References
- [Express Docs](https://expressjs.com/)  
- [Sharp Docs](https://sharp.pixelplumbing.com/)  
- [TypeScript Docs](https://www.typescriptlang.org/docs/)  
- [Jasmine](https://jasmine.github.io/)  
- [SuperTest](https://github.com/ladjs/supertest)  
