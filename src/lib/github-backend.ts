import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../data");

type StoredRequest = {
  id: string;
  name: string;
  email: string;
  brand: string | null;
  project_type: string | null;
  brief: string;
  status: string;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
  user_id: string | null;
};

type StoredProfile = {
  id: string;
  full_name: string | null;
  age: number | null;
  phone: string | null;
  height_cm: number | null;
  skin_tone: string | null;
  hair: string | null;
  eyes: string | null;
  city: string | null;
  bio: string | null;
  instagram: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  preferences: Record<string, unknown> | null;
  is_public: boolean | null;
  approved?: boolean;
  created_at?: string;
  updated_at?: string;
  email?: string | null;
  custom_fields?: Record<string, unknown>;
  roster_code?: string | null;
  weight_kg?: number | null;
};

async function readJsonFile<T>(fileName: string): Promise<T[]> {
  const filePath = path.join(dataDir, fileName);
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content) as T[];
}

async function writeJsonFile<T>(fileName: string, rows: T[]) {
  const filePath = path.join(dataDir, fileName);
  await writeFile(filePath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
}

export async function listRequests() {
  const rows = await readJsonFile<StoredRequest>("requests.json");
  return rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function createRequest(input: Omit<StoredRequest, "id" | "created_at" | "status" | "admin_reply" | "replied_at" | "user_id">) {
  const rows = await readJsonFile<StoredRequest>("requests.json");
  const record = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    status: "new",
    admin_reply: null,
    replied_at: null,
    user_id: null,
    ...input,
  } as StoredRequest;
  rows.unshift(record);
  await writeJsonFile("requests.json", rows);
  return record;
}

export async function updateRequestReply(id: string, updates: Partial<StoredRequest>) {
  const rows = await readJsonFile<StoredRequest>("requests.json");
  const index = rows.findIndex((row) => row.id === id);
  if (index === -1) {
    return null;
  }
  rows[index] = { ...rows[index], ...updates };
  await writeJsonFile("requests.json", rows);
  return rows[index];
}

export async function listProfiles() {
  const rows = await readJsonFile<StoredProfile>("profiles.json");
  return rows.sort((a, b) => (b.updated_at ?? b.created_at ?? "").localeCompare(a.updated_at ?? a.created_at ?? ""));
}

export async function getProfileById(userId: string) {
  const rows = await readJsonFile<StoredProfile>("profiles.json");
  return rows.find((row) => row.id === userId) ?? null;
}

export async function listPublicProfiles() {
  const rows = await readJsonFile<StoredProfile>("profiles.json");
  return rows.filter((row) => row.is_public).slice(0, 60);
}

export async function updateProfile(userId: string, updates: Partial<StoredProfile>) {
  const rows = await readJsonFile<StoredProfile>("profiles.json");
  const index = rows.findIndex((row) => row.id === userId);
  if (index === -1) {
    return null;
  }
  rows[index] = { ...rows[index], ...updates, updated_at: new Date().toISOString() };
  await writeJsonFile("profiles.json", rows);
  return rows[index];
}

export async function toggleProfileApproval(id: string, approved: boolean) {
  const rows = await readJsonFile<StoredProfile>("profiles.json");
  const index = rows.findIndex((row) => row.id === id);
  if (index === -1) {
    return null;
  }
  rows[index] = { ...rows[index], approved, updated_at: new Date().toISOString() };
  await writeJsonFile("profiles.json", rows);
  return rows[index];
}

export async function listUserRoles(userId: string) {
  return userId === "11111111-1111-1111-1111-111111111111" ? ["admin"] : [];
}
