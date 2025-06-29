import { prisma } from "../../../shared/prisma";
import { AppError } from "../../../utils/errors";

export const addressService = {
  getAddress: async (userId: string) => {
    const address = await prisma.userAddress.findFirst({
      where: { userId: userId },
    });

    if (!address) {
      throw new AppError("Address not found", 404);
    }

    return address;
  },

  createAddress: async (userId: string, addressData: any) => {
    const existingAddress = await prisma.userAddress.findFirst({
      where: { userId: userId },
    });

    if (existingAddress) {
      throw new AppError("Address already exists for this user", 400);
    }

    const address = await prisma.userAddress.create({
      data: {
        ...addressData,
        userId,
      },
    });

    return address;
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

        return { message: "Address deleted successfully" };
    },
}