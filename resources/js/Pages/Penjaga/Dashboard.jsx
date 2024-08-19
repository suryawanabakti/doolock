import DashboardInfoCard from "@/Components/DashboardInfoCard.jsx";

import Layout from "@/Layouts/layout/layout.jsx";
import { Card } from "primereact/card";

import Chart from "react-apexcharts";

const Dashboard = ({}) => {
    return (
        <Layout>
            <div className="grid">
                <div className="col-6">
                    <Card title="Hi 👋">
                        <p className="m-0"></p>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
