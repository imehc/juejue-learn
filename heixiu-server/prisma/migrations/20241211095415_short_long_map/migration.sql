/*
  Warnings:

  - You are about to drop the `UniqueCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UniqueCode";

-- CreateTable
CREATE TABLE "unique_codes" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "status" "UniqueCodeStatus" NOT NULL DEFAULT 'UNUSED',

    CONSTRAINT "unique_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "short_long_maps" (
    "id" SERIAL NOT NULL,
    "short_url" VARCHAR(10) NOT NULL,
    "long_url" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "short_long_maps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_codes_code_key" ON "unique_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "short_long_maps_short_url_key" ON "short_long_maps"("short_url");
