USE cred;
DROP PROCEDURE if EXISTS `GetBuildings` ;
DELIMITER $$
CREATE PROCEDURE `GetBuildings`(IN contactSearchTerms VARCHAR(128), IN addressSearchTerms VARCHAR(128),
		IN unitQuantityMin int, IN unitQuantityMax int, IN saleDateRangeStart datetime, IN saleDateRangeEnd datetime,
		IN centerLatitude FLOAT, IN centerLongitude FLOAT, IN rangeDistance FLOAT,
		IN offsetIndex int, IN recordCount INT, IN orderBy VARCHAR (255), OUT id int)
BEGIN


DROP TABLE IF EXISTS distance_radius;

CREATE TEMPORARY TABLE distance_radius(
		#6371 is KM, Miles is 3959 for miles
SELECT cur_address.id, ( 6371 * acos( cos( radians(centerLatitude) ) * cos( radians( latitude ) )
		* cos( radians( longitude ) - radians(centerLongitude) ) + sin( radians(centerLatitude) ) * sin( radians( latitude ) ) ) ) AS distance 
FROM cur_address
WHERE latitude IS NOT NULL);

SELECT 
	 SQL_CALC_FOUND_ROWS GROUP_CONCAT(owner_contact.name SEPARATOR ', ') as 'owner'
	,cur_address.street_number_begin
	,cur_address.street_number_end
	,cur_address.street_name 
	,cur_address.postal_code
	,cur_address.city
	,cur_buildings.id as 'building_id'
	,cur_buildings.unit_quantity as 'units'
	,cur_buildings.property_mgmt_company 
	,cur_buildings.sale_date
	,cur_address.latitude
	,cur_address.longitude
	,distance_radius.distance
FROM 
	cred.cur_owner_seller_property_mapping as mapping
	LEFT JOIN cred.cur_contacts AS owner_contact on (owner_contact.id = mapping.contact_id AND mapping.contact_type_id = '1')
	INNER JOIN cred.cur_address ON (cur_address.id = mapping.property_address_id)
	INNER JOIN cur_buildings ON (cur_buildings.cur_address_id = cur_address.id)	
	LEFT JOIN distance_radius ON (distance_radius.id = cur_address.id)
WHERE
	(addressSearchTerms IS NULL OR MATCH(street_name,postal_code,city,province) AGAINST (addressSearchTerms IN BOOLEAN MODE))
	AND (contactSearchTerms IS NULL OR MATCH (owner_contact.name, owner_contact.email) AGAINST (contactSearchTerms IN BOOLEAN MODE))
	AND (CASE WHEN unitQuantityMax IS NOT NULL THEN (cur_buildings.unit_quantity IS NULL OR cur_buildings.unit_quantity <= unitQuantityMax) ELSE 1 END)
	AND (CASE WHEN unitQuantityMin IS NOT NULL THEN (cur_buildings.unit_quantity IS NULL OR cur_buildings.unit_quantity >= unitQuantityMin) ELSE 1 END)
	AND (CASE WHEN saleDateRangeStart IS NOT NULL THEN (cur_buildings.sale_date BETWEEN saleDateRangeStart AND saleDateRangeEnd) ELSE 1 END)
	AND (CASE WHEN rangeDistance IS NOT NULL THEN distance_radius.distance <= rangeDistance ELSE 1 END)
GROUP BY 
	cur_address.id
ORDER BY
	CASE WHEN orderBy='owner_asc' THEN name END ASC,
	CASE WHEN orderBy='owner_desc' THEN name END DESC,
	CASE WHEN orderBy='street_number_begin_asc' THEN street_number_begin END ASC,
	CASE WHEN orderBy='street_number_begin_desc' THEN street_number_begin END DESC,
	CASE WHEN orderBy='street_number_end_asc' THEN street_number_end END ASC,
	CASE WHEN orderBy='street_number_end_desc' THEN street_number_end END DESC,
	CASE WHEN orderBy='street_name_asc' THEN street_name END ASC,
	CASE WHEN orderBy='street_name_desc' THEN street_name END DESC,
	CASE WHEN orderBy='postal_code_asc' THEN postal_code END ASC,
	CASE WHEN orderBy='postal_code_desc' THEN postal_code END DESC,
	CASE WHEN orderBy='city_asc' THEN city END ASC,
	CASE WHEN orderBy='city_desc' THEN city END DESC,
	CASE WHEN orderBy='units_asc' THEN units END ASC,
	CASE WHEN orderBy='units_desc' THEN units END DESC,
	CASE WHEN orderBy='sale_date_asc' THEN sale_date END ASC,
	CASE WHEN orderBy='sale_date_desc' THEN sale_date END DESC,
	CASE WHEN orderBy='longitude_asc' THEN longitude END ASC,
	CASE WHEN orderBy='longitude_desc' THEN longitude END DESC,
	CASE WHEN orderBy='latitude_asc' THEN latitude END ASC,
	CASE WHEN orderBy='latitude_desc' THEN latitude END DESC
LIMIT recordCount OFFSET offsetIndex;

SET id = FOUND_ROWS();

END$$
DELIMITER ;



