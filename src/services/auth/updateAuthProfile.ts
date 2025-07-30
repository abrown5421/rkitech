import { 
  verifyBeforeUpdateEmail, 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  type User, 
  updatePassword,
  deleteUser,
} from "firebase/auth";
import { auth } from "../firebase";
import { deleteDocument } from "../database/deleteData";

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

export async function deleteAuthenticatedAccount(currentPassword: string): Promise<void> {
  const user: User | null = auth.currentUser;
  if (!user || !user.email) throw new Error("No authenticated user found.");
  
  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    await deleteUser(user);
    
    await deleteDocument('Users', user.uid);

    console.log("User account deleted successfully");
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
}
