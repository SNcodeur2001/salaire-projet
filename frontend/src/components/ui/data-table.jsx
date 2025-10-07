import * as React from "react"
import { cn } from "@/lib/utils"

const DataTable = React.forwardRef(
  ({ columns, data, className, emptyMessage = "Aucune donnée disponible", ...props }, ref) => {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
        <table
          ref={ref}
          className={cn("data-table", className)}
          {...props}
        >
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(column.className)}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="transition-colors hover:bg-muted/30">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(column.className)}
                    >
                      {column.render
                        ? column.render(row[column.key], row, index)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )
  }
)
DataTable.displayName = "DataTable"

export { DataTable }
