import React, { useCallback, useEffect, useMemo, useRef } from "react";
import Cell from "./Cell";

export default function Grid({
  rows,
  cols,
  valueAt,
  setValue, 
  selection,
  setSelection,
}) {
  const gridRef = useRef(null);
  const dragging = useRef(false);
  const anchor = useRef(null);

  const startSelection = useCallback(
    (r, c) => {
      anchor.current = { r, c };
      setSelection({ start: { r, c }, end: { r, c } });
    },
    [setSelection]
  );

  const updateSelection = useCallback(
    (r, c) => {
      if (!anchor.current) return;
      setSelection({ start: anchor.current, end: { r, c } });
    },
    [setSelection]
  );

  useEffect(() => {
    const onMouseUp = () => {
      dragging.current = false;
      anchor.current = null;
    };
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, []);

  const gridTemplateColumns = useMemo(
    () => `80px repeat(${cols.length}, minmax(90px, 1fr))`,
    [cols.length]
  );

  const isSelected = useCallback(
    (r, c) => {
      if (!selection) return false;
      const r1 = Math.min(selection.start.r, selection.end.r);
      const r2 = Math.max(selection.start.r, selection.end.r);
      const c1 = Math.min(selection.start.c, selection.end.c);
      const c2 = Math.max(selection.start.c, selection.end.c);
      return r >= r1 && r <= r2 && c >= c1 && c <= c2;
    },
    [selection]
  );

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={gridRef}
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns,
          width: Math.min(1400, 80 + cols.length * 110),
        }}
      >
        <div className="cell header" style={{ background: "#fff" }}></div>
        {cols.map((col, c) => (
          <div key={`h-${c}`} className="cell header">
            {col}
          </div>
        ))}

        {rows.map((row, r) => (
          <React.Fragment key={`r-${r}`}>
            <div className="cell label">{row}</div>
            {cols.map((col, c) => (
              <Cell
                key={`cell-${r}-${c}`}
                r={r}
                c={c}
                value={valueAt(r, c)}
                setValue={setValue}
                onMouseDown={(e) => {
                  if (e.button !== 0) return;
                  dragging.current = true;
                  startSelection(r, c);
                }}
                onMouseEnter={() => {
                  if (dragging.current) updateSelection(r, c);
                }}
                selected={isSelected(r, c)}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
