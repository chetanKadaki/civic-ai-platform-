-- CivicPulse MySQL 8.0 Relational Database Schema
-- Optimized for high-throughput citizen reports, spatial queries, and audit tracking

CREATE DATABASE IF NOT EXISTS civicpulse_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE civicpulse_db;

-- 1. Reports Master Table
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(36) PRIMARY KEY,
    tracking_code VARCHAR(16) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    title VARCHAR(255) NOT NULL,
    raw_description TEXT NOT NULL,
    ai_summary TEXT,
    category ENUM('roads', 'water_drainage', 'waste_sanitation', 'electricity_lighting', 'public_safety', 'parks_trees') NOT NULL,
    validated_category ENUM('roads', 'water_drainage', 'waste_sanitation', 'electricity_lighting', 'public_safety', 'parks_trees'),
    address VARCHAR(255) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    geo_point POINT NOT NULL SRID 4326,
    image_url VARCHAR(512),
    citizen_name VARCHAR(100) NOT NULL,
    citizen_contact VARCHAR(100),
    status ENUM('pending', 'triaged', 'in_progress', 'resolved', 'archived') DEFAULT 'pending',
    priority_total_score INT DEFAULT 0,
    priority_level ENUM('critical', 'high', 'medium', 'low') DEFAULT 'medium',
    severity_score INT DEFAULT 0,
    vulnerability_score INT DEFAULT 0,
    public_impact_score INT DEFAULT 0,
    escalation_score INT DEFAULT 0,
    priority_explanation TEXT,
    is_duplicate BOOLEAN DEFAULT FALSE,
    parent_report_id VARCHAR(36) NULL,
    duplicate_confidence INT DEFAULT 0,
    assigned_department VARCHAR(100),
    assigned_to VARCHAR(100),
    cluster_id VARCHAR(36) NULL,
    SPATIAL INDEX(geo_point),
    INDEX idx_status (status),
    INDEX idx_priority (priority_total_score DESC),
    INDEX idx_zone (zone),
    INDEX idx_category (category),
    FOREIGN KEY (parent_report_id) REFERENCES reports(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 2. Report Status Audit Trail
CREATE TABLE IF NOT EXISTS report_timeline (
    id VARCHAR(36) PRIMARY KEY,
    report_id VARCHAR(36) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    actor VARCHAR(100) NOT NULL,
    actor_role ENUM('citizen', 'ai_system', 'dispatcher', 'field_crew', 'supervisor') NOT NULL,
    status_change ENUM('pending', 'triaged', 'in_progress', 'resolved', 'archived') NULL,
    INDEX idx_report_timeline (report_id, timestamp),
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Civic Standard Operating Procedures (SOPs)
CREATE TABLE IF NOT EXISTS civic_sops (
    id VARCHAR(36) PRIMARY KEY,
    sop_code VARCHAR(32) NOT NULL UNIQUE,
    category ENUM('roads', 'water_drainage', 'waste_sanitation', 'electricity_lighting', 'public_safety', 'parks_trees') NOT NULL,
    title VARCHAR(255) NOT NULL,
    target_hazard TEXT NOT NULL,
    standard_turnaround_hours INT DEFAULT 24,
    required_equipment JSON,
    crew_type VARCHAR(150),
    safety_protocols JSON,
    step_by_step_action JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
