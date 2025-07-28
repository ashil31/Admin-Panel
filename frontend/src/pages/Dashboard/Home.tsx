import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Archana Engineering Dashboard"
        description="This is Archana Engineering Ecommerce"
      />
      <div className="space-y-6">
        {/* Top Row: Metrics + Monthly Chart Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <EcommerceMetrics />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <MonthlySalesChart />
          </div>
        </div>
      </div>
    </>
  );
}
