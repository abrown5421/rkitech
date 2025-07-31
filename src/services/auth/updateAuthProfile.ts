import { 
  verifyBeforeUpdateEmail, 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  type User, 
  updatePassword,
  deleteUser,
} from "firebase/auth";
import { auth, storage } from "../firebase";
import { deleteDocument } from "../database/deleteData";
import { getDocumentById } from "../database/readData";
import { deleteObject, ref } from "firebase/storage";

export async function sendEmailChangeVerification(newEmail: string, currentPassword: string): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No authenticated user found.");
  
  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await verifyBeforeUpdateEmail(user, newEmail);
    
    console.log("Verification email sent. Email will update after confirmation.");
  } catch (error) {
    console.error("Error sending email verification:", error);
    throw error;
  }
}

export async function updateUserPassword(oldPassword: string, newPassword: string): Promise<void> {
  const user: User | null = auth.currentUser;
  if (!user || !user.email) throw new Error("No authenticated user found.");
  
  try {
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(user, credential);
    
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}

export async function deleteAuthenticatedAccount(currentPassword: string, UID: string): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No authenticated user found.");

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    console.log(UID)
    const userDocument = await getDocumentById('Users', UID);
    console.log(userDocument)
    const profileImageUrl = userDocument?.profileImage;
    if (profileImageUrl) {
      const profilePath = getStoragePathFromUrl(profileImageUrl);
      if (profilePath) {
        await deleteObject(ref(storage, profilePath));
      }
    }

    const auxImageUrl = userDocument?.trianglifyObject?.auxImage;
    if (auxImageUrl) {
      const auxPath = getStoragePathFromUrl(auxImageUrl);
      if (auxPath) {
        await deleteObject(ref(storage, auxPath));
      }
    }

    await deleteDocument('Users', UID);

    await deleteUser(user);

    console.log("User account and related images deleted successfully");

  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
}

function getStoragePathFromUrl(url: string): string | null {
  try {
    const matches = decodeURIComponent(url).match(/\/o\/(.*?)\?alt=media/);
    return matches ? matches[1] : null;
  } catch {
    return null;
  }
}
