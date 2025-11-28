/**
 * API Route: Clients Management
 * GET /api/clients - List all clients
 * POST /api/clients - Create new client
 */

import { NextRequest, NextResponse } from "next/server";
import { Client, ClientStatus } from "@/types/audit";

// Temporary in-memory storage (replace with database)
let clients: Client[] = [];

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const status = searchParams.get("status") as ClientStatus | null;

    // Filter clients
    let filteredClients = [...clients];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredClients = filteredClients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower) ||
          client.contact.toLowerCase().includes(searchLower) ||
          client.industry.toLowerCase().includes(searchLower)
      );
    }

    if (status && status !== "all") {
      filteredClients = filteredClients.filter(
        (client) => client.status === status
      );
    }

    // Sort by creation date (newest first if we had created_at field)
    filteredClients.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      data: filteredClients,
      meta: {
        total: filteredClients.length,
        filters: {
          search,
          status,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch clients",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientData: Omit<Client, "id"> = await request.json();

    // Validate required fields
    if (!clientData.name || !clientData.email || !clientData.contact) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and contact are required fields",
        },
        { status: 400 }
      );
    }

    // Check for duplicate email
    if (clients.some((client) => client.email === clientData.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "A client with this email already exists",
        },
        { status: 400 }
      );
    }

    // Create new client
    const newClient: Client = {
      id: `client-${Date.now()}`,
      ...clientData,
      status: clientData.status || "active",
      certifications: clientData.certifications || [],
      healthScore: clientData.healthScore || 85,
    };

    // Add to storage
    clients.push(newClient);

    return NextResponse.json(
      {
        success: true,
        data: newClient,
        message: "Client created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create client",
      },
      { status: 500 }
    );
  }
}