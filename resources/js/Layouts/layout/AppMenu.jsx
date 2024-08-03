import { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
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
                    label: "Riwayat",
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
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? (
                        <AppMenuitem
                            item={item}
                            root={true}
                            index={i}
                            key={item.label}
                        />
                    ) : (
                        <li className="menu-separator"></li>
                    );
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
