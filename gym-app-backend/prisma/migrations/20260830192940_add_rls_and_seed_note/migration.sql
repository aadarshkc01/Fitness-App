-- AddForeignKey
ALTER TABLE "intake_profiles" ADD CONSTRAINT "intake_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
