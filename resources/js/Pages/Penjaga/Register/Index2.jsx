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
import { FilterMatchMode } from "primereact/api";

export default function Index2({ jadwals, ruangans }) {
    const [filters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const onInputSearch = (e) => {
        var value = e.target.value;
        setGlobalFilter(value);
    };
    const [dataJadwals, setDataJadwals] = useState(jadwals);
    const { data, setData, errors } = useForm({
        ruangan_id: "",
        day: "",
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
            const updatedData = [res.data, ...dataJadwals];
            setDataJadwals(updatedData);
            setDialogNew(false);
        } catch (error) {
            alert("Error");
        }
    };
    const toast = useRef(null);
    const confirm2 = (event, rowData) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Apakah anda yakin menyutujui pendaftaran jadwal ini?",
            icon: "pi pi-info-circle",
            defaultFocus: "reject",
            acceptClassName: "p-button-success",
            accept: async () => {
                try {
                    const res = await axios.patch(
                        route("penjaga.pendaftaran.approve", rowData.id)
                    );
                    console.log(res);
                    toast.current.show({
                        severity: "success",
                        summary: "Confirmed",
                        detail: "You have approve ",
                        life: 3000,
                    });

                    setDataJadwals((prevItems) =>
                        prevItems.map((item) =>
                            item.id == res.data.id
                                ? {
                                      ...item,
                                      user: res.data.user,
                                      ruangan: res.data.ruangan,
                                      day: res.data.day,
                                      jam_masuk: res.data.jam_masuk,
                                      jam_keluar: res.data.jam_keluar,
                                  }
                                : item
                        )
                    );
                    window.location.reload();
                } catch (e) {
                    console.log("ERROR", e);
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail:
                            "You have error deleted " +
                                e.response?.data?.message || e.message,
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
            <ConfirmPopup />

            <div className="grid">
                <div className="col-12">
                    <DataTable
                        value={dataJadwals}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        globalFilter={globalFilter}
                        filters={filters}
                        header={() => (
                            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                                <h5 className="mt-3">
                                    Pendaftaran Jadwal Sudah Di Approve
                                </h5>
                                <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText
                                        type="search"
                                        onInput={(e) => onInputSearch(e)}
                                        placeholder="Global Search"
                                    />
                                </span>
                            </div>
                        )}
                    >
                        <Column
                            headerClassName="fw-bold"
                            field="user.email"
                            header="NIM"
                            sortable
                            filterPlaceholder="Search by  nim"
                            headerStyle={{ width: "20rem" }}
                        />
                        <Column
                            headerClassName="fw-bold"
                            field="user.name"
                            header="Nama"
                            sortable
                            filterPlaceholder="Search by mahasiswa"
                            headerStyle={{ width: "20rem" }}
                        />
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
                    </DataTable>
                </div>
            </div>
        </Layout>
    );
}
