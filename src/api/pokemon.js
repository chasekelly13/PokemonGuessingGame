import Api from "../services/axios";

export const getPokemon = async (id) => {
    try {
        const response = await Api.get(`pokemon/${id}`);
        return response;
    } catch (error) {
        console.error(error);
    }
};