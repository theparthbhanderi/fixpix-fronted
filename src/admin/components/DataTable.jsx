import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const DataTable = ({
    columns,
    data,
    onSearch,
    searchPlaceholder = "Search...",
    pagination,
    actions
}) => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {/* Header / Toolbar */}
            <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                {onSearch && (
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            onChange={(e) => onSearch(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                )}
                {actions && <div className="flex gap-2">{actions}</div>}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-3 font-medium">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                                    No results found
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIdx) => (
                                <tr key={row.id || rowIdx} className="hover:bg-slate-800/50 transition-colors">
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className="px-6 py-4 text-slate-300">
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination (Simple for now) */}
            {pagination && (
                <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
                    <span>Showing {data.length} results</span>
                    <div className="flex gap-2">
                        <button className="p-1 rounded hover:bg-slate-800 disabled:opacity-50" disabled>
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="p-1 rounded hover:bg-slate-800 disabled:opacity-50" disabled>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
