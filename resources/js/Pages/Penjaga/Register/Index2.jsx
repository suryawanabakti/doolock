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

export default function Index2({ jadwals, ruangan }) {
    const [filters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const onInputSearch = (e) => {
        var value = e.target.value;
        setGlobalFilter(value);
    };
    const [dataJadwals, setDataJadwals] = useState(jadwals);

    const reject = () => {
        toast.current.show({
            severity: "warn",
            summary: "Rejected",
            detail: "You have rejected",
            life: 3000,
        });
    };

    const toast = useRef(null);
    const confirm2 = (event, rowData) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Apakah anda yakin membatalkan pendaftaran jadwal ini?",
            icon: "pi pi-info-circle",
            defaultFocus: "reject",
            acceptClassName: "p-button-warning",
            accept: async () => {
                try {
                    const res = await axios.patch(
                        route("penjaga.pendaftaran.unapprove", rowData.id)
                    );
                    console.log(res);
                    toast.current.show({
                        severity: "success",
                        summary: "Confirmed",
                        detail: "You have Un Approve ",
                        life: 3000,
                    });

                    setDataJadwals((prevData) =>
                        prevData.filter((user) => user.id !== rowData.id)
                    );
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
                    <h4>{ruangan.nama_ruangan}</h4>
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
                                    Pendaftaran Jadwal{" "}
                                    <b className="text-green-500">Sudah</b> di
                                    approve
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
                            field="mahasiswa.nim"
                            header="NIM"
                            sortable
                            filterPlaceholder="Search by  nim"
                            headerStyle={{ width: "20rem" }}
                        />
                        <Column
                            headerClassName="fw-bold"
                            field="mahasiswa.nama"
                            header="Nama"
                            sortable
                            filterPlaceholder="Search by mahasiswa"
                            headerStyle={{ width: "20rem" }}
                        />
                        <Column
                            headerClassName="fw-bold"
                            field="hak_akses.ruangan.nama_ruangan"
                            header="Ruangan"
                            sortable
                            filterPlaceholder="Search by ruangan_id"
                            headerStyle={{ width: "20rem" }}
                        />

                        <Column
                            headerClassName="fw-bold"
                            field="hak_akses.tanggal"
                            header="Tanggal"
                            sortable
                            filterPlaceholder="Search by tanggal"
                            headerStyle={{ width: "10rem" }}
                        />

                        <Column
                            headerClassName="fw-bold"
                            field="hak_akses.jam_masuk"
                            header="Jam Masuk"
                            sortable
                            filterPlaceholder="Search by Masuk"
                            headerStyle={{ width: "20rem" }}
                        />
                        <Column
                            headerClassName="fw-bold"
                            field="hak_akses.jam_keluar"
                            header="Jam Keluar"
                            sortable
                            filterPlaceholder="Search by keluar"
                            headerStyle={{ width: "20rem" }}
                        />

                        <Column
                            headerClassName="fw-bold"
                            field="action"
                            header="Unapprove"
                            body={(rowData) => {
                                return (
                                    <Button
                                        icon="pi pi-times"
                                        rounded
                                        outlined
                                        severity="warning"
                                        onClick={(event) =>
                                            confirm2(event, rowData)
                                        }
                                    />
                                );
                            }}
                            headerStyle={{ width: "15rem" }}
                        />
                    </DataTable>
                </div>
            </div>
        </Layout>
    );
}
