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

export default function Index({ jadwals, ruangans }) {
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

                        <Column
                            headerClassName="fw-bold"
                            field="action"
                            header="Approve"
                            body={(rowData) => {
                                return (
                                    <Button
                                        icon="pi pi-check"
                                        rounded
                                        outlined
                                        severity="success"
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
