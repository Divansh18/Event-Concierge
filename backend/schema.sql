-- AI Event Concierge - MySQL Schema
CREATE DATABASE IF NOT EXISTS event_concierge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE event_concierge;

CREATE TABLE IF NOT EXISTS event_searches (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_query  TEXT         NOT NULL,
  venue_name  VARCHAR(255) NOT NULL,
  location    VARCHAR(255) NOT NULL,
  estimated_cost VARCHAR(100) NOT NULL,
  why_it_fits TEXT         NOT NULL,
  amenities   JSON,
  raw_response JSON,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
