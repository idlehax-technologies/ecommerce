import type { MembershipRole } from "@/types/membership";

export function getMembershipLandingPage(
    role: MembershipRole
): string {

    switch (role) {

        case "customer":
            return "/home";

        case "staff":
            return "/orders";

        case "admin":
            return "/analytics";
    }
}

export function getSuperadminLandingPage(): string {
    return "/platform/tenants";
}

export function getNoMembershipLandingPage(): string {
    return "/profile";
}

export function getUnauthenticatedLandingPage(): string {
    return "/login";
}