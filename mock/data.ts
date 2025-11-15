"server-only";

import { promises as fs } from "fs";
import path from "path";

import type { TreatmentBE } from "@/lib/types";
import dataFile from "./data.json";

type DataFile = {
  treatments: TreatmentBE[];
};

const DATA_FILE_PATH = path.join(process.cwd(), "mock", "data.json");

const initialTreatments = [...(dataFile.treatments as TreatmentBE[])];

async function readDataFile(): Promise<DataFile> {
  const file = await fs.readFile(DATA_FILE_PATH, "utf-8");
  const parsed = JSON.parse(file) as DataFile;
  return {
    treatments: parsed.treatments.map((item) => ({ ...item })),
  };
}

async function writeDataFile(data: DataFile) {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(DATA_FILE_PATH, content, "utf-8");
}

export async function getTreatments() {
  const data = await readDataFile();
  return data.treatments;
}

export async function getTreatmentById(id: number) {
  const data = await readDataFile();
  return data.treatments.find((item) => item.id === id);
}

export async function insertTreatment(treatment: TreatmentBE) {
  const data = await readDataFile();
  const updated: DataFile = {
    treatments: [...data.treatments, treatment],
  };

  await writeDataFile(updated);

  return treatment;
}

export async function updateTreatment(
  id: number,
  changes: Partial<TreatmentBE>,
) {
  const data = await readDataFile();
  const index = data.treatments.findIndex((item) => item.id === id);

  if (index === -1) {
    return undefined;
  }

  const updatedTreatment: TreatmentBE = {
    ...data.treatments[index],
    ...changes,
  };

  const updated: DataFile = {
    treatments: [
      ...data.treatments.slice(0, index),
      updatedTreatment,
      ...data.treatments.slice(index + 1),
    ],
  };

  await writeDataFile(updated);

  return updatedTreatment;
}

export async function getNextTreatmentId() {
  const data = await readDataFile();

  return data.treatments.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

export async function resetTreatments() {
  await writeDataFile({ treatments: [...initialTreatments] });
}
