import { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import { usePage } from "@inertiajs/react";

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { auth } = usePage().props;
    const user = auth.user;

    const menuItems = {
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
        penjaga: [
            {
                label: "Penjaga Menu",
                items: [
                    {
                        label: "Hak Akses",
                        icon: "pi pi-key",
                        to: route("penjaga.ruangan-hak-akses.index"),
                    },
                ],
            },
            {
                label: "Laporan",
                items: [
                    {
                        label: "Riwayat",
                        icon: "pi pi-history",
                        to: route("penjaga.riwayat.index"),
                    },

                    {
                        label: "Absensi",
                        icon: "pi pi-history",
                        to: route("penjaga.absensi.index"),
                    },
                ],
            },
        ],
    };

    const renderMenuItems = (role) => {
        return menuItems[role]?.map((item, i) =>
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
            <ul className="layout-menu">{renderMenuItems(user.role)}</ul>
        </MenuProvider>
    );
};

export default AppMenu;
