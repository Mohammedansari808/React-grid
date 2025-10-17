import React, { memo, useCallback, useEffect, useRef, useState } from "react";

const Cell = memo(function Cell({
  r,
  c,
  value,
  setValue,
  onMouseDown,
  onMouseEnter,
  selected,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = useCallback(() => {
    setEditing(false);
    setValue(r, c, draft);
  }, [r, c, draft, setValue]);

  const cancel = useCallback(() => {
    setEditing(false);
    setDraft(value);
  }, [value]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        commit();
        e.preventDefault();
      } else if (e.key === "Escape") {
        cancel();
        e.preventDefault();
      }
    },
    [commit, cancel]
  );

  return (
    <div
      className={`cell ${selected ? "selected" : ""}`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onDoubleClick={() => setEditing(true)}
    >
      {editing ? (
        <input
          ref={inputRef}
          className="editor"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={onKeyDown}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            textAlign: "center",
          }}
        />
      ) : (
        <div style={{ width: "100%", overflow: "hidden" }}>{value}</div>
      )}
    </div>
  );
});

export default Cell;
