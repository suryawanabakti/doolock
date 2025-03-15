"use client";

import { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { InputText } from "primereact/inputtext";

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { auth } = usePage().props;
    const user = auth.user;
    const daftarRuangan = auth.daftarRuangan;
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRuangan =
        searchTerm.trim() === ""
            ? daftarRuangan
            : daftarRuangan.filter(
                  (item) =>
                      item.label &&
                      item.label
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
              );

    const menuItems = {
        super: [
            {
                label: "Admin Menu",
                items: [
                    {
                        label: "Dashboard",
                        icon: "pi pi-home",
                        to: route("dashboard"),
                    },
                ],
            },
            {
                label: "Master Data",
                items: [
                    {
                        label: "Admin",
                        icon: "pi pi-users",
                        to: route("admin.users.index"),
                    },
                    {
                        label: "Mahasiswa",
                        icon: "pi pi-users",
                        to: route("admin.mahasiswa.index"),
                    },
                    {
                        label: "Dosen / Staff",
                        icon: "pi pi-users",
                        to: route("admin.dosen.index"),
                    },
                    {
                        label: "Ruangan",
                        icon: "pi pi-home",
                        to: route("admin.ruangan.index"),
                    },
                    {
                        label: "Kelas",
                        icon: "pi pi-home",
                        to: route("admin.ruangan-kelas.index"),
                    },
                    {
                        label: "Scanner",
                        icon: "pi pi-qrcode",
                        to: route("admin.scaner.index"),
                    },
                ],
            },
            {
                label: "Laporan",
                items: [
                    {
                        label: "Riwayat ",
                        icon: "pi pi-history",
                        to: route("admin.riwayat.index"),
                    },
                    {
                        label: "Riwayat Per Ruangan",
                        icon: "pi pi-history",
                        to: route("admin.riwayat-by-ruangan.index"),
                    },
                    {
                        label: "Absensi",
                        icon: "pi pi-history",
                        to: route("admin.absensi.index"),
                    },
                ],
            },
        ],
        admin: [
            {
                label: "Admin Menu",
                items: [
                    {
                        label: "Dashboard",
                        icon: "pi pi-home",
                        to: route("dashboard"),
                    },
                ],
            },
            {
                label: "Master Data",
                items: [
                    {
                        label: "Admin",
                        icon: "pi pi-users",
                        to: route("admin.users.index"),
                    },
                    {
                        label: "Mahasiswa",
                        icon: "pi pi-users",
                        to: route("admin.mahasiswa.index"),
                    },
                    {
                        label: "Dosen / Staff",
                        icon: "pi pi-users",
                        to: route("admin.dosen.index"),
                    },
                    {
                        label: "Ruangan",
                        icon: "pi pi-home",
                        to: route("admin.ruangan.index"),
                    },
                    {
                        label: "Kelas",
                        icon: "pi pi-home",
                        to: route("admin.ruangan-kelas.index"),
                    },
                    {
                        label: "Scanner",
                        icon: "pi pi-qrcode",
                        to: route("admin.scaner.index"),
                    },
                ],
            },
            {
                label: "Laporan",
                items: [
                    {
                        label: "Riwayat ",
                        icon: "pi pi-history",
                        to: route("admin.riwayat.index"),
                    },
                    {
                        label: "Riwayat Per Ruangan",
                        icon: "pi pi-history",
                        to: route("admin.riwayat-by-ruangan.index"),
                    },
                    {
                        label: "Absensi",
                        icon: "pi pi-history",
                        to: route("admin.absensi.index"),
                    },
                ],
            },
        ],
        penjaga: daftarRuangan,
        mahasiswa: [
            {
                label: "Mahasiswa Menu",
                items: [
                    {
                        label: "Daftar Jadwal belum di approve",
                        icon: "pi pi-clock",
                        to: route("mahasiswa.register.index"),
                    },
                    {
                        label: "Daftar Jadwal sudah di approve",
                        icon: "pi pi-check",
                        to: route("mahasiswa.register-approve.index"),
                    },
                    {
                        label: "Profile",
                        icon: "pi pi-user",
                        to: route("profile.edit"),
                    },
                    {
                        label: "Kehilangan Kartu",
                        icon: "pi pi-times",
                        to: route("mahasiswa.kehilangan-kartu.index"),
                    },
                ],
            },
        ],
    };

    const renderMenuItems = (role) => {
        const itemsToRender =
            role === "penjaga" ? filteredRuangan : menuItems[role];
        return itemsToRender?.map((item, i) =>
            !item?.separator ? (
                <AppMenuitem
                    item={item}
                    root={true}
                    index={i}
                    key={item.label}
                />
            ) : (
                <li className="menu-separator" key={`separator-${i}`}></li>
            )
        );
    };

    return (
        <MenuProvider>
            {user.role === "penjaga" && (
                <InputText
                    type="search"
                    placeholder="Cari Nama Ruangan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
            )}

            <ul className="layout-menu">{renderMenuItems(user.role)}</ul>
        </MenuProvider>
    );
};

export default AppMenu;
