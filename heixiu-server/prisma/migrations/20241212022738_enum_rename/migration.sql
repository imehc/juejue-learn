/*
  Warnings:

  - The `type` column on the `chatrooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `friend_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "friend_request_status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "chatroom_type" AS ENUM ('SINGLE', 'MULTIPLE');

-- AlterTable
ALTER TABLE "chatrooms" DROP COLUMN "type",
ADD COLUMN     "type" "chatroom_type" NOT NULL DEFAULT 'SINGLE';

-- AlterTable
ALTER TABLE "friend_requests" DROP COLUMN "status",
ADD COLUMN     "status" "friend_request_status" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "ChatroomType";

-- DropEnum
DROP TYPE "FriendRequestStatus";
