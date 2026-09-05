-- CreateTable
CREATE TABLE "plans" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "goal" TEXT NOT NULL,
    "split_type" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "current_week" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_sessions" (
    "id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "day_number" INTEGER NOT NULL,
    "week_number" INTEGER NOT NULL,
    "exercise_id" UUID NOT NULL,
    "target_sets" INTEGER NOT NULL,
    "target_reps" INTEGER NOT NULL,
    "target_rpe" INTEGER NOT NULL,

    CONSTRAINT "plan_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "plan_session_id" UUID NOT NULL,
    "actual_sets" INTEGER NOT NULL,
    "actual_reps" INTEGER NOT NULL,
    "actual_weight" DECIMAL(65,30) NOT NULL,
    "actual_rpe" INTEGER NOT NULL,
    "logged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "plan_sessions" ADD CONSTRAINT "plan_sessions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_sessions" ADD CONSTRAINT "plan_sessions_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_logs" ADD CONSTRAINT "session_logs_plan_session_id_fkey" FOREIGN KEY ("plan_session_id") REFERENCES "plan_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
