import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Alert from "../../components/ui/alert/Alert";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  const location = useLocation();
  const loginSuccess = location.state?.loginSuccess || false;
  const [showAlert, setShowAlert] = useState(loginSuccess);

  useEffect(() => {
    if (loginSuccess) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loginSuccess]);

  return (
    <>
      <PageMeta
        title="Archana Engineering Dashboard"
        description="This is Archana Engineering Ecommerce"
      />

      {showAlert && (
        <Alert
          variant="success"
          title="Welcome!"
          message="You have successfully logged in via Google."
        />
      )}

      <div className="space-y-6 mt-4">
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
