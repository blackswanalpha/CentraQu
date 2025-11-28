/**
 * API Route: Individual Client Management
 * GET /api/clients/[id] - Get specific client
 * PUT /api/clients/[id] - Update client
 * DELETE /api/clients/[id] - Delete client
 */

import { NextRequest, NextResponse } from "next/server";
import { Client } from "@/types/audit";

// This would be replaced with database operations
// For now, we'll use a simple array that matches the one in route.ts
// In a real app, this would be a database query
const getClients = (): Client[] => {
  // This is a temporary solution - in production, this would be a database call
  return [];
};

const updateClients = (clients: Client[]): void => {
  // This would update the database
  // For now, we can't persist changes between requests without a database
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const clients = getClients();
    const client = clients.find((c) => c.id === id);

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          error: "Client not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch client",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updateData: Partial<Client> = await request.json();
    const clients = getClients();
    const clientIndex = clients.findIndex((c) => c.id === id);

    if (clientIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Client not found",
        },
        { status: 404 }
      );
    }

    // Validate email uniqueness if email is being updated
    if (
      updateData.email &&
      clients.some((c) => c.email === updateData.email && c.id !== id)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "A client with this email already exists",
        },
        { status: 400 }
      );
    }

    // Update client
    const updatedClient = {
      ...clients[clientIndex],
      ...updateData,
      id, // Ensure ID cannot be changed
    };

    clients[clientIndex] = updatedClient;
    updateClients(clients);

    return NextResponse.json({
      success: true,
      data: updatedClient,
      message: "Client updated successfully",
    });
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update client",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const clients = getClients();
    const clientIndex = clients.findIndex((c) => c.id === id);

    if (clientIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Client not found",
        },
        { status: 404 }
      );
    }

    // Remove client
    const deletedClient = clients[clientIndex];
    clients.splice(clientIndex, 1);
    updateClients(clients);

    return NextResponse.json({
      success: true,
      data: deletedClient,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete client",
      },
      { status: 500 }
    );
  }
}