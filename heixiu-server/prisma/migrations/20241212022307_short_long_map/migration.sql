/*
  Warnings:

  - The `status` column on the `unique_codes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "unique_code_status" AS ENUM ('USED', 'UNUSED');

-- AlterTable
ALTER TABLE "unique_codes" DROP COLUMN "status",
ADD COLUMN     "status" "unique_code_status" NOT NULL DEFAULT 'UNUSED';

-- DropEnum
DROP TYPE "UniqueCodeStatus";
