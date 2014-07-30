USE cred;
DROP PROCEDURE if EXISTS `GetBuildings` ;
DELIMITER $$
CREATE PROCEDURE `GetBuildings`(IN searchTerms VARCHAR(128), 
		IN unitQuantityMin int, IN unitQuantityMax int, IN saleDateRangeStart datetime, IN saleDateRangeEnd datetime,
		IN offsetIndex int, IN recordCount INT, IN orderBY VARCHAR (255), OUT id int)
BEGIN
#SET @@session.sql_notes = 0;
DROP TABLE IF EXISTS Address;
DROP TABLE IF EXISTS Contact;
/*Temporary Table needed for full text search, as the index cannot span numerous tables
By applying them seperately, then joining on the property mappings table this allows 
us to get the desired filtered result*/

# searchTerm applied to Address Only
CREATE TEMPORARY TABLE Address(
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
	,mapping.id as 'mapping'
FROM 
	cred.cur_owner_seller_property_mapping as mapping
	LEFT JOIN cred.cur_contacts as owner_contact on (owner_contact.id = mapping.owner_contact_id)
	INNER JOIN cred.cur_address on (cur_address.id = mapping.property_address_id)
	INNER JOIN cur_buildings ON (cur_buildings.cur_address_id = cur_address.id)	
WHERE 
	(searchTerms IS NULL OR MATCH(street_name,postal_code,city,province) AGAINST (searchTerms IN BOOLEAN MODE))
GROUP BY 
	cur_address.id);

/*Temporary Table needed for full text search, as the index cannot span numerous tables
By applying them seperately, then joining on the property mappings table this allows 
us to get the desired filtered result*/

CREATE TEMPORARY TABLE Contact AS (
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
	,mapping.id as 'mapping'
FROM 
	cred.cur_owner_seller_property_mapping as mapping
	LEFT JOIN cred.cur_contacts as owner_contact on (owner_contact.id = mapping.owner_contact_id)
	INNER JOIN cred.cur_address on (cur_address.id = mapping.property_address_id)
	INNER JOIN cur_buildings ON (cur_buildings.cur_address_id = cur_address.id)	
WHERE
	(searchTerms IS NULL OR MATCH (owner_contact.name, owner_contact.email) AGAINST (searchTerms IN BOOLEAN MODE))
GROUP BY 
	cur_address.id);


#IF both tables contain values, inner join them based on mapping, else return the one with Mapping
IF ((Select COUNT(*) FROM Contact)> 0  AND (Select COUNT(*) FROM Address)> 0) THEN
DROP TABLE IF EXISTS Results;
CREATE TEMPORARY TABLE Results(
SELECT 
	Address.owner
	,Address.street_number_begin
	,Address.street_number_end
	,Address.street_name 
	,Address.postal_code
	,Address.city
	,Address.building_id
	,Address.units
	,Address.property_mgmt_company 
	,Address.sale_date	
FROM 
	 Address
	 INNER JOIN Contact ON (Address.mapping = Contact.mapping));
END IF;

#Contacts Only
IF ((Select COUNT(*) FROM Contact)> 0 AND (Select COUNT(*) FROM Address) = 0) THEN
DROP TABLE IF EXISTS Results;
CREATE TEMPORARY TABLE Results(
SELECT 
	Contact.owner
	,Contact.street_number_begin
	,Contact.street_number_end
	,Contact.street_name 
	,Contact.postal_code
	,Contact.city
	,Contact.building_id
	,Contact.units
	,Contact.property_mgmt_company 
	,Contact.sale_date	
FROM 
	 Contact);
END IF;

#Address Only
IF ((Select COUNT(*) FROM Contact) = 0 AND (Select COUNT(*) FROM Address)> 0) THEN
DROP TABLE IF EXISTS Results;
CREATE TEMPORARY TABLE Results(
SELECT 
	Address.owner
	,Address.street_number_begin
	,Address.street_number_end
	,Address.street_name 
	,Address.postal_code
	,Address.city
	,Address.building_id
	,Address.units
	,Address.property_mgmt_company 
	,Address.sale_date	
FROM 
	 Address);

END IF;

#Apply filtering to final results
SELECT * 
FROM Results
WHERE 
	(unitQuantityMax IS NULL OR units <= unitQuantityMax)
	AND (unitQuantityMin IS NULL OR units >= unitQuantityMin)
	AND (saleDateRangeStart IS NULL OR (sale_date BETWEEN saleDateRangeStart AND saleDateRangeEnd))
ORDER BY
	CASE WHEN orderBy='owner_asc' THEN owner END ASC,
	CASE WHEN orderBy='owner_desc' THEN owner END DESC,
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






