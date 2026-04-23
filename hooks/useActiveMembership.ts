"use client";

import { useEffect, useState } from "react";
import { fetchActiveMembership } from "@/lib/api/memberships";
import type { Membership } from "@/types/membership";

type ActiveMembershipResponse = {
    membership: Membership | null;
};

export function useActiveMembership() {
    const [membership, setMembership] = useState<Membership | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActiveMembership()
            .then((res: ActiveMembershipResponse) => {
                setMembership(res.membership);
            })
            .finally(() => setLoading(false));
    }, []);

    return { membership, loading };
}