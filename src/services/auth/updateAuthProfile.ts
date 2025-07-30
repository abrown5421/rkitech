import { verifyBeforeUpdateEmail, EmailAuthProvider, reauthenticateWithCredential, type User, updatePassword } from "firebase/auth";
import { auth } from "../firebase";

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