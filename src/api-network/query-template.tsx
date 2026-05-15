import { useQuery } from "@tanstack/react-query";

const queryStructure = ({ queryKey, queryFn, enable = false, refetchOnWindowFocus = false, retry = 1, }: QueryStructureProps) => {
    return useQuery({
        queryKey: [...queryKey],
        queryFn,
        enabled: enable,
        refetchOnWindowFocus,
        retry,
    });
};

export default queryStructure;
