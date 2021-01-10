DROP TABLE IF EXISTS location;

CREATE TABLE location (
  id SERIAL PRIMARY KEY,
  latitude VARCHAR(255),
  longitude VARCHAR(255),
  search_query VARCHAR(255),
  formatted_query VARCHAR(255) 
);