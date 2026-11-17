"use client";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { analyze, autoThreshold, FeatureResult } from "@/lib/stats";
import { defaultNames, IRIS, IRIS_NAMES, MAX_COLS, parseCsv, randomCells, SAMPLE, toCsv } from "@/lib/data";
import type { Dict } from "@/lib/i18n";

const STEPS = ["Input", "Calculation", "Result"] as const;
const f = (x: number) => (Number.isFinite(x) ? x.toFixed(3) : "∞");
const btn = "rounded-full border border-line px-5 py-2 text-ink transition hover:border-coral disabled:opacity-40";
const btnMain = "rounded-full bg-coral px-5 py-2 text-bg transition hover:scale-105 disabled:opacity-40";

// animated dashed connector between two panels
const Link = () => (
  <svg viewBox="0 0 2 40" preserveAspectRatio="none" className="mx-auto h-10 w-[2px]" aria-hidden>
    <line x1="1" y1="0" x2="1" y2="40" stroke="var(--color-coral)" strokeWidth="2" className="flow" />
  </svg>
);

const Panel = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="rise rounded-3xl border border-line bg-card/80 p-4 sm:p-6 md:p-10">
    <h3 className="mb-6 text-2xl">{title}</h3>
    {children}
  </div>
);

export default function Tool({ L }: { L: Dict }) {
  const [names, setNames] = useState<string[]>(defaultNames(4));
  const [cells, setCells] = useState<string[][]>(SAMPLE.map((r) => r.map(String)));
  const [threshold, setThreshold] = useState(1);
  const [auto, setAuto] = useState(true); // true = threshold comes from the data
  const [stage, setStage] = useState(0); // 0 = input only, 1 = + calculation, 2 = + result
  const fileRef = useRef<HTMLInputElement>(null);

  const labels = useMemo(() => names.map((n, j) => n.trim() || `F${j + 1}`), [names]);
  const rows = useMemo(() => cells.map((r) => r.map((x) => (x.trim() === "" ? NaN : Number(x)))), [cells]);
  const valid = rows.length >= 2 && rows.every((r) => r.every((x) => Number.isFinite(x)));
  const effective = valid && auto ? autoThreshold(rows, labels) : threshold;
  const results = useMemo(() => (valid ? analyze(rows, effective, labels) : []), [rows, effective, valid, labels]);
  const fin = results.filter((r) => Number.isFinite(r.index));
  const kept = results.map((r, j) => (r.keep ? j : -1)).filter((j) => j >= 0);
  const maxIdx = Math.max(1, ...fin.map((r) => r.index));

  const columns = useMemo<ColumnDef<FeatureResult>[]>(() => [
    { accessorKey: "feature", header: L.feature },
    { accessorKey: "mean", header: L.mean, cell: (c) => f(c.getValue<number>()) },
    { accessorKey: "std", header: L.std, cell: (c) => f(c.getValue<number>()) },
    {
      accessorKey: "index", header: L.index,
      cell: (c) => {
        const v = c.getValue<number>();
        const w = Number.isFinite(v) ? Math.min(100, (v / maxIdx) * 100) : 100;
        return (
          <div className="flex items-center gap-3">
            <div className="h-2 w-20 rounded-full bg-line sm:w-28">
              <div className="h-2 origin-left rounded-full bg-coral" style={{ width: `${w}%`, animation: "growX 1s ease both" }} />
            </div>
            <span>{f(v)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "keep", header: L.decision,
      cell: (c) => (
        <span className={c.getValue<boolean>() ? "text-ink" : "text-coral"}>
          {c.getValue<boolean>() ? L.keep : L.remove}
        </span>
      ),
    },
  ], [maxIdx, L]);

  const table = useReactTable({ data: results, columns, getCoreRowModel: getCoreRowModel() });

  const setCell = (i: number, j: number, v: string) =>
    setCells((c) => c.map((r, a) => (a === i ? r.map((x, b) => (b === j ? v : x)) : r)));
  const rename = (j: number, v: string) => setNames((n) => n.map((x, b) => (b === j ? v : x)));
  const addCol = () => {
    setNames((n) => [...n, `F${n.length + 1}`]);
    setCells((c) => c.map((r) => [...r, "0"]));
  };
  const removeCol = (j: number) => {
    setNames((n) => n.filter((_, b) => b !== j));
    setCells((c) => c.map((r) => r.filter((_, b) => b !== j)));
  };
  const load = (n: string[], r: (string | number)[][]) => {
    setNames(n);
    setCells(r.map((x) => x.map(String)));
  };
  const onFile = async (file?: File) => {
    if (!file) return;
    const p = parseCsv(await file.text());
    if (p) load(p.names, p.cells);
  };
  const download = () => {
    const csv = toCsv(kept.map((j) => labels[j]), rows.map((r) => kept.map((j) => r[j])));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "reduced.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const next = (n: number, label: string) => (
    <div className="mt-8 text-center">
      <button onClick={() => setStage(n)} className={`${btnMain} px-8 py-3`}>{label} ↓</button>
    </div>
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-2">
          {STEPS.map((t, i) => (
            <span key={t} className={`rounded-full px-4 py-1.5 text-sm transition-all duration-700 ${stage >= i ? "bg-coral text-bg" : "bg-card text-mute"}`}>
              {i + 1}. {L.tabs[t]}
            </span>
          ))}
          {stage > 0 && (
            <button aria-label="Reset" onClick={() => setStage(0)} className="px-2 text-mute hover:text-coral">↺</button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-mute">
            <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} className="accent-coral" />
            {L.auto}
          </label>
          <span className="text-mute">{L.threshold}</span>
          <input type="range" min={0} max={100} step={0.1} disabled={auto}
            value={auto ? Math.min(effective, 100) : threshold}
            onChange={(e) => setThreshold(Number(e.target.value))} className="accent-coral disabled:opacity-40" />
          <input type="number" step={0.1} disabled={auto}
            value={auto ? Number(effective.toFixed(3)) : threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-24 rounded-lg border border-line bg-bg px-2 py-1 text-center disabled:opacity-40" />
        </div>
      </div>

      {!valid && <p className="mb-6 text-coral">{L.invalid}</p>}

      {/* 1. Input: always visible */}
      <Panel title={`1. ${L.tabs.Input}`}>
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-center">
            <thead>
              <tr>
                <th className="p-1 text-left font-normal text-mute">#</th>
                {names.map((n, j) => (
                  <th key={j} className="p-1 font-normal">
                    <div className="flex items-center justify-center gap-1">
                      <input value={n} onChange={(e) => rename(j, e.target.value)} aria-label={`Column ${j + 1} name`}
                        className="w-20 rounded-lg border border-transparent bg-transparent px-1 py-1 text-center text-mute hover:border-line focus:border-coral sm:w-24" />
                      {names.length > 1 && (
                        <button aria-label={`Delete column ${j + 1}`} onClick={() => removeCol(j)} className="text-mute hover:text-coral">×</button>
                      )}
                    </div>
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {cells.map((r, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="p-2 text-left text-mute">{i + 1}</td>
                  {r.map((v, j) => (
                    <td key={j} className="p-1">
                      <input value={v} onChange={(e) => setCell(i, j, e.target.value)} inputMode="decimal"
                        className={`w-20 rounded-lg border bg-bg px-2 py-1.5 text-center sm:w-24 ${Number.isFinite(rows[i][j]) ? "border-line" : "border-coral"}`} />
                    </td>
                  ))}
                  <td><button aria-label={`Delete row ${i + 1}`} onClick={() => setCells((c) => c.filter((_, a) => a !== i))}
                    className="px-2 text-mute hover:text-coral">×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => setCells((c) => [...c, names.map(() => "0")])} className={btnMain}>{L.addRow}</button>
          <button onClick={addCol} disabled={names.length >= MAX_COLS} className={btnMain}>{L.addCol}</button>
          <button onClick={() => load(defaultNames(4), SAMPLE)} className={btn}>{L.sample}</button>
          <button onClick={() => load(IRIS_NAMES, IRIS)} className={btn}>{L.iris}</button>
          <button onClick={() => setCells(randomCells(Math.max(4, cells.length), names.length))} className={btn}>{L.random}</button>
          <button onClick={() => fileRef.current?.click()} className={btn}>{L.csv}</button>
          <input ref={fileRef} type="file" accept=".csv,.txt,text/csv" hidden
            onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
        </div>
      </Panel>

      {stage < 1 && valid && next(1, L.calc)}

      {/* 2. Calculation: appears below, input stays on screen */}
      {stage >= 1 && valid && (
        <>
          <Link />
          <Panel title={`2. ${L.tabs.Calculation}`}>
            <div className="mb-6 h-1.5 w-full rounded-full bg-line">
              <div className="h-1.5 rounded-full bg-coral" style={{ animation: "fill 1.2s ease both" }} />
            </div>
            {auto && (
              <p dir="ltr" className="mb-4 overflow-x-auto text-mute">
                threshold = ({fin.map((r) => f(r.index)).join(" + ")}) / {fin.length} ={" "}
                <span className="text-ink">{f(effective)}</span>
              </p>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              {results.map((r, i) => (
                <div key={i} dir="ltr" className="rise rounded-2xl border border-line p-5" style={{ animationDelay: `${i * 120}ms` }}>
                  <h4 className="text-xl">{r.feature}</h4>
                  <p className="mt-3 text-mute">mean = Σx / n = <span className="text-ink">{f(r.mean)}</span></p>
                  <p className="text-mute">std = √(Σ(x − mean)² / (n − 1)) = <span className="text-ink">{f(r.std)}</span></p>
                  <p className="text-mute">J = |{f(r.mean)}| / {f(r.std)} = <span className="text-ink">{f(r.index)}</span></p>
                  <p className={`mt-3 ${r.keep ? "text-ink" : "text-coral"}`}>
                    {f(r.index)} {r.keep ? "≥" : "<"} {f(effective)}: {r.keep ? L.keep : L.remove}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}

      {stage === 1 && valid && next(2, L.show)}

      {/* 3. Result: appears below, input and calculation stay */}
      {stage >= 2 && valid && (
        <>
          <Link />
          <Panel title={`3. ${L.tabs.Result}`}>
            <div className="space-y-10">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>{table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id} className="text-mute">{hg.headers.map((h) => (
                      <th key={h.id} className="p-3 font-normal">{flexRender(h.column.columnDef.header, h.getContext())}</th>
                    ))}</tr>
                  ))}</thead>
                  <tbody>{table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-t border-line">{row.getVisibleCells().map((c) => (
                      <td key={c.id} className="p-3">{flexRender(c.column.columnDef.cell, c.getContext())}</td>
                    ))}</tr>
                  ))}</tbody>
                </table>
              </div>
              <div>
                <h4 className="text-2xl">{L.reduced(kept.length, names.length)}</h4>
                {kept.length === 0 ? (
                  <p className="mt-3 text-mute">{L.allBelow}</p>
                ) : (
                  <>
                    <div className="mt-4 overflow-x-auto">
                      <table className="text-center">
                        <thead><tr className="text-mute">{kept.map((j) => <th key={j} className="px-6 py-2 font-normal">{labels[j]}</th>)}</tr></thead>
                        <tbody>{rows.map((r, i) => (
                          <tr key={i} className="border-t border-line">{kept.map((j) => <td key={j} className="px-6 py-2">{r[j]}</td>)}</tr>
                        ))}</tbody>
                      </table>
                    </div>
                    <button onClick={download} className={`${btnMain} mt-6`}>{L.download}</button>
                  </>
                )}
              </div>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
