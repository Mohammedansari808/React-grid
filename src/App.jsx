import React, { useCallback, useEffect, useRef, useState } from "react";
import Grid from "./Grid";
import Navbar from "./Navbar";

const defaultRows = 6;
const defaultCols = 5;

function makeLabels(n, prefix = "R") {
  return Array.from({ length: n }, (_, i) => `${prefix}${i + 1}`);
}
function makeHeaders(n, prefix = "C") {
  return Array.from({ length: n }, (_, i) => `${prefix}${i + 1}`);
}

export default function App() {
  const [rows, setRows] = useState(() => makeLabels(defaultRows));
  const [cols, setCols] = useState(() => makeHeaders(defaultCols));
  const [cells, setCells] = useState(() => ({}));
  const [selection, setSelection] = useState(null);
  const clipboardRef = useRef(null);

  const cellSetter = useCallback((r, c, val) => {
    setCells((prev) => {
      const copy = { ...prev };
      const key = `${r},${c}`;
      if (!val) delete copy[key];
      else copy[key] = val;
      return copy;
    });
  }, []);

  const addRow = useCallback((e) => {
    e.preventDefault();
    setRows((prev) => [...prev, `R${prev.length + 1}`]);
  }, []);
  const addCol = useCallback((e) => {
    e.preventDefault();

    setCols((prev) => [...prev, `C${prev.length + 1}`]);
  }, []);

  // ✅ Ensure size without duplicating names
  const ensureSize = useCallback((minR, minC) => {
    setRows((prev) => {
      const needed = minR - prev.length;
      if (needed > 0) {
        return [
          ...prev,
          ...Array.from({ length: needed }, (_, i) => `R${prev.length + i + 1}`),
        ];
      }
      return prev;
    });
    setCols((prev) => {
      const needed = minC - prev.length;
      if (needed > 0) {
        return [
          ...prev,
          ...Array.from({ length: needed }, (_, i) => `C${prev.length + i + 1}`),
        ];
      }
      return prev;
    });
  }, []);

  // ✅ Copy / Cut / Paste handlers
  useEffect(() => {
    function onCopy(e) {
      if (!selection) return;
      e.preventDefault();
      const { start, end } = selection;
      const r1 = Math.min(start.r, end.r),
        r2 = Math.max(start.r, end.r);
      const c1 = Math.min(start.c, end.c),
        c2 = Math.max(start.c, end.c);

      const rowsData = [];
      for (let r = r1; r <= r2; r++) {
        const rowVals = [];
        for (let c = c1; c <= c2; c++) {
          rowVals.push(cells[`${r},${c}`] ?? "");
        }
        rowsData.push(rowVals.join("\t"));
      }
      const text = rowsData.join("\n");
      e.clipboardData.setData("text/plain", text);
      clipboardRef.current = text;
    }

    function onCut(e) {
      onCopy(e);
      if (!selection) return;
      const { start, end } = selection;
      const r1 = Math.min(start.r, end.r),
        r2 = Math.max(start.r, end.r);
      const c1 = Math.min(start.c, end.c),
        c2 = Math.max(start.c, end.c);
      setCells((prev) => {
        const copy = { ...prev };
        for (let r = r1; r <= r2; r++)
          for (let c = c1; c <= c2; c++) delete copy[`${r},${c}`];
        return copy;
      });
    }

    function parsePlainTextToGrid(text) {
      return text
        .replace(/\r/g, "")
        .split("\n")
        .map((r) => r.split("\t"));
    }

    async function onPaste(e) {
      e.preventDefault();
      const raw = e.clipboardData.getData("text/plain");
      if (!raw) return;
      const parsed = parsePlainTextToGrid(raw);
      const rCount = parsed.length;
      const cCount = parsed[0]?.length ?? 0;

      const target = selection ? selection.start : { r: 0, c: 0 };
      ensureSize(target.r + rCount, target.c + cCount);

      setCells((prev) => {
        const copy = { ...prev };
        for (let i = 0; i < rCount; i++) {
          for (let j = 0; j < cCount; j++) {
            const val = parsed[i][j];
            const key = `${target.r + i},${target.c + j}`;
            if (val) copy[key] = val;
            else delete copy[key];
          }
        }
        return copy;
      });

      // ✅ highlight new area
      setSelection({
        start: { r: target.r, c: target.c },
        end: { r: target.r + rCount - 1, c: target.c + cCount - 1 },
      });
    }

    window.addEventListener("copy", onCopy);
    window.addEventListener("cut", onCut);
    window.addEventListener("paste", onPaste);
    return () => {
      window.removeEventListener("copy", onCopy);
      window.removeEventListener("cut", onCut);
      window.removeEventListener("paste", onPaste);
    };
  }, [selection, cells, ensureSize]);

  const valueAt = useCallback((r, c) => cells[`${r},${c}`] ?? "", [cells]);

  return (
    <div className="app " style={{padding : '10px 20px',height : '100vh'}} >
      <Navbar />
      <div className="flex justify-center gap-[20px]">
          <a className="rainbow-button" onClick={e =>addCol(e)}>Add Column</a>
          <a className="rainbow-button" id='row' onClick={e => addRow(e)}>Add Row</a>
        
      </div>
<div style={{ marginLeft: 20 }}>
          <div className="tip">
            Tip: Click and drag to select. Use Ctrl+C/X/V.
          </div>
        </div>
      <div className="grid-wrap flex justify-center mt-[30px]">
        <Grid
          rows={rows}
          cols={cols}
          valueAt={valueAt}
          setValue={cellSetter}
          selection={selection}
          setSelection={setSelection}
          ensureSize={ensureSize}
        />
      </div>
    </div>
  );
}
