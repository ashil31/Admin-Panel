import { useRef } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import RewardTableOne from "../../components/tables/BasicTables/RewardTableOne";
import Button from "../../components/ui/button/Button";

export default function RewardTables() {
  const tableRef = useRef<any>(null);

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Reward's Details" />
      <div className="space-y-6">
        <ComponentCard
          title="Reward"
          action={
            <Button size="sm" onClick={() => tableRef.current?.exportToExcel()}>
              Download Excel
            </Button>
          }
        >
          <RewardTableOne ref={tableRef} />
        </ComponentCard>
      </div>
    </>
  );
}
