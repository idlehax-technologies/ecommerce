-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('customer', 'staff', 'admin');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('RESERVED', 'PAID', 'PICKED_UP', 'CANCELLED', 'EXPIRED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "AuditEventType" AS ENUM ('ORDER_CREATED', 'ORDER_PAID', 'ORDER_CANCELLED', 'ORDER_EXPIRED', 'ORDER_PICKED_UP', 'ORDER_REFUNDED', 'MEMBERSHIP_REQUESTED', 'MEMBERSHIP_APPROVED', 'MEMBERSHIP_REJECTED', 'MEMBERSHIP_REVOKED', 'MEMBERSHIP_EXPIRED', 'MEMBERSHIP_ROLE_UPDATED', 'INVENTORY_ADJUSTED', 'INVENTORY_RECONCILED', 'PAYMENT_CONFIRMED');

-- CreateEnum
CREATE TYPE "AuditEntityType" AS ENUM ('ORDER', 'MEMBERSHIP', 'INVENTORY', 'PAYMENT');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('ORDER_EXPIRY', 'MEMBERSHIP_EXPIRY', 'NOTIFICATION_DISPATCH');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "userId" VARCHAR(64) NOT NULL,
    "phone" VARCHAR(10) NOT NULL,
    "isSuperadmin" BOOLEAN NOT NULL,
    "activeMembershipId" VARCHAR(64),

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Profile" (
    "userId" VARCHAR(64) NOT NULL,
    "fullName" VARCHAR(128) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "addressText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "tenantId" VARCHAR(64) NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "address" TEXT NOT NULL,
    "state" VARCHAR(50) NOT NULL,
    "gstin" VARCHAR(15),
    "status" "TenantStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("tenantId")
);

-- CreateTable
CREATE TABLE "Membership" (
    "membershipId" VARCHAR(64) NOT NULL,
    "role" "MembershipRole" NOT NULL,
    "status" "MembershipStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" VARCHAR(64) NOT NULL,
    "tenantId" VARCHAR(64) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("membershipId")
);

