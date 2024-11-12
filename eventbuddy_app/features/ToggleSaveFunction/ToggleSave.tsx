import NetworkClient from "@/services/NetworkClient";

export const toggleSaveEvent = async (eventId?: number, userId?: number) => {
    if (userId && eventId) {
        const response = await NetworkClient.saveEvent(userId, eventId);
        return response;
    }
    return false
};
