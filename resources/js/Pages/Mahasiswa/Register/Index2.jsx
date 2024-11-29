import Layout from "@/Layouts/layout/layout";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import React from "react";
import { useState } from "react";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useForm } from "@inertiajs/react";
import { RadioButton } from "primereact/radiobutton";
import axios from "axios";
import { Badge } from "primereact/badge";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Checkbox } from "primereact/checkbox";

export default function Index2({ jadwals, ruangans }) {
    const [dataRuangans, setDataRuangans] = useState(ruangans);
    const [dataJadwals, setDataJadwals] = useState(jadwals);
    const { data, setData, errors } = useForm({
        ruangan_id: "",
        day: [],
        jam_masuk: "",
        jam_keluar: "",
    });
    const reject = () => {
        toast.current.show({
            severity: "warn",
            summary: "Rejected",
            detail: "You have rejected",
            life: 3000,
        });
    };
    const [dialogNew, setDialogNew] = useState(false);
    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };
    const countryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };
    const [selectedCountry, setSelectedCountry] = useState(null);
    const openNewDialog = (e) => {
        e.preventDefault();
        setDialogNew(true);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(route("mahasiswa.register.store"), {
                ruangan_id: data.ruangan_id,
                day: data.day,
                jam_masuk: data.jam_masuk,
                jam_keluar: data.jam_keluar,
            });
            console.log("RESPON", res);

            const updatedData = [res.data, ...dataJadwals];
            setDataJadwals(updatedData);
            setDialogNew(false);
        } catch (error) {
            console.log(error);
            alert("Error");
        }
    };
    const toast = useRef(null);
    const handleDayChange = (e) => {
        const selectedDay = e.value;
        const updatedDays = data.day.includes(selectedDay)
            ? data.day.filter((day) => day !== selectedDay)
            : [...data.day, selectedDay];
        setData("day", updatedDays);
    };
    const confirm2 = (event, rowData) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Do you want to delete this record?",
            icon: "pi pi-info-circle",
            defaultFocus: "reject",
            acceptClassName: "p-button-danger",
            accept: async () => {
                try {
                    await axios.delete(
                        route("mahasiswa.register.destroy", rowData.id)
                    );
                    toast.current.show({
                        severity: "info",
                        summary: "Confirmed",
                        detail: "You have deleted " + rowData.nama,
                        life: 3000,
                    });
                    const updatedUsers = dataJadwals.filter(
                        (user) => user.id !== rowData.id
                    );
                    // Update the state with the new array
                    setDataJadwals(updatedUsers);
                } catch (e) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "You have error deleted " + e.message,
                        life: 3000,
                    });
                }
            },
            reject,
        });
    };

    return (
        <Layout>
            <Toast ref={toast} />

            <div className="grid">
                <div className="col-12">
                    <DataTable
                        value={dataJadwals}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    >
                        <Column
                            headerClassName="fw-bold"
                            field="ruangan.nama_ruangan"
                            header="Ruangan"
                            sortable
                            filterPlaceholder="Search by ruangan_id"
                            headerStyle={{ width: "20rem" }}
                        />

                        <Column
                            headerClassName="fw-bold"
                            field="day"
                            header="Hari"
                            body={(jadwal) => {
                                const days = [
                                    { key: "mon", label: "Senin" },
                                    { key: "tue", label: "Selasa" },
                                    { key: "wed", label: "Rabu" },
                                    { key: "thu", label: "Kamis" },
                                    { key: "fri", label: "Jum'at" },
                                    { key: "sat", label: "Sabtu" },
                                    { key: "sun", label: "Minggu" },
                                ];

                                return (
                                    <>
                                        {days
                                            .filter(
                                                (day) => jadwal[day.key] === 1
                                            )
                                            .map((day, index) => (
                                                <span key={day.key}>
                                                    {day.label}
                                                    {index <
                                                        days.filter(
                                                            (d) =>
                                                                jadwal[
                                                                    d.key
                                                                ] === 1
                                                        ).length -
                                                            1 && ", "}
                                                </span>
                                            ))}
                                    </>
                                );
                            }}
                            sortable
                            filterPlaceholder="Search by hari"
                            headerStyle={{ width: "10rem" }}
                        />

                        <Column
                            headerClassName="fw-bold"
                            field="jam_masuk"
                            header="Jam Masuk"
                            sortable
                            filterPlaceholder="Search by Masuk"
                            headerStyle={{ width: "20rem" }}
                        />
                        <Column
                            headerClassName="fw-bold"
                            field="jam_keluar"
                            header="Jam Keluar"
                            sortable
                            filterPlaceholder="Search by keluar"
                            headerStyle={{ width: "20rem" }}
                        />
                        <Column
                            headerClassName="fw-bold"
                            field="is_approve"
                            header="Approve"
                            body={(jadwal) => {
                                return jadwal.is_approve == 1 ? (
                                    <Badge
                                        severity="success"
                                        value={"Approve"}
                                    />
                                ) : (
                                    <Badge
                                        severity="warning"
                                        value="Not Approve"
                                    />
                                );
                            }}
                            sortable
                            filterPlaceholder="Search by is_approve"
                            headerStyle={{ width: "20rem" }}
                        />
                    </DataTable>
                </div>
            </div>
        </Layout>
    );
}
