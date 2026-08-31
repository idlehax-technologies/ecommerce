"use client";

import { useEffect, useState } from "react";
import { fetchActiveMembership } from "@/lib/api/memberships";
import type { Membership } from "@/types/membership";
import { useAuth } from "@/contexts/AuthContext";

type ActiveMembershipResponse = {
    membership: Membership | null;
};

export function useActiveMembership() {

    const { user, loading: authLoading } = useAuth();

    const [membership, setMembership] = useState<Membership | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) {
            setLoading(true);
            return;
        }

        if (!user) {
            setMembership(null);
            setLoading(false);
            return;
        }

        setLoading(true);

        fetchActiveMembership()
            .then((res: ActiveMembershipResponse) => {
                setMembership(res.membership);
            })
            .catch(() => {
                // Not an error condition for UI — this actor may not have an active membership.
                setMembership(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user, authLoading]);

    return { membership, loading };
}