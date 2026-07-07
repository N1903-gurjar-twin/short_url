interface AnalyticsTableProps {
  title: string
  columns: { label: string; key: string; format?: (value: any) => string }[]
  data: any[]
  isLoading?: boolean
}

export default function AnalyticsTable({
  title,
  columns,
  data,
  isLoading = false,
}: AnalyticsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      {data && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={`${idx}-${column.key}`}
                      className="px-6 py-4 text-sm text-gray-700"
                    >
                      {column.format ? column.format(row[column.key]) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-8 text-center text-gray-500">
          <p>No data available</p>
        </div>
      )}
    </div>
  )
}
