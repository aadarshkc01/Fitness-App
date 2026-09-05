-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "token_version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intake_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "height_cm" DECIMAL(65,30) NOT NULL,
    "weight_kg" DECIMAL(65,30) NOT NULL,
    "goal" TEXT NOT NULL,
    "experience_level" TEXT NOT NULL,
    "days_available" INTEGER NOT NULL,
    "session_duration_minutes" INTEGER NOT NULL,
    "equipment_access" TEXT NOT NULL,
    "injury_flags" JSONB NOT NULL DEFAULT '[]',
    "medical_flags" JSONB NOT NULL DEFAULT '[]',
    "par_q_status" TEXT NOT NULL DEFAULT 'cleared',
    "measurements" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "intake_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "muscle_group" TEXT NOT NULL,
    "equipment_required" TEXT NOT NULL,
    "difficulty_level" TEXT NOT NULL,
    "contraindications" JSONB NOT NULL DEFAULT '[]',
    "substitution_group" TEXT,
    "form_cue_summary" TEXT NOT NULL,
    "video_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "intake_profiles_user_id_key" ON "intake_profiles"("user_id");

