import { prisma } from "../../../shared/prisma";
import { AppError } from "../../../utils/errors";

export const addressService = {
  getAddress: async (userId: string) => {
    const addresses = await prisma.userAddress.findMany({
      where: { userId: userId },
    });

    if (!addresses || addresses.length === 0) {
      return []; // Return empty array instead of throwing error
    }

    return addresses;
  },

  createAddress: async (userId: string, addressData: any) => {
    // Check if this is the first address for the user
    const existingAddresses = await prisma.userAddress.findMany({
      where: { userId: userId },
    });
    
    // If isDefault is set to true, set all other addresses to false
    if (addressData.isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId: userId },
        data: { isDefault: false },
      });
    }
    
    // If this is the first address, make it default regardless
    if (existingAddresses.length === 0) {
      addressData.isDefault = true;
    }

    const address = await prisma.userAddress.create({
      data: {
        ...addressData,
        userId,
      },
    });

    return address;
  },

  updateAddress: async (userId: string, addressId: string, addressData: any) => {
    const address = await prisma.userAddress.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new AppError("Address not found", 404);
    }

    // Verify that this address belongs to the user making the request
    if (address.userId !== userId) {
      throw new AppError("Unauthorized access to this address", 403);
    }

    // If setting this address as default, update all other addresses
    if (addressData.isDefault) {
      await prisma.userAddress.updateMany({
        where: { 
          userId: userId,
          id: { not: addressId }
        },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { id: addressId },
      data: addressData,
    });

    return updatedAddress;
  },

  deleteAddress: async (userId: string, addressId: string) => {
    const address = await prisma.userAddress.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new AppError("Address not found", 404);
    }

    // Verify that this address belongs to the user making the request
    if (address.userId !== userId) {
      throw new AppError("Unauthorized access to this address", 403);
    }

    await prisma.userAddress.delete({
      where: { id: addressId },
    });

    // If the deleted address was the default, set another address as default if available
    if (address.isDefault) {
      const remainingAddress = await prisma.userAddress.findFirst({
        where: { userId: userId }
      });
      
      if (remainingAddress) {
        await prisma.userAddress.update({
          where: { id: remainingAddress.id },
          data: { isDefault: true }
        });
      }
    }

    return { message: "Address deleted successfully" };
  },
}