-- CreateTable
CREATE TABLE "Product" (
    "productId" VARCHAR(64) NOT NULL,
    "sku" VARCHAR(20) NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "discountPercent" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "hsnCode" VARCHAR(8) NOT NULL,
    "gstRate" DECIMAL(4,2) NOT NULL,
    "status" "ProductStatus" NOT NULL,
    "images" TEXT[],
    "category" VARCHAR(50) NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "TenantInventory" (
    "enabled" BOOLEAN NOT NULL,
    "stock" INTEGER NOT NULL,
    "reserved" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" VARCHAR(64) NOT NULL,
    "productId" VARCHAR(64) NOT NULL,

    CONSTRAINT "TenantInventory_pkey" PRIMARY KEY ("tenantId","productId")
);

-- CreateTable
CREATE TABLE "Cart" (
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" VARCHAR(64) NOT NULL,
    "userId" VARCHAR(64) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("tenantId","userId")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "quantity" INTEGER NOT NULL,
    "tenantId" VARCHAR(64) NOT NULL,
    "userId" VARCHAR(64) NOT NULL,
    "productId" VARCHAR(64) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("tenantId","userId","productId")
);

-- CreateTable
CREATE TABLE "Order" (
    "orderId" VARCHAR(64) NOT NULL,
    "orderNumber" VARCHAR(20) NOT NULL,
    "total" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "paymentMethod" "PaymentMethod",
    "invoiceNumber" VARCHAR(20),
    "invoiceIssuedAt" TIMESTAMP(3),
    "status" "OrderStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" VARCHAR(64) NOT NULL,
    "userId" VARCHAR(64) NOT NULL,
    "placedByStaffId" VARCHAR(64),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "OrderSellerSnapshot" (
    "orderId" VARCHAR(64) NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "address" TEXT NOT NULL,
    "state" VARCHAR(50) NOT NULL,
    "gstin" VARCHAR(15),

    CONSTRAINT "OrderSellerSnapshot_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "OrderCustomerSnapshot" (
    "orderId" VARCHAR(64) NOT NULL,
    "fullName" VARCHAR(128) NOT NULL,
    "phone" VARCHAR(10) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "addressText" TEXT NOT NULL,

    CONSTRAINT "OrderCustomerSnapshot_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "OrderItemSnapshot" (
    "sku" VARCHAR(20) NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "discountPercent" INTEGER NOT NULL,
    "hsnCode" VARCHAR(8) NOT NULL,
    "gstRate" DECIMAL(4,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderId" VARCHAR(64) NOT NULL,
    "productId" VARCHAR(64) NOT NULL,

    CONSTRAINT "OrderItemSnapshot_pkey" PRIMARY KEY ("orderId","productId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "paymentId" VARCHAR(64) NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" VARCHAR(64) NOT NULL,
    "tenantId" VARCHAR(64) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "auditId" VARCHAR(64) NOT NULL,
    "eventType" "AuditEventType" NOT NULL,
    "entityType" "AuditEntityType" NOT NULL,
    "entityId" VARCHAR(64) NOT NULL,
    "from" JSONB,
    "to" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "tenantId" VARCHAR(64) NOT NULL,
    "actorId" VARCHAR(64) NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("auditId")
);

-- CreateTable
CREATE TABLE "Job" (
    "jobId" VARCHAR(64) NOT NULL,
    "type" "JobType" NOT NULL,
    "status" "JobStatus" NOT NULL,
    "attempts" INTEGER NOT NULL,
    "runAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lastError" TEXT,
    "dedupKey" VARCHAR(128),

    CONSTRAINT "Job_pkey" PRIMARY KEY ("jobId")
);

-- CreateTable
CREATE TABLE "OrderExpiryJobPayload" (
    "jobId" VARCHAR(64) NOT NULL,
    "tenantId" VARCHAR(64) NOT NULL,
    "orderId" VARCHAR(64) NOT NULL,

    CONSTRAINT "OrderExpiryJobPayload_pkey" PRIMARY KEY ("jobId")
);

-- CreateTable
CREATE TABLE "MembershipExpiryJobPayload" (
    "jobId" VARCHAR(64) NOT NULL,

    CONSTRAINT "MembershipExpiryJobPayload_pkey" PRIMARY KEY ("jobId")
);

-- CreateTable
CREATE TABLE "NotificationDispatchJobPayload" (
    "jobId" VARCHAR(64) NOT NULL,
    "event" JSONB NOT NULL,

    CONSTRAINT "NotificationDispatchJobPayload_pkey" PRIMARY KEY ("jobId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_activeMembershipId_key" ON "User"("activeMembershipId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_name_key" ON "Tenant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_gstin_key" ON "Tenant"("gstin");

-- CreateIndex
CREATE INDEX "Tenant_status_idx" ON "Tenant"("status");

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");

-- CreateIndex
CREATE INDEX "Membership_tenantId_status_idx" ON "Membership"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Membership_tenantId_role_status_idx" ON "Membership"("tenantId", "role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Order_tenantId_invoiceNumber_key" ON "Order"("tenantId", "invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Payment_tenantId_idx" ON "Payment"("tenantId");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_createdAt_idx" ON "AuditLog"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Job_dedupKey_key" ON "Job"("dedupKey");

-- CreateIndex
CREATE INDEX "Job_status_attempts_runAt_idx" ON "Job"("status", "attempts", "runAt");

-- CreateIndex
CREATE INDEX "Job_type_status_idx" ON "Job"("type", "status");

-- CreateIndex
CREATE INDEX "Job_type_createdAt_idx" ON "Job"("type", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "OrderExpiryJobPayload_orderId_key" ON "OrderExpiryJobPayload"("orderId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeMembershipId_fkey" FOREIGN KEY ("activeMembershipId") REFERENCES "Membership"("membershipId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantInventory" ADD CONSTRAINT "TenantInventory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantInventory" ADD CONSTRAINT "TenantInventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_tenantId_userId_fkey" FOREIGN KEY ("tenantId", "userId") REFERENCES "Cart"("tenantId", "userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_placedByStaffId_fkey" FOREIGN KEY ("placedByStaffId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSellerSnapshot" ADD CONSTRAINT "OrderSellerSnapshot_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderCustomerSnapshot" ADD CONSTRAINT "OrderCustomerSnapshot_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemSnapshot" ADD CONSTRAINT "OrderItemSnapshot_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemSnapshot" ADD CONSTRAINT "OrderItemSnapshot_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderExpiryJobPayload" ADD CONSTRAINT "OrderExpiryJobPayload_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderExpiryJobPayload" ADD CONSTRAINT "OrderExpiryJobPayload_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderExpiryJobPayload" ADD CONSTRAINT "OrderExpiryJobPayload_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipExpiryJobPayload" ADD CONSTRAINT "MembershipExpiryJobPayload_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDispatchJobPayload" ADD CONSTRAINT "NotificationDispatchJobPayload_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE CASCADE ON UPDATE CASCADE;
