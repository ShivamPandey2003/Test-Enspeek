import { useMutation } from "@tanstack/react-query"
import { apiRequest } from "../../services/apiService"
import { useSelector } from "react-redux"
import type { RootState } from "../../store/store"

type UpdateResponseReviewT = {
    message_id: string
    feedback: number
    study_id: number
}

export const UpdateResponseReview = ()=>{
    const { apiToken } = useSelector((state: RootState) => state.user);
    return useMutation<any, Error, UpdateResponseReviewT>({
        mutationKey:["response-review"],
        mutationFn: async(data)=>{
            const res = await apiRequest("post", "/studychatbot/chatStudy/feedback", {apiToken, ...data})

            return res.response
        }
    })
}