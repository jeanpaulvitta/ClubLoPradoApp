/* CONFIGURACIÓN ACTUALIZADA PARA TU TABLA EXISTENTE */

/* Table schema (REAL):
CREATE TABLE kv_store_4909a0bc (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

NOTE: No tiene columna updated_at ni triggers
*/

// View at https://supabase.com/dashboard/project/rztiyofwhlwvofwhcgue/database/tables

// This file provides a simple key-value interface for storing Figma Make data. It should be adequate for most small-scale use cases.
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const client = () => createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
);

// Helper function to check if error is "table not found"
const isTableNotFoundError = (error: any): boolean => {
  return error?.message?.includes("Could not find the table") || 
         error?.message?.includes("relation") && error?.message?.includes("does not exist");
};

// Set stores a key-value pair in the database.
export const set = async (key: string, value: any): Promise<void> => {
  const supabase = client()
  
  try {
    const { error } = await supabase.from("kv_store_4909a0bc").upsert({
      key,
      value
    });
    
    if (error) {
      // Si el error es por updated_at, intentar con rpc directo
      if (error.message?.includes('updated_at')) {
        console.warn(`⚠️ Trigger updated_at detected, using direct insert. Key: ${key}`);
        
        // Usar delete + insert para evitar el trigger de UPDATE
        await supabase.from("kv_store_4909a0bc").delete().eq("key", key);
        const { error: insertError } = await supabase.from("kv_store_4909a0bc").insert({
          key,
          value
        });
        
        if (insertError) {
          throw new Error(insertError.message);
        }
        return;
      }
      
      if (isTableNotFoundError(error)) {
        console.warn(`⚠️ KV Store table not found. Please create it using CREATE_TABLE.sql. Key: ${key}`);
        return; // Gracefully handle missing table
      }
      throw new Error(error.message);
    }
  } catch (error) {
    // Si el error menciona updated_at, hacer delete + insert
    if (String(error).includes('updated_at')) {
      console.warn(`⚠️ Trigger updated_at error, using delete+insert workaround. Key: ${key}`);
      
      await supabase.from("kv_store_4909a0bc").delete().eq("key", key);
      const { error: insertError } = await supabase.from("kv_store_4909a0bc").insert({
        key,
        value
      });
      
      if (insertError && !String(insertError).includes('updated_at')) {
        throw new Error(insertError.message);
      }
      return;
    }
    throw error;
  }
};

// Get retrieves a key-value pair from the database.
export const get = async (key: string): Promise<any> => {
  const supabase = client()
  const { data, error } = await supabase.from("kv_store_4909a0bc").select("value").eq("key", key).maybeSingle();
  if (error) {
    if (isTableNotFoundError(error)) {
      console.warn(`⚠️ KV Store table not found. Please create it using CREATE_TABLE.sql. Key: ${key}`);
      return null; // Return null for missing table
    }
    throw new Error(error.message);
  }
  return data?.value;
};

// Delete deletes a key-value pair from the database.
export const del = async (key: string): Promise<void> => {
  const supabase = client()
  const { error } = await supabase.from("kv_store_4909a0bc").delete().eq("key", key);
  if (error) {
    if (isTableNotFoundError(error)) {
      console.warn(`⚠️ KV Store table not found. Please create it using CREATE_TABLE.sql. Key: ${key}`);
      return; // Gracefully handle missing table
    }
    throw new Error(error.message);
  }
};

// Sets multiple key-value pairs in the database.
export const mset = async (keys: string[], values: any[]): Promise<void> => {
  const supabase = client()
  const { error } = await supabase.from("kv_store_4909a0bc").upsert(
    keys.map((k, i) => ({ 
      key: k, 
      value: values[i]
    }))
  );
  if (error) {
    if (isTableNotFoundError(error)) {
      console.warn(`⚠️ KV Store table not found. Please create it using CREATE_TABLE.sql. Keys: ${keys.join(', ')}`);
      return; // Gracefully handle missing table
    }
    throw new Error(error.message);
  }
};

// Gets multiple key-value pairs from the database.
export const mget = async (keys: string[]): Promise<any[]> => {
  const supabase = client()
  const { data, error } = await supabase.from("kv_store_4909a0bc").select("value").in("key", keys);
  if (error) {
    if (isTableNotFoundError(error)) {
      console.warn(`⚠️ KV Store table not found. Please create it using CREATE_TABLE.sql. Keys: ${keys.join(', ')}`);
      return []; // Return empty array for missing table
    }
    throw new Error(error.message);
  }
  return data?.map((d) => d.value) ?? [];
};

// Deletes multiple key-value pairs from the database.
export const mdel = async (keys: string[]): Promise<void> => {
  const supabase = client()
  const { error } = await supabase.from("kv_store_4909a0bc").delete().in("key", keys);
  if (error) {
    if (isTableNotFoundError(error)) {
      console.warn(`⚠️ KV Store table not found. Please create it using CREATE_TABLE.sql. Keys: ${keys.join(', ')}`);
      return; // Gracefully handle missing table
    }
    throw new Error(error.message);
  }
};

// Search for key-value pairs by prefix.
export const getByPrefix = async (prefix: string): Promise<any[]> => {
  const supabase = client()
  const { data, error } = await supabase.from("kv_store_4909a0bc").select("key, value").like("key", prefix + "%");
  if (error) {
    if (isTableNotFoundError(error)) {
      console.warn(`⚠️ KV Store table not found. Please create it using CREATE_TABLE.sql. Prefix: ${prefix}`);
      return []; // Return empty array for missing table
    }
    throw new Error(error.message);
  }
  return data?.map((d) => d.value) ?? [];
};