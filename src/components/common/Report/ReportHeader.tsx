import React from 'react'
import ActionButton from './Action-button'
import PageSubheader from '../../ui/PageSubheader'

type ReportHeaderProps = {
  Title:string,
  showTableView: boolean
  setShowTableView: React.Dispatch<React.SetStateAction<boolean>>
}

const ReportHeader: React.FC<ReportHeaderProps> = ({
  Title,
  showTableView,
  setShowTableView,
}) => {
  return (
    <PageSubheader
      left={
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="report-title truncate text-[18px] font-semibold leading-none md:text-[24px]">
            {Title || "Report"}
          </h1>
        </div>
      }
      right={
        <ActionButton
          showTableView={showTableView}
          setShowTableView={setShowTableView}
        />
      }
    />
  )
}

export default ReportHeader
