function PageHeader({ title, description, action }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="text-[25px] font-bold leading-tight text-gray-900 sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">{description}</p>}
      </div>
      {action && <div className="w-full shrink-0 [&>button]:min-h-11 [&>button]:w-full sm:w-auto sm:[&>button]:w-auto">{action}</div>}
    </div>
  )
}

export default PageHeader
