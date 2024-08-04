import DashboardInfoCard from "@/Components/DashboardInfoCard.jsx";
import { LayoutContext } from "@/Layouts/layout/context/layoutcontext";
import Layout from "@/Layouts/layout/layout.jsx";
import { useContext, useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";

const Dashboard = ({
    mahasiswaCount,
    dosenCount,
    ruanganCount,
    data,
    scannerCount,
}) => {
    const options = {
        chart: {
            id: "basic-bar",
        },
        plotOptions: {
            bar: {
                horizontal: true, // Ensure bars are vertical
                endingShape: "rounded", // Optional: rounded ends on bars
            },
        },
        xaxis: {
            categories: data.labels,
            title: {
                text: "Grafik Kunjugan Bulan Ini",
            },
        },
    };

    const series = data.series;

    return (
        <Layout>
            <div className="grid">
                <DashboardInfoCard
                    title="Mahasiswa"
                    value={mahasiswaCount}
                    icon="users"
                    iconColor="teal"
                    descriptionValue="2 new"
                    descriptionText="since last year"
                ></DashboardInfoCard>
                <DashboardInfoCard
                    title="Dosen"
                    value={dosenCount}
                    icon="users"
                    iconColor="teal"
                    descriptionValue="2 new"
                    descriptionText="since last year"
                ></DashboardInfoCard>
                <DashboardInfoCard
                    title="Ruangan & Kelas"
                    value={ruanganCount}
                    icon="home"
                    iconColor="teal"
                    descriptionValue="2 new"
                    descriptionText="since last year"
                ></DashboardInfoCard>
                <DashboardInfoCard
                    title="Scanner"
                    value={scannerCount}
                    icon="qrcode"
                    iconColor="teal"
                    descriptionValue="2 new"
                    descriptionText="since last year"
                ></DashboardInfoCard>
                <div className="card col-12">
                    <Chart
                        options={options}
                        series={series}
                        type="bar"
                        width="100%"
                        height="290px"
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
