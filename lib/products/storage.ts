import type { Product } from "@/types/product";

/**
 * We keep the store on globalThis so that Next.js hot-reload
 * does NOT recreate it on every file change.
 */
const globalForProducts = globalThis as unknown as {
    __productStore?: Map<string, Product>;
};

const store: Map<string, Product> =
    globalForProducts.__productStore ?? new Map();

globalForProducts.__productStore = store;

/**
 * --------------------------------------------------------
 * One-time DEV SEED
 * --------------------------------------------------------
 * We seed only if the store is empty.
 * This ensures:
 * - Runs once on server start
 * - Does NOT duplicate on HMR
 * - Behaves like a fake database bootstrap
 */
function seedIfEmpty() {
    if (store.size > 0) return;

    const now = new Date().toISOString();
    const tenantId = "tenant-demo"; // matches your tenant-scoped model

    const demoProducts: Product[] = [
        {
            productId: "p-001",
            title: "Wireless Mouse",
            description: "Ergonomic Bluetooth mouse with silent clicks.",
            price: 79900,
            currency: "INR",
            isActive: true,
            isDeleted: false,
            sku: "WM-ERG-01",
            images: ["https://picsum.photos/seed/mouse/400"],
            category: "Accessories",
            tags: ["wireless", "office", "bluetooth"],
            createdAt: now,
            updatedAt: now,
        },
        {
            productId: "p-002",
            title: "Mechanical Keyboard",
            description: "RGB mechanical keyboard with hot-swappable switches.",
            price: 349900,
            currency: "INR",
            isActive: true,
            isDeleted: false,
            sku: "KB-MECH-RGB",
            images: ["https://picsum.photos/seed/keyboard/400"],
            category: "Accessories",
            tags: ["keyboard", "gaming", "rgb"],
            createdAt: now,
            updatedAt: now,
        },
        {
            productId: "p-003",
            title: "27\" Monitor",
            description: "4K IPS display for design and productivity.",
            price: 2299900,
            currency: "INR",
            isActive: true,
            isDeleted: false,
            sku: "MON-27-4K",
            images: ["https://picsum.photos/seed/monitor/400"],
            category: "Displays",
            tags: ["4k", "ips", "workstation"],
            createdAt: now,
            updatedAt: now,
        },
        {
            productId: "p-004",
            title: "USB-C Dock",
            description: "Multiport dock with HDMI, LAN, and PD charging.",
            price: 599900,
            currency: "INR",
            isActive: true,
            isDeleted: false,
            sku: "DOCK-UC10",
            images: ["https://picsum.photos/seed/dock/400"],
            category: "Connectivity",
            tags: ["usb-c", "laptop", "dock"],
            createdAt: now,
            updatedAt: now,
        },
        {
            productId: "p-005",
            title: "Noise Cancelling Headphones",
            description: "Over-ear ANC headphones with 30h battery.",
            price: 1299900,
            currency: "INR",
            isActive: true,
            isDeleted: false,
            sku: "AUD-ANC-X",
            images: ["https://picsum.photos/seed/headphones/400"],
            category: "Audio",
            tags: ["audio", "anc", "wireless"],
            createdAt: now,
            updatedAt: now,
        },
        {
            productId: "p-006",
            title: "Laptop Stand",
            description: "Aluminium stand for ergonomic desk setups.",
            price: 149900,
            currency: "INR",
            isActive: true,
            isDeleted: false,
            sku: "STAND-LAP",
            images: ["https://picsum.photos/seed/stand/400"],
            category: "Workspace",
            tags: ["ergonomic", "desk"],
            createdAt: now,
            updatedAt: now,
        },
        {
            productId: "p-007",
            title: "Webcam 1080p",
            description: "Full HD webcam with dual microphones.",
            price: 299900,
            currency: "INR",
            isActive: true,
            isDeleted: false,
            sku: "CAM-FHD",
            images: ["https://picsum.photos/seed/webcam/400"],
            category: "Video",
            tags: ["remote", "camera"],
            createdAt: now,
            updatedAt: now,
        },
        {
            productId: "p-008",
            title: "External SSD 1TB",
            description: "High-speed NVMe portable SSD.",
            price: 899900,
            currency: "INR",
            isActive: true,
            isDeleted: false,
            sku: "SSD-1TB-NVME",
            images: ["https://picsum.photos/seed/ssd/400"],
            category: "Storage",
            tags: ["ssd", "backup", "portable"],
            createdAt: now,
            updatedAt: now,
        },
        {
            productId: "p-009",
            title: "Smart Desk Lamp",
            description: "Adjustable LED lamp with touch controls.",
            price: 199900,
            currency: "INR",
            isActive: true,
            isDeleted: false,
            sku: "LAMP-SMART",
            images: ["https://picsum.photos/seed/lamp/400"],
            category: "Workspace",
            tags: ["lighting", "desk"],
            createdAt: now,
            updatedAt: now,
        },
    ];

    demoProducts.forEach(p => store.set(p.productId, p));
}

seedIfEmpty();

/**
 * Public storage API
 */
export const productStore = {
    get(id: string): Product | undefined {
        return store.get(id);
    },

    getAll(): Product[] {
        return Array.from(store.values());
    },

    save(p: Product) {
        store.set(p.productId, p);
    },

    delete(id: string) {
        store.delete(id);
    },
};