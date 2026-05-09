import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const REQUIRED_FIELDS = [
  "title",
  "hook",
  "main",
  "keyfact",
  "tip",
  "country",
  "day",
  "cat",
  "savedAt"
];

const LOG_FILE_PATH = path.resolve(process.cwd(), "import-debug.log");

async function logLine(message) {
  const line = `[${new Date().toISOString()}] ${message}`;
  console.log(line);
  await fs.appendFile(LOG_FILE_PATH, `${line}\n`, "utf8");
}

async function loadEnvFromLocalFile() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  let content = "";

  try {
    content = await fs.readFile(envPath, "utf8");
  } catch {
    return;
  }

  const lines = content.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function parseArgs() {
  const [, , filePathArg, tableArg] = process.argv;

  if (!filePathArg) {
    console.error(
      "Usage: node import-lessons.js <path-zur-json-datei> [tabellenname]"
    );
    process.exit(1);
  }

  return {
    filePath: path.resolve(process.cwd(), filePathArg),
    tableName: tableArg || "lessons"
  };
}

function camelToSnakeKey(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

function toSnakeCaseObject(input) {
  const output = {};
  for (const [key, value] of Object.entries(input)) {
    output[camelToSnakeKey(key)] = value;
  }
  return output;
}

function validateLesson(lesson, index) {
  if (lesson === null || typeof lesson !== "object" || Array.isArray(lesson)) {
    throw new Error(`Eintrag ${index} ist kein gueltiges Objekt.`);
  }

  const missing = REQUIRED_FIELDS.filter((field) => lesson[field] === undefined);
  if (missing.length > 0) {
    throw new Error(
      `Eintrag ${index} fehlt erforderliche Felder: ${missing.join(", ")}`
    );
  }

  const day = Number(lesson.day);
  if (!Number.isInteger(day) || day < 1) {
    throw new Error(`Eintrag ${index} hat einen ungueltigen day-Wert: ${lesson.day}`);
  }

  const { words: _unusedWords, ...lessonWithoutWords } = lesson;

  const normalized = {
    ...lessonWithoutWords,
    title: String(lesson.title),
    hook: String(lesson.hook),
    main: String(lesson.main),
    keyfact: String(lesson.keyfact),
    tip: String(lesson.tip),
    country: String(lesson.country),
    day,
    cat: String(lesson.cat),
    savedAt: String(lesson.savedAt),
    updatedAt:
      lesson.updatedAt === undefined || lesson.updatedAt === null || lesson.updatedAt === ""
        ? String(lesson.savedAt ?? "")
        : String(lesson.updatedAt)
  };

  const snakeCaseLesson = toSnakeCaseObject(normalized);
  delete snakeCaseLesson.words;
  return snakeCaseLesson;
}

async function main() {
  await fs.writeFile(LOG_FILE_PATH, "", "utf8");
  await loadEnvFromLocalFile();
  const { filePath, tableName } = parseArgs();
  const startedAt = new Date();

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

  await logLine(`[1/6] Starte Import: ${startedAt.toISOString()}`);
  await logLine(`[2/6] JSON-Datei: ${filePath}`);
  await logLine(`[2/6] Zieltabelle: ${tableName}`);

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Supabase ENV-Werte fehlen. Bitte VITE_SUPABASE_URL und VITE_SUPABASE_SERVICE_KEY in .env.local setzen."
    );
  }
  await logLine(
    `[3/6] ENV geladen: VITE_SUPABASE_URL gesetzt, SERVICE_KEY-Laenge=${supabaseServiceKey.length}`
  );

  const jsonRaw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(jsonRaw);

  if (!Array.isArray(parsed)) {
    throw new Error("Die JSON-Datei muss ein Array von Lektionen enthalten.");
  }
  await logLine(`[4/6] JSON gelesen: ${parsed.length} Lektionen gefunden`);

  const lessons = parsed.map((lesson, idx) => validateLesson(lesson, idx + 1));
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  await logLine("[5/6] Teste Supabase-Verbindung (SELECT auf Zieltabelle) ...");

  const { error: connectionError } = await supabase
    .from(tableName)
    .select("*", { count: "exact", head: true });
  if (connectionError) {
    throw new Error(
      `Supabase-Verbindung/Table-Check fehlgeschlagen: ${connectionError.message}`
    );
  }
  await logLine("[5/6] Supabase-Verbindung OK");

  await logLine(`[6/6] Starte Insert von ${lessons.length} Lektionen ...`);

  const { data, error, status, statusText } = await supabase
    .from(tableName)
    .insert(lessons)
    .select("id");
  if (error) {
    throw new Error(
      `Supabase-Insert-Fehler (status=${status || "n/a"} ${statusText || ""}): ${error.message}`
    );
  }

  await logLine(
    `Import erfolgreich: ${lessons.length} Lektionen in Tabelle "${tableName}" eingefuegt (status=${status || "n/a"}).`
  );
  await logLine(`Insert Rueckgabe-Zeilen: ${Array.isArray(data) ? data.length : 0}`);
  if (Array.isArray(data) && data.length > 0 && data[0]?.id !== undefined) {
    await logLine(`Beispiel-ID erste Zeile: ${data[0].id}`);
  }

  const finishedAt = new Date();
  await logLine(
    `Fertig: ${finishedAt.toISOString()} (Dauer: ${Math.round(
      (finishedAt.getTime() - startedAt.getTime()) / 1000
    )}s)`
  );
}

main().catch((err) => {
  console.error("Import fehlgeschlagen:", err.message);
  if (err?.stack) {
    console.error("Stacktrace:", err.stack);
  }
  fs.appendFile(
    LOG_FILE_PATH,
    `[${new Date().toISOString()}] Import fehlgeschlagen: ${err.message}\n${
      err?.stack ? `${err.stack}\n` : ""
    }`,
    "utf8"
  ).catch(() => {});
  process.exit(1);
});
