import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

type MutationStructureProps<TData = unknown, TError = Error, TVariables = void, TContext = unknown> = UseMutationOptions<TData, TError, TVariables, TContext>;

const mutationStructure = <
    TData = unknown,
    TError = Error,
    TVariables = void,
    TContext = unknown,
>(mutationOptions: MutationStructureProps<TData, TError, TVariables, TContext>) => {
    return useMutation<TData, TError, TVariables, TContext>(mutationOptions);
};

export default mutationStructure;
