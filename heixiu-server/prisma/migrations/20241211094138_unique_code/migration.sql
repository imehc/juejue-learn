/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `UniqueCode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UniqueCode_code_key" ON "UniqueCode"("code");
