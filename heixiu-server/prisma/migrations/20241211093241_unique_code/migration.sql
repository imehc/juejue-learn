-- CreateEnum
CREATE TYPE "UniqueCodeStatus" AS ENUM ('USED', 'UNUSED');

-- CreateTable
CREATE TABLE "UniqueCode" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "status" "UniqueCodeStatus" NOT NULL DEFAULT 'UNUSED',

    CONSTRAINT "UniqueCode_pkey" PRIMARY KEY ("id")
);
