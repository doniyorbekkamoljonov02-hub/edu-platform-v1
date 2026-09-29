/**
 * Responsive data table. Desktop uses a table; phones use readable cards so
 * wide admin/director tables never overflow the viewport.
 */
function Table({ columns, rows }) {
  return (
    <div>
      <div className="space-y-3 md:hidden">
        {rows.map((row, i) => (
          <article key={row.id ?? i} className="rounded-2xl border border-[#E3E7EC] bg-white p-4 shadow-[0_8px_24px_rgba(20,35,50,.04)]">
            {columns.map((col, index) => (
              <div key={col.key} className={`flex items-start justify-between gap-4 py-2.5 ${index ? 'border-t border-[#EEF1F4]' : ''}`}>
                <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-[#8A93A1]">{col.label}</span>
                <div className="min-w-0 text-right text-sm font-semibold text-[#26313D] break-words">{col.render ? col.render(row) : (row[col.key] ?? '—')}</div>
              </div>
            ))}
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-2xl border border-[#E3E7EC] bg-white md:block">
        <table className="min-w-full divide-y divide-[#E8EBEF]">
          <thead className="bg-[#F7F8FA]"><tr>{columns.map((col) => <th key={col.key} className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#7E8795]">{col.label}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#EEF1F4]">{rows.map((row, i) => <tr key={row.id ?? i} className="hover:bg-[#FAFBFC]">{columns.map((col) => <td key={col.key} className="whitespace-nowrap px-4 py-3 text-sm text-[#374151]">{col.render ? col.render(row) : (row[col.key] ?? '—')}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}
export default Table
