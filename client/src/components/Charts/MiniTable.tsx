interface MiniTableProps {
  headers: string[];
  rows: string[][];
  highlightColumn?: number;
}

export function MiniTable({ headers, rows, highlightColumn }: MiniTableProps) {
  return (
    <div className="chart-mini-table-wrapper">
      <table className="chart-mini-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className={ci === highlightColumn ? 'highlight' : ''}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
