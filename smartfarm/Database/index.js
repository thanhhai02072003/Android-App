const express = require("express");
const cors = require("cors");
const db_config = require("./db_config");

const app = express();
const port = 3000;
const pool = db_config;

pool.connect();

app.use(cors());
app.use(express.json());

app.get("/datas", async (req, res) => {
  try {
    const result = await pool.query("SELECT phonenum, password FROM USERS");
    const data = result.rows;
    let phonenumList = [];
    let passwordList = [];
    data.forEach((row) => {
      phonenumList.push(row.phonenum);
      passwordList.push(row.password);
    });

    const result1 = await pool.query("SELECT gmailuser, gmailpass FROM gmails");
    const data1 = result1.rows;
    let gmailList = [];
    let gmailpassList = [];
    data1.forEach((row) => {
      gmailList.push(row.gmailuser);
      gmailpassList.push(row.gmailpass);
    });

    const result2 = await pool.query("SELECT otpcode FROM OTP");
    const data2 = result2.rows;
    let otpcodeList = [];
    data2.forEach((row) => {
      otpcodeList.push(row.otpcode);
    });

    res.json({
      phonenum: phonenumList,
      password: passwordList,
      gmailuser: gmailList,
      gmailpass: gmailpassList,
      otpcode: otpcodeList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.put("/change", (req, res) => {
  const { phonenumbers, newpassword } = req.body;
  pool.query(
    "UPDATE users SET password = $1 WHERE phonenum = $2",
    [newpassword, phonenumbers],
    (err, result) => {
      if (err) {
        console.error("Error updating password", err.message);
        res.status(500).send("Server error");
      } else {
        res.status(200).send("Password updated successfully");
      }
    }
  );
});

app.get("/latest-light", (req, res) => {
  pool.query(
    "SELECT lux FROM light_record ORDER BY light_record_id DESC LIMIT 1",
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Internal server error");
      } else {
        if (result.rows.length === 0) {
          res.status(404).send("No data found");
        } else {
          const luxValue = result.rows[0].lux;
          res.json({ lux: luxValue });
        }
      }
    }
  );
});

// get all light devices that have the name of the user
app.get("/light/:name", async (req, res) => {
  try {
    const username = req.params.name;
    const allLights = await pool.query(
      "SELECT * FROM device WHERE device_type = 'light' AND username = $1",
      [username]
    );
    res.json(allLights.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get the latest activity of the device that has the device id
app.get("/activity/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const latestActivity = await pool.query(
      "SELECT acttivity_description FROM activity WHERE device_id = $1 ORDER BY activity_id DESC LIMIT 1",
      [id]
    );
    if (latestActivity.rows.length === 0) {
      res.json({ acttivity_description: "OFF" });
    } else {
      res.json(latestActivity.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
  }
});

//add a new activity to the activity table that has the activity_id, activity time, activity description, and the device id
app.post("/activity", async (req, res) => {
  try {
    const moment = require("moment-timezone");
    const { acttivity_description, device_id } = req.body;

    const activity_time = moment().tz("Asia/Ho_Chi_Minh").format();

    const newActivity = await pool.query(
      "INSERT INTO activity (activity_time, acttivity_description, device_id) VALUES ($1, $2, $3) RETURNING *",
      [activity_time, acttivity_description, device_id]
    );
    res.json(newActivity.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//add a new device to the device table that has the device name , type, and location of the light and the name of the user
app.post("/light/:name", async (req, res) => {
  try {
    const username = req.params.name;
    const { device_id, device_type, device_location } = req.body;
    const newLight = await pool.query(
      "INSERT INTO device (device_id, device_type, device_location, username) VALUES($1, $2, $3, $4) RETURNING *",
      [device_id, device_type, device_location, username]
    );
    res.json(newLight.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//delete a light device from the device table that has the device id
app.delete("/light/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //delete the activities that have the device id
    const deleteActivities = await pool.query(
      "DELETE FROM activity WHERE device_id = $1",
      [id]
    );
    //then delete the light device that has the device id
    const deleteLight = await pool.query(
      "DELETE FROM device WHERE device_id = $1",
      [id]
    );
    res.json("Light was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

// get latest lux data
app.get("/lux", async (req, res) => {
  try {
    const latestLux = await pool.query(
      "SELECT lux FROM light_record ORDER BY light_record_id DESC LIMIT 1"
    );
    res.json(latestLux.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// get all activities from the activity table
app.get("/activities", async (req, res) => {
  try {
    const allActivities = await pool.query("SELECT * FROM activity");
    res.json(allActivities.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/latest-temperature", (req, res) => {
  pool.query(
    "SELECT temperature FROM temperature_record ORDER BY temperature_record_id DESC LIMIT 1",
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Internal server error");
      } else {
        if (result.rows.length === 0) {
          res.status(404).send("No data found");
        } else {
          const temperatureValue = result.rows[0].temperature;
          res.json({ temperature: temperatureValue });
        }
      }
    }
  );
});

app.get("/base-limit", (req, res) => {
  pool.query(
    "SELECT base_limit FROM configurations WHERE area = 'Area1'",
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Internal server error");
      } else {
        if (result.rows.length === 0) {
          res.status(404).send("No data found");
        } else {
          const baseLimit = result.rows[0].base_limit;
          res.json({ base_limit: baseLimit });
        }
      }
    }
  );
});

app.get("/upper-limit", (req, res) => {
  pool.query(
    "SELECT upper_limit FROM configurations WHERE area = 'Area1'",
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Internal server error");
      } else {
        if (result.rows.length === 0) {
          res.status(404).send("No data found");
        } else {
          const upperLimit = result.rows[0].upper_limit;
          res.json({ upper_limit: upperLimit });
        }
      }
    }
  );
});

app.get("/latest-moisture", (request, response) => {
  pool.query(
    "SELECT moisture FROM moisture_record ORDER BY moisture_record_id DESC LIMIT 1",
    (error, result) => {
      if (error) {
        console.error("Error executing query:", error.message);
        response.status(500).send("Internal server error");
      } else {
        if (result.rows.length === 0) {
          response.status(400).send("No data found");
        } else {
          response.json(result.rows[0]);
        }
      }
    }
  );
});

app.get("/moisture-configuration", (request, response) => {
  pool.query(
    "SELECT pump_mode, moisture_mode, moisture_base_limit, moisture_upper_limit FROM configurations WHERE area = 'Area1'",
    (error, result) => {
      if (error) {
        console.error("Error executing query:", error.message);
      } else {
        if (result.rows.length === 0) {
          response.status(400).send("No data found");
        } else {
          response.json(result.rows[0]);
        }
      }
    }
  );
});

app.get("/temperature/current-month", async (req, res) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  try {
    const query = `
    SELECT EXTRACT(DAY FROM record.record_date) AS day, temperature
    FROM temperature_record
    JOIN record ON temperature_record.temperature_record_id = record.record_id
    WHERE EXTRACT(MONTH FROM record.record_date) = $1
        AND EXTRACT(YEAR FROM record.record_date) = $2
    `;
    const result = await pool.query(query, [currentMonth, currentYear]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query:", error.message);
    res.status(500).send("Internal server error");
  }
});

app.get("/temperature/current-year", async (req, res) => {
  const currentYear = new Date().getFullYear();

  try {
    const query = `
    SELECT EXTRACT(MONTH FROM record.record_date) AS month, AVG(temperature) AS average_temperature
    FROM temperature_record
    JOIN record ON temperature_record.temperature_record_id = record.record_id
    WHERE EXTRACT(YEAR FROM record.record_date) = $1
    GROUP BY EXTRACT(MONTH FROM record.record_date)
    `;
    const result = await pool.query(query, [currentYear]);

    // Convert result to format expected by the frontend
    const formattedData = result.rows.map((row) => ({
      month: row.month,
      average_temperature: row.average_temperature,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error executing query:", error.message);
    res.status(500).send("Internal server error");
  }
});

app.get("/lights/current-month", async (req, res) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  try {
    const query = `
    SELECT EXTRACT(DAY FROM record.record_date) AS day, lux
    FROM light_record
    JOIN record ON light_record.light_record_id = record.record_id
    WHERE EXTRACT(MONTH FROM record.record_date) = $1
    AND EXTRACT(YEAR FROM record.record_date) = $2
    `;
    const result = await pool.query(query, [currentMonth, currentYear]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query:", error.message);
    res.status(500).send("Internal server error");
  }
});

app.get("/lights/current-year", async (req, res) => {
  const currentYear = new Date().getFullYear();

  try {
    const query = `
    SELECT EXTRACT(MONTH FROM record.record_date) AS month, AVG(lux) AS average_light
    FROM light_record
    JOIN record ON light_record.light_record_id = record.record_id
    WHERE EXTRACT(YEAR FROM record.record_date) = $1
    GROUP BY EXTRACT(MONTH FROM record.record_date)
    `;
    const result = await pool.query(query, [currentYear]);
    const formattedData = result.rows.map((row) => ({
      month: row.month,
      average_light: row.average_light,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error executing query:", error.message);
    res.status(500).send("Internal server error");
  }
});

app.get("/moisture/current-month", async (req, res) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  try {
    const query = `
    SELECT EXTRACT(DAY FROM record.record_date) AS day, moisture
    FROM moisture_record
    JOIN record ON moisture_record.moisture_record_id = record.record_id
    WHERE EXTRACT(MONTH FROM record.record_date) = $1
        AND EXTRACT(YEAR FROM record.record_date) = $2
    `;
    const result = await pool.query(query, [currentMonth, currentYear]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query:", error.message);
    res.status(500).send("Internal server error");
  }
});

app.get("/moisture/current-year", async (req, res) => {
  const currentYear = new Date().getFullYear();

  try {
    const query = `
    SELECT EXTRACT(MONTH FROM record.record_date) AS month, AVG(moisture) AS average_moisture
    FROM moisture_record
    JOIN record ON moisture_record.moisture_record_id = record.record_id
    WHERE EXTRACT(YEAR FROM record.record_date) = $1
    GROUP BY EXTRACT(MONTH FROM record.record_date)
    `;
    const result = await pool.query(query, [currentYear]);

    // Convert result to format expected by the frontend
    const formattedData = result.rows.map((row) => ({
      month: row.month,
      average_moisture: row.average_moisture,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error executing query:", error.message);
    res.status(500).send("Internal server error");
  }
});

app.get("/tasks", (req, res) => {
  pool.query(
    "SELECT task_name, reminder_id, reminder_description, reminder_time, on_off FROM reminder",
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Internal server error");
      } else {
        res.json(result.rows);
      }
    }
  );
});
//---------------- PUT REQUEST--------------------

app.put("/put-upper-limit", (req, res) => {
  const { upperLimit } = req.body;
  pool.query(
    "UPDATE configurations SET upper_limit = $1 WHERE area = 'Area1'",
    [upperLimit],
    (err, result) => {
      if (err) {
        console.error("Error updating upper_limit:", err.message);
        res.status(500).send("Internal server error");
      } else {
        res.status(200).send("Upper limit updated successfully");
      }
    }
  );
});

app.put("/put-base-limit", (req, res) => {
  const { baseLimit } = req.body;
  pool.query(
    "UPDATE configurations SET base_limit = $1 WHERE area = 'Area1'",
    [baseLimit],
    (err, result) => {
      if (err) {
        console.error("Error updating base_limit:", err.message);
        res.status(500).send("Internal server error");
      } else {
        res.status(200).send("Upper limit updated successfully");
      }
    }
  );
});

app.put("/put-moisture-limit", (request, response) => {
  const { baseLimit, moistureLimit } = request.body;
  pool.query(
    "Update configurations SET moisture_base_limit = $1, moisture_upper_limit = $2 WHERE area = 'Area1'",
    [baseLimit, moistureLimit],
    (error, result) => {
      if (error) {
        console.error("Error updating moisture range:", error.message);
        response.status(500).send("Internal server error");
      } else {
        response.status(200).send("Moisture range updated successfully");
      }
    }
  );
});

app.put("/put-pump-mode", (request, response) => {
  const { isPumping } = request.body;
  pool.query(
    "UPDATE configurations SET pump_mode = $1 WHERE area = 'Area1'",
    [isPumping],
    (error, result) => {
      if (error) {
        console.error("Error toggling pump mode:", error.message);
        response.status(500).send("Internal server error");
      }
    }
  );
});

app.put("/put-moisture-mode", (request, response) => {
  const { isAutomatic } = request.body;
  pool.query(
    "UPDATE configurations SET moisture_mode = $1 WHERE area = 'Area1'",
    [isAutomatic],
    (error, result) => {
      if (error) {
        console.error("Error toggling moisture mode", error.message);
        response.status(500).send("Internal server error");
      }
    }
  );
});

app.put("/put-form-limits", (req, res) => {
  const { tempBase, tempUpper } = req.body;
  // Assuming you're using a database connection pool named 'pool'
  pool.query(
    "UPDATE configurations SET base_limit = $1, upper_limit = $2 WHERE area = 'Area1'",
    [tempBase, tempUpper],
    (err, result) => {
      if (err) {
        console.error("Error updating form limits:", err.message);
        res.status(500).send("Internal server error");
      } else {
        res.status(200).send("Form limits updated successfully");
      }
    }
  );
});

app.post("/tasks", (req, res) => {
  const { reminder_description, reminder_time, on_off, task_name } = req.body;
  pool.query(
    "INSERT INTO reminder (reminder_description, reminder_time, on_off, task_name) VALUES ($1, $2, $3, $4)",
    [reminder_description, reminder_time, on_off, task_name],
    (err) => {
      if (err) {
        console.error("Error inserting task:", err.message);
        res.status(500).send("Internal server error");
      } else {
        res.status(201).send("Task created successfully");
      }
    }
  );
});

app.put("/tasks/:id", (req, res) => {
  const id = req.params.id;
  const { reminder_description, reminder_time, on_off } = req.body;
  pool.query(
    "UPDATE reminder SET reminder_description = $1, reminder_time = $2, on_off = $3 WHERE reminder_id = $4",
    [reminder_description, reminder_time, on_off, id],
    (err) => {
      if (err) {
        console.error("Error updating task:", err.message);
        res.status(500).send("Internal server error");
      } else {
        res.status(200).send("Task updated successfully");
      }
    }
  );
});

app.delete("/task_del/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM reminder WHERE reminder_id = $1",
      [taskId]
    );
    if (result.rowCount === 1) {
      res.status(200).json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/task-count", (req, res) => {
  pool.query(
    "SELECT COUNT(*) AS total_reminders FROM reminder",
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Internal server error");
      } else {
        const totalReminders = result.rows[0].total_reminders;
        res.json({ total_reminders: totalReminders });
      }
    }
  );
});
app.post("/deleteTask", (req, res) => {
  const { taskId } = req.body;
  pool.query("DELETE FROM reminder WHERE reminder_id = $1", [taskId], (err) => {
    if (err) {
      console.error("Error deleting task:", err.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Task deleted successfully" });
    }
  });
});
app.get("/", (req, res) => {
  res.send("Welcome to my Express application!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
