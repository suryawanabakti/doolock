import Layout from "@/Layouts/layout/layout";
import { Link, router, useForm } from "@inertiajs/react";
import axios from "axios";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { CascadeSelect } from "primereact/cascadeselect";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

export default function Index({ ruangan, today, hakAkses, kelas }) {
    const [dataMahasiswa, setDataMahasiswa] = useState([]);
    const [dataHakAkses, setDataHakAkses] = useState(hakAkses);

    const onInputSearch = (e) => {
        var value = e.target.value;
        setGlobalFilter(value);
    };
    const getDays = (rowData) => {
        console.log(rowData);
        switch (rowData.day) {
            case "mon":
                return "Senin";
            case "tue":
                return "Selasa";
            case "wed":
                return "Wednesday";
            case "thu":
                return "Kami";
            case "fri":
                return "Jum'at";
            case "sat":
                return "Sabtu";
            case "sun":
                return "Minggu";
            default:
                return null;
        }
    };
    const header = (
        <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
            <h5>Hak Akses Masuk {ruangan.nama_ruangan}</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => onInputSearch(e)}
                    placeholder="Global Search"
                />
            </span>
        </div>
    );
    const [selectedKelas, setSelectedKelas] = useState(null);
    const onChangeSelected = async (value) => {
        setLoadingTable(true);
        try {
            const res = await axios.get(
                route("admin.ruangan-hak-akses.getMahasiswa", {
                    kelas_id: value?.id,
                    ruangan_id: ruangan.id,
                    day: day,
                })
            );
            setDataMahasiswa(res.data);
            setSelectedKelas(value);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
        setLoadingTable(false);
    };
    const [tampilkanSemua, setTampilkanSemua] = useState(false);
    const handleShowAll = async (e) => {
        e.preventDefault();
        setLoadingTable(true);
        if (tampilkanSemua) {
            const res = await axios.get(
                route("admin.ruangan-hak-akses.getMahasiswa", {
                    ruangan_id: ruangan.id,
                    day: day,
                    tampilkan_semua: 0,
                })
            );

            setDataMahasiswa(res.data);
            setTampilkanSemua(false);
        } else {
            const res = await axios.get(
                route("admin.ruangan-hak-akses.getMahasiswa", {
                    ruangan_id: ruangan.id,
                    day: day,
                    tampilkan_semua: 1,
                })
            );
            console.log("TRUE", res);
            setDataMahasiswa(res.data);
            setTampilkanSemua(true);
        }
        setLoadingTable(false);
    };
    const header2 = (
        <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
            <h5>Pilih Mahasiswa</h5>

            <Dropdown
                value={selectedKelas}
                onChange={(e) => onChangeSelected(e.value)}
                options={kelas}
                optionLabel="name"
                placeholder="Semua Kelas"
                className="w-full md:w-14rem"
                emptyMessage="Tidak ada kelas"
            ></Dropdown>
            {selectedKelas && (
                <Button
                    label=""
                    icon="pi pi-refresh"
                    severity="icon"
                    size="small"
                    onClick={() => onChangeSelected()}
                />
            )}
            <div className="flex align-items-center">
                <Checkbox
                    inputId="tampilkanSemua"
                    name="tampilkanSemua"
                    onChange={handleShowAll}
                    checked={tampilkanSemua}
                />
                <label htmlFor="tampilkanSemua" className="ml-2">
                    Tampilkan semua
                </label>
            </div>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => onInputSearch(e)}
                    placeholder="Global Search"
                />
            </span>
        </div>
    );
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const { data, setData, errors, post, processing, reset } = useForm({
        ruangan_id: ruangan.id,
        jam_masuk: "07:30",
        jam_keluar: "20:00",
        mahasiswa: [],
        tanggal: "",
    });
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        alert("ok");
        try {
            const res = await axios.post(
                route("penjaga.ruangan-hak-akses.store"),
                data
            );
            const updatedData = [res.data, ...dataHakAkses];
            setDataHakAkses(updatedData);
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Berhasil simpan",
                life: 3000,
            });
            setDialogTambah(false);
            reset();
            setSelectedRows([]);
        } catch (error) {
            toast.current.show({
                severity: "warn",
                summary: "Error",
                detail: error.response?.data?.message ?? "Something Went Wrong",
                life: 9000,
            });
        }

        setLoading(false);
    };

    const rightToolbarTemplate = () => {
        return <div className="flex flex-wrap gap-2"></div>;
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    disabled={loading}
                    label={`Save ${selectedRows.length} Mahasiswa`}
                    icon="pi pi-save"
                    severity="primary"
                    onClick={handleSave}
                />
            </div>
        );
    };
    const [dialogTambah, setDialogTambah] = useState(false);
    const [day, setDay] = useState(today);
    const openNew = async () => {
        try {
            const res = await axios.get(
            route("admin.ruangan-hak-akses.getMahasiswa", {
                ruangan_id: ruangan.id,
                day: day,
            })
        );
          setDataMahasiswa(res.data);
        } catch (error) {
            console.log("error" , error)
        }
       
       
      
        setDialogTambah(true);
    };
    const leftToolbarTemplate3 = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label={`Tambah Hak Akses ${ruangan.nama_ruangan}`}
                    icon="pi pi-save"
                    severity="primary"
                    loading={dialogTambah}
                    onClick={openNew}
                />
            </div>
        );
    };

    const [ingredient, setIngredient] = useState(today);
    const [loadingTable, setLoadingTable] = useState(false);
    const handleDayChange = async (value) => {
        setLoadingTable(true);
        const res = await axios.get(
            route("admin.ruangan-hak-akses.getMahasiswa", {
                ruangan_id: ruangan.id,
                day: value,
            })
        );
        setLoadingTable(false);
        setDay(value);
        console.log(res);
        setDataMahasiswa(res.data);
        setIngredient(value);
        setData("day", value);
    };
    const [dialogDetail, setDialogDetail] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);
    const [hariDetail, setHariDetail] = useState(null);
    const openDetail = async (rowData) => {
        setHariDetail(rowData.day);
        console.log(rowData.hak_akses_mahasiswa);
        setDataDetail(rowData.hak_akses_mahasiswa);
        setDialogDetail(true);
    };
    const centerToolbar = () => {
        // return (
        //     <div className="flex flex-wrap gap-2">
        //         <div className="flex align-items-center">
        //             <RadioButton
        //                 inputId="Mon"
        //                 name="day"
        //                 value="Mon"
        //                 onChange={(e) => handleDayChange(e.value)}
        //                 checked={ingredient === "Mon"}
        //             />
        //             <label htmlFor="Mon" className="ml-2">
        //                 Senin
        //             </label>
        //         </div>
        //         <div className="flex align-items-center">
        //             <RadioButton
        //                 inputId="Tue"
        //                 name="day"
        //                 value="Tue"
        //                 onChange={(e) => handleDayChange(e.value)}
        //                 checked={ingredient === "Tue"}
        //             />
        //             <label htmlFor="Tue" className="ml-2">
        //                 Selasa
        //             </label>
        //         </div>
        //         <div className="flex align-items-center">
        //             <RadioButton
        //                 inputId="Wed"
        //                 name="day"
        //                 value="Wed"
        //                 onChange={(e) => handleDayChange(e.value)}
        //                 checked={ingredient === "Wed"}
        //             />
        //             <label htmlFor="Wed" className="ml-2">
        //                 Rabu
        //             </label>
        //         </div>
        //         <div className="flex align-items-center">
        //             <RadioButton
        //                 inputId="Thu"
        //                 name="day"
        //                 value="Thu"
        //                 onChange={(e) => handleDayChange(e.value)}
        //                 checked={ingredient === "Thu"}
        //             />
        //             <label htmlFor="Thu" className="ml-2">
        //                 Kamis
        //             </label>
        //         </div>
        //         <div className="flex align-items-center">
        //             <RadioButton
        //                 inputId="Fri"
        //                 name="day"
        //                 value="Fri"
        //                 onChange={(e) => handleDayChange(e.value)}
        //                 checked={ingredient === "Fri"}
        //             />
        //             <label htmlFor="Fri" className="ml-2">
        //                 Jum'at
        //             </label>
        //         </div>
        //         <div className="flex align-items-center">
        //             <RadioButton
        //                 inputId="Sat"
        //                 name="day"
        //                 value="Sat"
        //                 onChange={(e) => handleDayChange(e.value)}
        //                 checked={ingredient === "Sat"}
        //             />
        //             <label htmlFor="Sat" className="ml-2">
        //                 Sabtu
        //             </label>
        //         </div>
        //         <div className="flex align-items-center">
        //             <RadioButton
        //                 inputId="Sun"
        //                 name="day"
        //                 value="Sun"
        //                 onChange={(e) => handleDayChange(e.value)}
        //                 checked={ingredient === "Sun"}
        //             />
        //             <label htmlFor="Sun" className="ml-2">
        //                 Minggu
        //             </label>
        //         </div>
        //     </div>
        // );
        return (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <label htmlFor="Tanggal">Tanggal:</label>
                <InputText
                    id="tanggal"
                    type="date"
                    value={data.tanggal}
                    onChange={(e) => setData("tanggal", e.target.value)}
                />
            </div>
        );
    };

    const centerToolbar2 = () => {
        return (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <label htmlFor="jam_masuk">Jam Masuk:</label>
                <InputText
                    id="jam_masuk"
                    type="time"
                    value={data.jam_masuk}
                    onChange={(e) => setData("jam_masuk", e.target.value)}
                />
                <label htmlFor="jam_keluar">Jam Keluar:</label>
                <InputText
                    id="jam_keluar"
                    type="time"
                    value={data.jam_keluar}
                    onChange={(e) => setData("jam_keluar", e.target.value)}
                />
            </div>
        );
    };

    const [selectedRows, setSelectedRows] = useState([]);

    const [filters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        "ruangan.nama_ruangan": {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
        },
    });

    const [globalFilter, setGlobalFilter] = useState(null);
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
                        route("admin.ruangan-hak-akses.destroy", rowData.id)
                    );
                    toast.current.show({
                        severity: "info",
                        summary: "Confirmed",
                        detail: "You have deleted Hak Akses",
                        life: 3000,
                    });
                    const updatedData = dataHakAkses.filter(
                        (user) => user.id !== rowData.id
                    );
                    // Update the state with the new array
                    setDataHakAkses(updatedData);
                } catch (e) {
                    console.log("ERROR", e);
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "You have error deleted " + e.message,
                        life: 3000,
                    });
                }
            },
        });
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={(event) => confirm2(event, rowData)}
                />
            </React.Fragment>
        );
    };

    return (
        <Layout>
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <Toolbar
                            className="mb-4"
                            left={leftToolbarTemplate3}
                            right={rightToolbarTemplate}
                        ></Toolbar>

                        <DataTable
                            loading={loadingTable}
                            filters={filters}
                            header={header}
                            rows={10}
                            dataKey="id"
                            paginator
                            value={dataHakAkses}
                        >
                            <Column
                                headerClassName="fw-bold"
                                field="tanggal"
                                header="Tanggal"
                                sortable
                                filterPlaceholder="ID TAG"
                                style={{ minWidth: "10rem" }}
                                headerStyle={{ width: "10rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="jam_masuk"
                                header="Jam Masuk"
                                sortable
                                filterPlaceholder="ID TAG"
                                style={{ minWidth: "15rem" }}
                                headerStyle={{ width: "15rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="jam_keluar"
                                header="Jam Keluar"
                                sortable
                                filterPlaceholder="ID TAG"
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="hak_akses_mahasiswa_count"
                                header="Jumlah Mahasiswa"
                                body={(rowData) => {
                                    return (
                                        <a
                                            href="#"
                                            onClick={() => openDetail(rowData)}
                                        >
                                            {rowData.hak_akses_mahasiswa_count}
                                        </a>
                                    );
                                }}
                                sortable
                                filterPlaceholder="Jumlah Mahasiswa"
                            />
                            <Column
                                body={actionBodyTemplate}
                                exportable={false}
                                style={{ minWidth: "5rem" }}
                            ></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <Dialog
                visible={dialogTambah}
                style={{ width: "90%" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header={() => (
                    <>
                        <span>{`Tambah Hak Akses ${ruangan.nama_ruangan}`}</span>
                    </>
                )}
                modal
                className="p-fluid"
                footer={() => {}}
                onHide={() => {
                    setSelectedRows([]);
                    setDialogTambah(false);
                }}
            >
                <div className="grid">
                    <div className="col-12">
                        <Toolbar
                            className="mb-4"
                            center={centerToolbar}
                        ></Toolbar>
                        <Toolbar
                            className="mb-4"
                            center={centerToolbar2}
                        ></Toolbar>
                        {selectedRows.length > 0 && (
                            <div className="mb-2">
                                You have selected {selectedRows.length} people.
                            </div>
                        )}
                        <DataTable
                            loading={loadingTable}
                            globalFilter={globalFilter}
                            filters={filters}
                            header={header2}
                            rows={10}
                            dataKey="id"
                            paginator
                            value={dataMahasiswa}
                            selection={selectedRows}
                            onSelectionChange={(e) => {
                                setData("mahasiswa", e.value);
                                setSelectedRows(e.value);
                            }}
                        >
                            <Column
                                selectionMode="multiple"
                                headerStyle={{ width: "3rem" }}
                            ></Column>
                            <Column
                                headerClassName="fw-bold"
                                field="id_tag"
                                header="ID TAG"
                                sortable
                                filterPlaceholder="ID TAG"
                                style={{ minWidth: "10rem" }}
                                headerStyle={{ width: "10rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="nim"
                                header="Nim"
                                sortable
                                filterPlaceholder="nim"
                                style={{ minWidth: "10rem" }}
                                headerStyle={{ width: "10rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="nama"
                                header="Nama"
                                sortable
                                filterPlaceholder="nama"
                                style={{ minWidth: "10rem" }}
                                headerStyle={{ width: "10rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="ruangan.nama_ruangan"
                                sortable
                                filter
                                filterPlaceholder="Nama Kelas"
                                header="Kelas"
                                style={{ minWidth: "10rem" }}
                                headerStyle={{ width: "10rem" }}
                            />
                        </DataTable>
                        <Toolbar
                            className="mb-4"
                            center={leftToolbarTemplate}
                        ></Toolbar>
                    </div>
                </div>
            </Dialog>
            <Dialog
                visible={dialogDetail}
                style={{ width: "60%" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header={`Daftar Mahasiswa Yang Memiliki Akses`}
                modal
                className="p-fluid"
                footer={() => {}}
                onHide={() => {
                    setDialogDetail(false);
                }}
            >
                <div className="grid">
                    <div className="col-12">
                        <DataTable
                            value={dataDetail}
                            filters={filters}
                            rows={10}
                            dataKey="id"
                            paginator
                        >
                            <Column
                                headerClassName="fw-bold"
                                field="mahasiswa.id_tag"
                                header="ID"
                                sortable
                                filterPlaceholder="ID "
                                style={{ minWidth: "5rem" }}
                                headerStyle={{ width: "5rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="mahasiswa.nim"
                                header="NIM"
                                sortable
                                filterPlaceholder="NIM "
                                style={{ minWidth: "5rem" }}
                                headerStyle={{ width: "5rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="mahasiswa.nama"
                                header="Nama"
                                sortable
                                filterPlaceholder="Nama"
                                style={{ minWidth: "5rem" }}
                                headerStyle={{ width: "5rem" }}
                            />
                        </DataTable>
                    </div>
                </div>
            </Dialog>
        </Layout>
    );
}
