USE cred;
DROP PROCEDURE if EXISTS `GetBuildings` ;
DELIMITER $$
CREATE PROCEDURE `GetBuildings`(IN contactSearchTerms VARCHAR(128), IN addressSearchTerms VARCHAR(128),
		IN unitQuantityMin int, IN unitQuantityMax int, IN saleDateRangeStart datetime, IN saleDateRangeEnd datetime,
		IN offsetIndex int, IN recordCount INT, IN orderBY VARCHAR (255), OUT id int)
BEGIN
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
FROM 
	cred.cur_owner_seller_property_mapping as mapping
	LEFT JOIN cred.cur_contacts as owner_contact on (owner_contact.id = mapping.owner_contact_id)
	INNER JOIN cred.cur_address on (cur_address.id = mapping.property_address_id)
	INNER JOIN cur_buildings ON (cur_buildings.cur_address_id = cur_address.id)	
WHERE 
	(addressSearchTerms IS NULL OR MATCH(street_name,postal_code,city,province) AGAINST (addressSearchTerms IN BOOLEAN MODE))
	AND (contactSearchTerms IS NULL OR MATCH (owner_contact.name, owner_contact.email) AGAINST (contactSearchTerms IN BOOLEAN MODE))
	AND (unitQuantityMax IS NULL OR cur_buildings.unit_quantity <= unitQuantityMax)
	AND (unitQuantityMin IS NULL OR cur_buildings.unit_quantity >= unitQuantityMin)
	AND (saleDateRangeStart IS NULL OR (cur_buildings.sale_date BETWEEN saleDateRangeStart AND saleDateRangeEnd))
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
	CASE WHEN orderBy='sale_date_desc' THEN sale_date END DESC
LIMIT recordCount OFFSET offsetIndex;

SET id = FOUND_ROWS();
END$$
DELIMITER ;



