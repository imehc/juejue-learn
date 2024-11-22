/*
  Warnings:

  - The primary key for the `user_chatrooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chatroomId` on the `user_chatrooms` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_chatrooms` table. All the data in the column will be lost.
  - Added the required column `chatroom_id` to the `user_chatrooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_chatrooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_chatrooms" DROP CONSTRAINT "user_chatrooms_pkey",
DROP COLUMN "chatroomId",
DROP COLUMN "userId",
ADD COLUMN     "chatroom_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "user_chatrooms_pkey" PRIMARY KEY ("user_id", "chatroom_id");
