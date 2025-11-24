/*
  Warnings:

  - You are about to drop the column `address` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `trackingNumber` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Shipping` table. All the data in the column will be lost.
  - Added the required column `count` to the `Shipping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Shipping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Shipping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Shipping` DROP COLUMN `address`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `orderId`,
    DROP COLUMN `trackingNumber`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `count` INTEGER NOT NULL,
    ADD COLUMN `productId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;
