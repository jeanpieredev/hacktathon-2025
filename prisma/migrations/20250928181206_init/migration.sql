/*
  Warnings:

  - You are about to drop the column `userId` on the `Auth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Auth" DROP CONSTRAINT "Auth_userId_fkey";

-- DropIndex
DROP INDEX "public"."Auth_userId_key";

-- AlterTable
ALTER TABLE "public"."Auth" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "authId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "public"."User"("authId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_authId_fkey" FOREIGN KEY ("authId") REFERENCES "public"."Auth"("id") ON DELETE SET NULL ON UPDATE CASCADE;
