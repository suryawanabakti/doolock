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
import { Link, useForm } from "@inertiajs/react";
import { RadioButton } from "primereact/radiobutton";
import axios from "axios";
import { Badge } from "primereact/badge";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Checkbox } from "primereact/checkbox";

export default function Index({ jadwals, ruangans }) {
    const [dataRuangans, setDataRuangans] = useState(ruangans);
    const [dataJadwals, setDataJadwals] = useState(jadwals);
    const { data, setData, errors } = useForm({
        ruangan_id: "",
        tanggal: "",
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
                tanggal: data.tanggal,
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
            <ConfirmPopup />
            <Dialog
                header="Tambah Jadwal"
                visible={dialogNew}
                style={{ width: "50vw" }}
                onHide={() => {
                    if (!dialogNew) return;
                    setDialogNew(false);
                }}
            >
                <div className="field w-5">
                    <label htmlFor="ruangan" className="font-bold">
                        Ruangan{" "}
                        <span className="text-danger" style={{ color: "red" }}>
                            *
                        </span>
                    </label>
                    <Dropdown
                        value={selectedCountry}
                        onChange={(e) => {
                            setSelectedCountry(e.value);
                            console.log(e.value);
                            setData("ruangan_id", e.value.code);
                        }}
                        required
                        options={dataRuangans}
                        optionLabel="name"
                        placeholder="Pilih ruangan"
                        filter
                        valueTemplate={selectedCountryTemplate}
                        itemTemplate={countryOptionTemplate}
                        className="w-full "
                    />

                    {errors.ruangan_id && (
                        <small className="p-error">{errors.ruangan_id}</small>
                    )}
                </div>
                <div className="field w-5">
                    <label htmlFor="tanggal" className="font-bold">
                        Tanggal{" "}
                        <span className="text-danger" style={{ color: "red" }}>
                            *
                        </span>
                    </label>
                    <InputText
                        className="w-full"
                        id="tanggal"
                        type="date"
                        required
                        onChange={(e) => setData("tanggal", e.target.value)}
                        autoFocus
                    />
                    {errors.tanggal && (
                        <small className="p-error">{errors.tanggal}</small>
                    )}
                </div>
                <div className="field w-5">
                    <label htmlFor="jam_masuk" className="font-bold">
                        Jam Masuk{" "}
                        <span className="text-danger" style={{ color: "red" }}>
                            *
                        </span>
                    </label>
                    <InputText
                        className="w-full"
                        id="jam_masuk"
                        type="time"
                        required
                        onChange={(e) => setData("jam_masuk", e.target.value)}
                        autoFocus
                    />
                    {errors.jam_masuk && (
                        <small className="p-error">{errors.jam_masuk}</small>
                    )}
                </div>
                <div className="field w-5">
                    <label htmlFor="jam_keluar" className="font-bold">
                        Jam Keluar{" "}
                        <span className="text-danger" style={{ color: "red" }}>
                            *
                        </span>
                    </label>
                    <InputText
                        className="w-full"
                        id="jam_keluar"
                        required
                        type="time"
                        onChange={(e) => setData("jam_keluar", e.target.value)}
                        autoFocus
                    />
                    {errors.jam_keluar && (
                        <small className="p-error">{errors.jam_keluar}</small>
                    )}
                </div>
                <Button
                    label={`Simpan jadwal`}
                    icon="pi pi-save"
                    onClick={handleSave}
                    severity="primary"
                />
            </Dialog>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <Toolbar
                            left={() => (
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        onClick={openNewDialog}
                                        label="Tambah Jadwal Baru"
                                        icon="pi pi-plus"
                                        severity="primary"
                                    />
                                </div>
                            )}
                        />
                    </div>
                    <DataTable
                        header={() => (
                            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                                <h5 className="mt-3">
                                    Pendaftaran Jadwal{" "}
                                    <b className="text-yellow-500">Belum</b> di
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
                        className="mb-3"
                        value={dataJadwals}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    >
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
                            filterPlaceholder="Search by hari"
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
                            header="Action"
                            body={(rowData) => {
                                return (
                                    <Button
                                        icon="pi pi-trash"
                                        rounded
                                        outlined
                                        severity="danger"
                                        onClick={(event) =>
                                            confirm2(event, rowData)
                                        }
                                    />
                                );
                            }}
                            headerStyle={{ width: "15rem" }}
                        />
                    </DataTable>
                    <Link href={route("mahasiswa.register-approve.index")}>
                        Lihat Jadwal yang <b>sudah</b> di approve
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
