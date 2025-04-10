import { Person } from "../models/Person";
import { supabase } from "../superbase";

const table = 'participants'

// 🔹 CREATE
export const createParticipant = async (
    data: Omit<Person, "id">
) => {
    const { data: result, error } = await supabase
        .from(table)
        .insert([data])
        .select();
    if (error) throw error;
    return result[0];
};

// 🔹 READ ALL
export const getAllParticipants = async () => {
    const { data, error } = await supabase.from(table).select('*')
    if (error) throw error
    return data
}

// 🔹 READ BY ID
export const getParticipantById = async (id: string) => {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
    if (error) throw error
    return data
}

// 🔹 UPDATE
export const updateParticipant = async (id: string | undefined, updatedData: Person) => {
    const { data, error } = await supabase.from(table).update(updatedData).eq('id', id).select().single()
    if (error) throw error
    return data
}

// 🔹 DELETE
export const deleteParticipant = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
    return true
}
