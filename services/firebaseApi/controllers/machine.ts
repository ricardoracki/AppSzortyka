import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_STORAGE, machineCollection } from "..";
import { deleteObject, listAll, ref } from "firebase/storage";

export interface IMachine {
  id?: string;
  ns: string;
  customer: string;
  type: string;
  description?: string;
  edited?: boolean;
  editedBy?: string;
  editedAt?: number;
  createdAt?: number;
  createdBy?: string;
}

export class Machine {
  id: string;
  ns: string;
  customer: string;
  type: string;
  description?: string;
  edited?: boolean;
  editedBy?: string;
  editedAt?: number;
  createdAt?: number;
  createdBy?: string;

  static async nsExists(ns: string) {
    const check = await getDocs(
      query(machineCollection, where("ns", "==", ns))
    );
    return !check.empty;
  }

  static async getById(id: string) {
    const d = await getDoc(doc(machineCollection, id));
    if (!d.exists) return null;
    // @ts-ignore
    return new Machine({ id, ...d.data() });
  }

  constructor(data: IMachine) {
    this.id = data.id || "";
    this.ns = data.ns;
    this.customer = data.customer;
    this.type = data.type;
    this.description = data.description;
    this.edited = data.edited;
    this.editedBy = data.editedBy;
    this.editedAt = data.editedAt;
    this.createdAt = data.createdAt;
    this.createdBy = data.createdBy;
  }

  static async getNextNs() {
    const q = query(machineCollection, orderBy("ns", "desc"), limit(1));
    //@ts-ignore
    const maxNs = await getDocs(q);
    const num = +maxNs.docs[0].data().ns + 1;
    return num.toString().padStart(4, "0");
  }

  async save() {
    console.log(this.createdAt);
    if (this.id) {
      return await updateDoc(doc(machineCollection, `${this.id}`), {
        ns: this.ns,
        customer: this.customer.toUpperCase(),
        type: this.type.toUpperCase(),
        description: this.description,
        createdBy: this.createdBy,
        createdAt: this.createdAt,
        edited: true,
        editedBy: this.editedBy,
        editedAt: Date.now(),
      });
    } else {
      return await addDoc(machineCollection, {
        ns: this.ns,
        customer: this.customer.toUpperCase(),
        type: this.type.toUpperCase(),
        description: this.description,
        edited: false,
        createdBy: this.createdBy,
        createdAt: Date.now(),
      });
    }
  }

  async exclude() {
    // delete folder in storage
    const folderRef = ref(FIREBASE_STORAGE, `${this.ns}`);

    // Deleta item a item dentro da pasta
    listAll(folderRef).then(async ({ items }) => {
      items.length > 0 &&
        items.forEach(
          async (i) => await deleteObject(ref(FIREBASE_STORAGE, i.fullPath))
        );
    });
    // delete database data
    await deleteDoc(doc(FIREBASE_DB, "machine", this.id));
  }
}
