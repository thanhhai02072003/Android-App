CREATE TABLE gmails (
    gmailuser VARCHAR(50),
    gmailpass VARCHAR(50)
)

CREATE TABLE users (
    phonenum VARCHAR(50) PRIMARY KEY,
    password VARCHAR(50) UNIQUE NOT NULL
)

CREATE TABLE otp (
    otpcode VARCHAR(10)
)

CREATE SEQUENCE reminder_id_sequence;

CREATE TABLE reminder (
    reminder_id VARCHAR(50) PRIMARY KEY DEFAULT 'R' || nextval('reminder_id_sequence'),
    task_name VARCHAR(50) NOT NULL,
    reminder_description TEXT,
    reminder_time TIME,
    on_off BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(50) /*NOT NULL*/
);

CREATE OR REPLACE FUNCTION set_reminder_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.reminder_id := 'R' || nextval('reminder_id_sequence');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_reminder_id_trigger
BEFORE INSERT ON reminder
FOR EACH ROW
EXECUTE FUNCTION set_reminder_id();

CREATE TABLE configurations (
	area VARCHAR(50) PRIMARY KEY,
	receive_notification TEXT,
	upper_limit REAL NOT NULL,
	base_limit REAL NOT NULL,
	pump_mode BOOLEAN NOT NULL DEFAULT FALSE,
	moisture_mode BOOLEAN NOT NULL DEFAULT FALSE,
  moisture_base_limit REAL,
  moisture_upper_limit REAL,
	username VARCHAR(50) NOT NULL
);

CREATE TABLE device (
	device_id VARCHAR(50) PRIMARY KEY,
	device_type VARCHAR(25) NOT NULL,
	device_location VARCHAR(10),
	username VARCHAR(50)
);	
CREATE TABLE record (
	record_id INT PRIMARY KEY,
	record_date DATE NOT NULL,
	device_id VARCHAR(50) NOT NULL
);
CREATE TABLE moisture_record (
	moisture_record_id INT PRIMARY KEY,
	moisture REAL NOT NULL
);
CREATE TABLE temperature_record (
	temperature_record_id INT PRIMARY KEY,
	temperature REAL NOT NULL
);
CREATE TABLE light_record (
	light_record_id INT PRIMARY KEY,
	lux REAL NOT NULL
);
CREATE TABLE activity (
	activity_id SERIAL PRIMARY KEY,
	activity_time DATE NOT NULL,
	acttivity_description VARCHAR(100),
	device_id VARCHAR(50) NOT NULL
);

ALTER TABLE reminder
ADD FOREIGN KEY (username) REFERENCES users(phonenum);

ALTER TABLE configurations
ADD FOREIGN KEY (username) REFERENCES users(phonenum);

ALTER TABLE device
ADD FOREIGN KEY (username) REFERENCES users(phonenum);

ALTER TABLE record
ADD FOREIGN KEY (device_id) REFERENCES device(device_id);

ALTER TABLE activity
ADD FOREIGN KEY (device_id) REFERENCES device(device_id);

ALTER TABLE moisture_record
ADD FOREIGN KEY (moisture_record_id) REFERENCES record(record_id);

ALTER TABLE temperature_record
ADD FOREIGN KEY (temperature_record_id) REFERENCES record(record_id);

ALTER TABLE light_record
ADD FOREIGN KEY (light_record_id) REFERENCES record(record_id);

INSERT INTO device (device_id, device_type, device_location, username) VALUES 
	('1', 'temp_sensor', 'BK', 'username1'),
	('2', 'light_sensor', 'BK', 'username1'),
	('L1', 'light', 'BK', 'username1'),
	('L2', 'light', 'BK', 'username1'),
	('L3', 'light', 'BK', 'username1'),
  	('M1', 'moisture', 'BK', 'username1');
  
INSERT INTO users VALUES 
('0112233445','123456'),
('0123456789','123456789'),
('0192938281','HCMUTK21'),
('0234493233','motlongvibachkhoa'),
('0429929101','bachkhoamuonnam'),
('0566778899','0878785'),
('0847292921','yeubku123'),
('0912812919','123445'),
('0912912191','1232454432'),
('0987654321','sinhviennam3')

INSERT INTO gmails VALUES
('thanhhai123@gmail.com','020703'),
('quanghien132@gmail.com','141200'),
('lehien321@gmail.com','Hien123'),
('nguyenduong312@gmail.com','smartfarm12345'),
('hoangdai213@gmail.com','localhost111'),
('nguyenhai1412@gmail.com','nhai112233'),
('hienquang023@gmail.com','aabbccdd'),
('hienle534@gmail.com','bigbang'),
('duongnguyen029@gmail.com','BoyHCMUT'),
('daivu555@gmail.com','014DaiVu')

INSERT INTO otp VALUES
('012345'),
('923828'),
('298390'),
('029309'),
('928398'),
('203900'),
('209309'),
('476568'),
('856887'),
('356769'),
('029838'),
('123456'),
('434565'),
('434679'),
('678976'),
('548759'),
('978574'),
('345678'),
('865865'),
('546779')


-- Sample data for configurations table
INSERT INTO configurations (area, receive_notification, upper_limit, base_limit, pump_mode, moisture_mode, moisture_base_limit, moisture_upper_limit, username) VALUES
('Area1', 'Email', 75.0, 50.0, TRUE, TRUE, 30.0, 60.0, '0112233445'),
('Area2', 'SMS', 80.0, 55.0, FALSE, TRUE, 35.0, 65.0, '0123456789'),
('Area3', 'Email', 70.0, 45.0, TRUE, FALSE, 25.0, 55.0, '0192938281');
INSERT INTO device (device_id, device_type, device_location, username) VALUES 
	('1', 'temp_sensor', 'BK', '0112233445'),
	('2', 'light_sensor', 'BK', '0112233445'),
	('L1', 'light', 'BK', '0112233445'),
	('L2', 'light', 'BK', '0112233445'),
	('L3', 'light', 'BK', '0112233445'),
  	('M1', 'moisture', 'BK', '0112233445');

-- Sample data for record table
INSERT INTO record (record_id, record_date, device_id) VALUES
(1, '2024-01-01', '1'),
(2, '2024-01-02', '2'),
(3, '2024-01-03', 'L1'),
(4, '2024-01-04', 'L2'),
(5, '2024-01-05', 'M1');

-- Sample data for moisture_record table
INSERT INTO moisture_record (moisture_record_id, moisture) VALUES
(1, 40.5),
(2, 42.0),
(3, 38.0);

-- Sample data for temperature_record table
INSERT INTO temperature_record (temperature_record_id, temperature) VALUES
(1, 22.5),
(2, 23.0),
(3, 21.5);

-- Sample data for light_record table
INSERT INTO light_record (light_record_id, lux) VALUES
(1, 300),
(2, 350),
(3, 320);

-- Sample data for activity table
INSERT INTO activity (activity_time, acttivity_description, device_id) VALUES
('2024-01-01', 'Checked moisture level', '1'),
('2024-01-02', 'Checked light level', '2'),
('2024-01-03', 'Turned on light', 'L1'),
('2024-01-04', 'Turned off light', 'L2'),
('2024-01-05', 'Checked moisture level', 'M1');
