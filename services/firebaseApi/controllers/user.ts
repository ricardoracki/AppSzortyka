import { addDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { userCollection } from "..";

export class User {
  static async getUserByCredentials(
    username: string,
    password: string
  ): Promise<Auth.IUser | null> {
    const q = query(
      userCollection,
      where("name", "==", username),
      where("password", "==", password)
    );

    const response = await getDocs(q);
    if (response.docs.length == 0) return null;
    const user: Auth.IUser = response.docs[0].data() as Auth.IUser;
    return user;
  }

  static registerNewUser = async (user: any) => {
    const q = query(userCollection, where("name", "==", user.name));
    const response = await getDocs(q);
    if (response.docs.length > 0) throw new TypeError("USER_EXISTS");
    return await addDoc(userCollection, {
      ...user,
    });
  };

  static async getUserById(id: string) {
    const user = await getDoc(doc(userCollection, id));
    return user ? user.data() : null;
  }
}
