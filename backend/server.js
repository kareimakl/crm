import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Get all items
app.get("/api/items", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all trips
app.get("/api/trips", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM trips ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all tickets
app.get("/api/tickets", async (req, res) => {
  try {
    const { client } = req.query;
    let result;
    if (client) {
      result = await pool.query(
        `
        SELECT t.*, s.name as supply_name, s.type as supply_type, s.supplier as supply_supplier 
        FROM tickets t 
        LEFT JOIN supplies s ON t.supply_id = s.id 
        WHERE t.client ILIKE $1 
        ORDER BY t.id
      `,
        [`%${client}%`]
      );
    } else {
      result = await pool.query(`
        SELECT t.*, s.name as supply_name, s.type as supply_type, s.supplier as supply_supplier 
        FROM tickets t 
        LEFT JOIN supplies s ON t.supply_id = s.id 
        ORDER BY t.id
      `);
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all supplies
app.get("/api/supplies", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM supplies ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get distinct supply types
app.get("/api/supplies/types", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT type FROM supplies ORDER BY type"
    );
    res.json(result.rows.map((row) => row.type));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get supplies by type with quantity > 0
app.get("/api/supplies/type/:type", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM supplies WHERE type = $1 AND quantity > 0 ORDER BY name",
      [req.params.type]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add a new supply
app.post("/api/supplies", async (req, res) => {
  const { name, type, price, quantity, supplier, invoice_id, client } =
    req.body;

  try {
    let invoiceId = invoice_id;

    // 1. If no invoice_id provided, create a new invoice first
    if (!invoiceId) {
      const invoiceResult = await pool.query(
        "INSERT INTO invoices (client, invoice_date, total_price) VALUES ($1, CURRENT_DATE, 0) RETURNING id",
        [client || null]
      );
      invoiceId = invoiceResult.rows[0].id;
    }

    // 2. Insert the supply with the obtained or provided invoice_id
    const result = await pool.query(
      `INSERT INTO supplies (name, type, price, quantity, supplier, invoice_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, type, price, quantity, supplier, invoiceId]
    );

    // 3. Update total_price in invoice by summing related tickets and supplies
    await pool.query(
      `UPDATE invoices SET total_price = COALESCE((
          SELECT SUM(price * quantity) FROM tickets WHERE invoice_id = $1
        ), 0) + COALESCE((
          SELECT SUM(price * quantity) FROM supplies WHERE invoice_id = $1
        ), 0)
       WHERE id = $1`,
      [invoiceId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update supply quantity (decrease by 1)
app.put("/api/supplies/:id/decrease", async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE supplies SET quantity = quantity - 1 WHERE id = $1 AND quantity > 0 RETURNING *",
      [req.params.id]
    );
    if (result.rowCount === 0)
      return res
        .status(404)
        .json({ error: "Not found or no quantity available" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a supply
app.delete("/api/supplies/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM supplies WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all pilgrims
app.get("/api/pilgrims", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pilgrims ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add a new pilgrim
app.post("/api/pilgrims", async (req, res) => {
  const {
    name,
    nationality,
    id_number,
    phone,
    package: pkg,
    hotel,
    hotel_cost,
    bus,
    bus_cost,
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO pilgrims (name, nationality, id_number, phone, package, hotel, hotel_cost, bus, bus_cost) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        name,
        nationality,
        id_number,
        phone,
        pkg,
        hotel,
        hotel_cost,
        bus,
        bus_cost,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a pilgrim
app.delete("/api/pilgrims/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM pilgrims WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add a new ticket
app.post("/api/tickets", async (req, res) => {
  const {
    trip_id,
    name,
    type,
    price,
    quantity,
    date,
    client,
    target,
    delivery,
    return_policy,
    supply_id,
    service_type,
    invoice_id,
  } = req.body;

  const client_ = client || null;
  const phone_ = req.body.phone || "+966500000000";

  try {
    let invoiceId = invoice_id;

    // 1. If no invoice_id provided, create a new invoice first
    if (!invoiceId) {
      const invoiceResult = await pool.query(
        "INSERT INTO invoices (client, invoice_date, total_price) VALUES ($1, CURRENT_DATE, 0) RETURNING id",
        [client_]
      );
      invoiceId = invoiceResult.rows[0].id;
    }

    // 2. Insert the ticket with the obtained or provided invoice_id
    const ticketResult = await pool.query(
      `INSERT INTO tickets 
       (trip_id, name, type, price, quantity, date, client, target, delivery, return_policy, phone, supply_id, service_type, invoice_id, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [
        trip_id,
        name,
        type,
        price,
        quantity,
        date,
        client_,
        target,
        delivery,
        return_policy,
        phone_,
        supply_id,
        service_type,
        invoiceId,
      ]
    );

    // 3. Decrease supply quantity if supply_id is provided
    if (supply_id) {
      await pool.query(
        "UPDATE supplies SET quantity = quantity - 1 WHERE id = $1 AND quantity > 0",
        [supply_id]
      );
    }

    // 4. Update total_price in invoice by summing related tickets and supplies
    //    (assuming supplies table has invoice_id and price * quantity)
    await pool.query(
      `UPDATE invoices SET total_price = COALESCE((
          SELECT SUM(price * quantity) FROM tickets WHERE invoice_id = $1
        ), 0) + COALESCE((
          SELECT SUM(price * quantity) FROM supplies WHERE invoice_id = $1
        ), 0)
       WHERE id = $1`,
      [invoiceId]
    );

    res.status(201).json(ticketResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update a ticket
app.put("/api/tickets/:id", async (req, res) => {
  const {
    name,
    type,
    price,
    quantity,
    date,
    client,
    target,
    delivery,
    return_policy,
    phone,
  } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tickets SET name = $1, type = $2, price = $3, quantity = $4, date = $5, client = $6, target = $7, delivery = $8, return_policy = $9, phone = $10 WHERE id = $11 RETURNING *",
      [
        name,
        type,
        price,
        quantity,
        date,
        client,
        target,
        delivery,
        return_policy,
        phone,
        req.params.id,
      ]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a ticket
app.delete("/api/tickets/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM tickets WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add a new trip
app.post("/api/trips", async (req, res) => {
  const {
    trip_type,
    supplier,
    trip_name,
    trip_date,
    notes,
    created_at,
    driver_name,
    assistant_driver,
    trip_number,
    bus_number,
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO trips (trip_type, supplier, trip_name, trip_date, notes, created_at, driver_name, assistant_driver, trip_number, bus_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        trip_type,
        supplier,
        trip_name,
        trip_date,
        notes,
        created_at,
        driver_name,
        assistant_driver,
        trip_number,
        bus_number,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a trip
app.delete("/api/trips/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM trips WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Staff (HR) endpoints
app.get("/api/staff", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM staff ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/staff", async (req, res) => {
  const { name, job, branch, salary, present } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO staff (name, job, branch, salary, present) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, job, branch, salary, present]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/staff/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM staff WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Loyalty endpoints
app.get("/api/loyalty", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM loyalty_clients ORDER BY points DESC LIMIT 10"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Dashboard stats endpoint
app.get("/api/dashboard-stats", async (req, res) => {
  try {
    const [
      pilgrimsCount,
      ticketsCount,
      tripsCount,
      staffCount,
      loyaltyStats,
      bestPilgrim,
      totalRevenue,
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) as count FROM pilgrims"),
      pool.query("SELECT COUNT(*) as count FROM tickets"),
      pool.query("SELECT COUNT(*) as count FROM trips"),
      pool.query("SELECT COUNT(*) as count FROM staff"),
      pool.query(
        "SELECT COALESCE(SUM(points),0) as total_points, COALESCE(AVG(rating),0) as avg_rating FROM loyalty_clients"
      ),
      pool.query(
        "SELECT name, level, points FROM loyalty_clients ORDER BY points DESC LIMIT 1"
      ),
      pool.query(
        "SELECT COALESCE(SUM(price * quantity),0) as total_revenue FROM tickets"
      ),
    ]);

    res.json({
      totalPilgrims: parseInt(pilgrimsCount.rows[0].count),
      totalTickets: parseInt(ticketsCount.rows[0].count),
      totalTrips: parseInt(tripsCount.rows[0].count),
      totalStaff: parseInt(staffCount.rows[0].count),
      totalPoints: parseInt(loyaltyStats.rows[0].total_points),
      avgRating: parseFloat(loyaltyStats.rows[0].avg_rating).toFixed(1),
      bestPilgrim: bestPilgrim.rows[0] || null,
      totalRevenue: parseInt(totalRevenue.rows[0].total_revenue),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Dashboard charts endpoint
app.get("/api/dashboard-charts", async (req, res) => {
  try {
    // Get package distribution from tickets
    const packageDistribution = await pool.query(`
      SELECT 
        type as name,
        COUNT(*) as value,
        CASE 
          WHEN type = 'مستلزمات عمرة' THEN '#10B981'
          WHEN type = 'طيران' THEN '#3B82F6'
          WHEN type = 'فندق' THEN '#F59E0B'
          WHEN type = 'باص' THEN '#EF4444'
          ELSE '#6B7280'
        END as color
      FROM tickets 
      GROUP BY type
    `);

    // Get weekly revenue (last 7 days)
    const weeklyRevenue = await pool.query(`
      SELECT 
        TO_CHAR(DATE(created_at), 'Day') as day,
        SUM(price * quantity) as value,
        15000 as target
      FROM tickets 
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    // Get pilgrim growth (last 6 months)
    const pilgrimGrowth = await pool.query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', created_at), 'Month') as month,
        COUNT(*) as pilgrims,
        SUM(price * quantity) as revenue
      FROM tickets 
      WHERE created_at >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `);

    // Get revenue vs expenses (last 7 days)
    const revenueExpenses = await pool.query(`
      SELECT 
        TO_CHAR(DATE(created_at), 'DD') as day,
        SUM(price * quantity) as revenue,
        SUM(price * quantity * 0.7) as expenses
      FROM tickets 
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    res.json({
      packageDistribution: packageDistribution.rows,
      weeklyRevenue: weeklyRevenue.rows,
      pilgrimGrowth: pilgrimGrowth.rows,
      revenueExpenses: revenueExpenses.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Recent bookings endpoint
app.get("/api/recent-bookings", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        client as name,
        type as package,
        phone,
        price * quantity as total_price,
        DATE(created_at) as date
      FROM tickets 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Pilgrims stats/cards/sidebar endpoint
app.get("/api/pilgrims-stats", async (req, res) => {
  try {
    // Estimated cost: sum of all ticket prices for pilgrims
    const estimatedCost = await pool.query(
      "SELECT COALESCE(SUM(price * quantity),0) as cost FROM tickets"
    );
    // Total clients: count of unique clients in tickets
    const totalClients = await pool.query(
      "SELECT COUNT(DISTINCT client) as count FROM tickets"
    );
    // Total members: count of unique phone numbers in tickets
    const totalMembers = await pool.query(
      "SELECT COUNT(DISTINCT phone) as count FROM tickets"
    );
    // New pilgrims this month
    const newPilgrims = await pool.query(
      `SELECT COUNT(*) as count FROM pilgrims WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)`
    );
    // Program performance: group by program name (type) and count
    const programPerformance = await pool.query(
      "SELECT type as name, COUNT(*) as count FROM tickets GROUP BY type"
    );
    // Weekly top customers: top 4 by points in loyalty_clients
    const topCustomers = await pool.query(
      "SELECT name, points, avatar_url FROM loyalty_clients ORDER BY points DESC LIMIT 4"
    );
    // Satisfaction rate: avg rating from loyalty_clients
    const satisfaction = await pool.query(
      "SELECT COALESCE(AVG(rating),0) as rate, COUNT(*) as count FROM loyalty_clients"
    );

    res.json({
      estimatedCost: parseInt(estimatedCost.rows[0].cost),
      totalClients: parseInt(totalClients.rows[0].count),
      totalMembers: parseInt(totalMembers.rows[0].count),
      newPilgrims: parseInt(newPilgrims.rows[0].count),
      programPerformance: programPerformance.rows,
      topCustomers: topCustomers.rows,
      satisfaction: {
        rate: parseFloat(satisfaction.rows[0].rate).toFixed(1),
        count: parseInt(satisfaction.rows[0].count),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Custom sections endpoints
app.get("/api/custom-sections", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM custom_sections ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/custom-sections", async (req, res) => {
  const { label, type, options } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO custom_sections (label, type, options) VALUES ($1, $2, $3) RETURNING *",
      [label, type, JSON.stringify(options)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/custom-sections/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM custom_sections WHERE id = $1",
      [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Nationalities endpoints
app.get("/api/nationalities", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM nationalities ORDER BY name"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/nationalities", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO nationalities (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/nationalities/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM nationalities WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Channels endpoints
app.get("/api/channels", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM channels ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/channels", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO channels (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/channels/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM channels WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Representatives endpoints
app.get("/api/representatives", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM representatives ORDER BY name"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/representatives", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO representatives (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/representatives/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM representatives WHERE id = $1",
      [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Trip custom sections endpoints
app.get("/api/trip-custom-sections", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM trip_custom_sections ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/trip-custom-sections", async (req, res) => {
  const { label, type, options } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO trip_custom_sections (label, type, options) VALUES ($1, $2, $3) RETURNING *",
      [label, type, JSON.stringify(options)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/trip-custom-sections/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM trip_custom_sections WHERE id = $1",
      [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get invoices with their tickets and supplies
app.get("/api/invoices-with-services", async (req, res) => {
  try {
    // 1. Get all invoices that have tickets or supplies
    const invoicesResult = await pool.query(`
      SELECT DISTINCT i.*
      FROM invoices i
      LEFT JOIN tickets t ON t.invoice_id = i.id
      LEFT JOIN supplies s ON s.invoice_id = i.id
      WHERE t.id IS NOT NULL OR s.id IS NOT NULL
      ORDER BY i.id
    `);

    const invoices = invoicesResult.rows;

    // 2. For each invoice, get the related tickets and supplies
    // (Can be optimized with joins or batch queries if you expect large data)
    for (const invoice of invoices) {
      const [ticketsResult, suppliesResult] = await Promise.all([
        pool.query("SELECT * FROM tickets WHERE invoice_id = $1 ORDER BY id", [
          invoice.id,
        ]),
        pool.query("SELECT * FROM supplies WHERE invoice_id = $1 ORDER BY id", [
          invoice.id,
        ]),
      ]);

      invoice.tickets = ticketsResult.rows;
      invoice.supplies = suppliesResult.rows;
    }

    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
