import { useMachine } from "@xstate/react"
import { getPaginationContext } from "components/PaginationWidget/utils"
import { FC } from "react"
import { Helmet } from "react-helmet-async"
import { useSearchParams } from "react-router-dom"
import { pageTitle } from "util/page"
import { auditMachine } from "xServices/audit/auditXService"
import { PaginationMachineRef } from "xServices/pagination/paginationXService"
import { AuditPageView } from "./AuditPageView"

const AuditPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get("filter") ?? ""
  const [auditState, auditSend] = useMachine(auditMachine, {
    context: {
      filter,
      paginationContext: getPaginationContext(searchParams),
    },
    actions: {
      updateURL: (context, event) =>
        setSearchParams({ page: event.page, filter: context.filter }),
    },
  })

  const { auditLogs, count } = auditState.context
  const paginationRef = auditState.context.paginationRef as PaginationMachineRef

  return (
    <>
      <Helmet>
        <title>{pageTitle("Audit")}</title>
      </Helmet>
      <AuditPageView
        filter={filter}
        auditLogs={auditLogs}
        count={count}
        onFilter={(filter) => {
          auditSend("FILTER", { filter })
        }}
        paginationRef={paginationRef}
      />
    </>
  )
}

export default AuditPage
