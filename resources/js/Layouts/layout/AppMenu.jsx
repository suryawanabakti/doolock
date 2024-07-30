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
            items: [],
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
                <ul>
                    <li
                        className={`${
                            route().current("admin.riwayat.*")
                                ? "active-menuitem"
                                : ""
                        }`}
                    >
                        <a
                            className={`p-ripple ${
                                route().current("admin.riwayat.*")
                                    ? "active-route"
                                    : ""
                            } `}
                            tabIndex="0"
                            href="/admin/riwayat"
                        >
                            <i className="layout-menuitem-icon pi pi-history"></i>
                            <span className="layout-menuitem-text">
                                Riwayat
                            </span>
                        </a>
                    </li>
                    <li
                        className={`${
                            route().current("admin.riwayat-by-ruangan.*")
                                ? "active-menuitem"
                                : ""
                        }`}
                    >
                        <a
                            className={`p-ripple ${
                                route().current("admin.riwayat-by-ruangan*")
                                    ? "active-route"
                                    : ""
                            } `}
                            tabIndex="0"
                            href="/admin/riwayat-by-ruangan"
                        >
                            <i className="layout-menuitem-icon pi pi-history"></i>
                            <span className="layout-menuitem-text">
                                Riwayat Per Ruangan
                            </span>
                        </a>
                    </li>
                    <li
                        hidden
                        className={`${
                            route().current("admin.riwayat.mahasiswa")
                                ? "active-menuitem"
                                : ""
                        }`}
                    >
                        <a
                            className={`p-ripple ${
                                route().current("admin.riwayat.mahasiswa")
                                    ? "active-route"
                                    : ""
                            } `}
                            tabIndex="0"
                            href="/admin/riwayat/mahasiswa"
                        >
                            <i className="layout-menuitem-icon pi pi-history"></i>
                            <span className="layout-menuitem-text">
                                Riwayat Per Mahasiswa
                            </span>
                        </a>
                    </li>
                </ul>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
