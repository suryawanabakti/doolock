import DashboardInfoCard from "@/Components/DashboardInfoCard.jsx";
import { LayoutContext } from "@/Layouts/layout/context/layoutcontext";
import Layout from "@/Layouts/layout/layout.jsx";
import { useContext, useEffect, useRef, useState } from "react";
import { Chart } from "primereact/chart";
const Dashboard = ({
    mahasiswaCount,
    dosenCount,
    ruanganCount,
    dataRuangan,
    scannerCount,
}) => {
    const lineData = {
        labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
        ],
        datasets: [
            {
                label: "Masuk",
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                backgroundColor: "green",
            },
            {
                label: "Keluar",
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                backgroundColor: "red",
            },
        ],
    };

    const lineOptions = {
        plugins: {
            legend: {
                labels: {
                    color: "#495057",
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "#495057",
                },
                grid: {
                    color: "#ebedef",
                },
            },
            y: {
                ticks: {
                    color: "#495057",
                },
                grid: {
                    color: "#ebedef",
                },
            },
        },
    };

    useEffect(() => {}, []);

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
            </div>
        </Layout>
    );
};

export default Dashboard;
