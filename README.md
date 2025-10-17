# React DataGrid (No Third-Party Libraries)

A lightweight, **spreadsheet-like DataGrid** built entirely with **React + Vite (JavaScript only)** — no external libraries.  
Supports **editing, row/column expansion, drag selection, copy/cut/paste**, and **auto-expanding grid** when pasting larger ranges (even from Excel or Google Sheets).

## 🚀 Features
- Editable cells (double-click or Enter)
- Add Row / Add Column dynamically
- Mouse drag rectangular selection
- Copy / Cut / Paste (Ctrl + C / X / V)
- Paste auto-expands grid for overflow
- Supports Excel/Sheets tab-separated data
- Keyboard navigation (arrows, Tab, Enter)
- Auto-growing cell height for large text
- Lightweight — no third-party libraries

## ⚙️ Setup Instructions
1. **Create the app (if not yet done)**
   ```bash
   npm create vite@latest react-datagrid-app -- --template react
   cd react-datagrid-app
   ```

2. **Replace the default source files**
   Copy the `src/` folder and `index.css` provided here into your project.

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to the URL printed in the terminal (usually http://localhost:5173)

6. **Build for production**
   ```bash
   npm run build
   ```

## 🧩 Data Model Explanation

### 1. Rows and Columns
```js
rows = ["R1", "R2", "R3", ...];
cols = ["C1", "C2", "C3", ...];
```
These arrays represent row labels and column headers, expanding dynamically when adding or pasting data.

### 2. Cell Data
```js
cells = { "0,0": "Hello", "1,2": "World" };
```
Each key is `"r,c"` where `r` = row index and `c` = column index.

### 3. Selection Model
```js
selection = { start: { r: 1, c: 2 }, end: { r: 3, c: 4 } };
```
Defines the rectangular selection used for highlighting, copying, and pasting.

### 4. Expansion Logic
Automatically expands grid size when data exceeds bounds:
```js
ensureSize(minRows, minCols);
```

## 🧮 User Interactions

| Action | Behaviour |
|--------|------------|
| Double-click Cell | Enter edit mode |
| Enter / Esc | Save / Cancel edit |
| Click-Drag | Select rectangular range |
| Ctrl + C / X / V | Copy / Cut / Paste data |
| Arrow Keys / Tab | Move between cells |
| Add Row / Column | Extend grid manually |
| External Paste | Handles Excel/Sheets content |

## 🎨 Styling
- Headers → light red background  
- Labels → light green background  
- Cells → white, blue outline when selected  
- Scrollable container with subtle shadow

## 🧠 Design Philosophy
- Simple, fast DOM (no virtualisation needed)
- Clear component structure:
  - `App.jsx`: state + clipboard logic
  - `Grid.jsx`: rendering + selection
  - `Cell.jsx`: editing + keyboard control
- Memoised cells to reduce re-renders

## 🔬 Test Cases

| Scenario | Expected Result |
|-----------|----------------|
| Edit a cell | Value updates |
| Add row/column | Structure expands |
| Copy/paste block | Works like Excel |
| Paste near end | Auto-expands grid |
| Long text | Cell height adjusts |
| Selection after paste | Highlights pasted area |

## ☁️ Deployment (Vercel)
1. Push your project to GitHub.
2. Go to [Vercel](https://vercel.com/), import your repo.
3. Build Command: `npm run build`
4. Output Directory: `dist`

## 🧱 Limitations / Future Enhancements
- Undo / Redo not implemented
- No resizable columns or context menu
- No multi-sheet support yet

## 📜 License
MIT License — free to use, modify, and distribute.
