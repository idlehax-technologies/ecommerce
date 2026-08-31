import type { SvgIconComponent } from "@mui/icons-material";

import ApartmentIcon from "@mui/icons-material/Apartment";
import CategoryIcon from "@mui/icons-material/Category";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkIcon from "@mui/icons-material/Work";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import InventoryIcon from "@mui/icons-material/Inventory";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import BalanceIcon from "@mui/icons-material/Balance";

import type { MembershipRole } from "@/types/membership";

export type SidebarItem = {
    label: string;
    href: string;
    icon: SvgIconComponent;
};

export const PLATFORM_SIDEBAR_ITEMS: SidebarItem[] = [
    {
        label: "Tenants",
        href: "/platform/tenants",
        icon: ApartmentIcon,
    },
    {
        label: "Products",
        href: "/platform/products",
        icon: CategoryIcon,
    },
    {
        label: "Memberships",
        href: "/platform/memberships",
        icon: GroupsIcon,
    },
    {
        label: "Jobs",
        href: "/platform/jobs",
        icon: WorkIcon,
    },
];

export const TENANT_SIDEBAR_ITEMS: Record<
    Exclude<MembershipRole, "customer">,
    SidebarItem[]
> = {
    staff: [
        {
            label: "Orders",
            href: "/orders",
            icon: ReceiptLongIcon,
        },
        {
            label: "POS",
            href: "/pos",
            icon: PointOfSaleIcon,
        },
        {
            label: "Memberships",
            href: "/memberships",
            icon: GroupsIcon,
        },
    ],

    admin: [
        {
            label: "Analytics",
            href: "/analytics",
            icon: AnalyticsIcon,
        },
        {
            label: "Inventory",
            href: "/inventory",
            icon: InventoryIcon,
        },
        {
            label: "Memberships",
            href: "/memberships",
            icon: GroupsIcon,
        },
        {
            label: "Audit",
            href: "/audit",
            icon: FactCheckIcon,
        },
        {
            label: "Reconciliation",
            href: "/reconciliation",
            icon: BalanceIcon,
        },
    ],
};