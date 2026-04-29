import { supabase } from "./supabase";

export type NotificationType = "info" | "success" | "warning" | "error";
export type TargetRole = "student" | "teacher" | "admin" | "all";

export const sendNotification = async (
  title: string,
  message: string,
  type: NotificationType = "info",
  userId?: string,
  targetRole: TargetRole = "all"
) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert([{
        title,
        message,
        type,
        user_id: userId,
        target_role: targetRole
      }]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Failed to send notification:", error);
    return { success: false, error };
  }
};
