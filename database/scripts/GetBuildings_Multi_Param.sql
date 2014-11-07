USE `cred`;
DROP procedure IF EXISTS `GetBuildings`;

DELIMITER $$
USE `cred`$$
CREATE PROCEDURE `GetBuildings`(IN contactSearchTerms VARCHAR(128),IN addressSearchTerms VARCHAR(128),IN ownerSearchTerms VARCHAR(128), IN propertySearchTerms VARCHAR(128),IN mortgageCompanySearchTerms VARCHAR(64),
		IN sellerSearchTerms VARCHAR(128), IN agentSearchTerms VARCHAR(128), IN ownerCompanySearchTerms VARCHAR(128), IN sellerCompanySearchTerms VARCHAR(128), IN agentCompanySearchTerms VARCHAR(128),
		IN unitQuantityMin int, IN unitQuantityMax int, IN unitPriceMin INT, IN unitPriceMax INT, 
		IN saleDateRangeStart datetime, IN saleDateRangeEnd datetime,
		IN boundsLatitudeMin FLOAT, IN boundsLatitudeMax FLOAT, IN boundsLongitudeMin FLOAT, IN boundsLongitudeMax FLOAT,
		IN hasElevator BOOLEAN, 
		IN elevatorInstalledYearMin INT, IN elevatorInstalledYearMax INT,IN lastElevatorInstalledYearMin INT, IN lastElevatorInstalledYearMax INT,
		IN capRateMin FLOAT, IN capRateMax FLOAT, 
		IN propMgmt VARCHAR(128), IN prevPropMgmt VARCHAR(128), 
		IN heatAgeMin INT, IN heatAgeMax INT,
		IN boilerAgeMin INT, IN boilerAgeMax INT,		
		IN lastBoilerInstalledYearMin INT, IN lastBoilerInstalledYearMax INT,
		IN buildingIncomeMin INT, IN buildingIncomeMax INT,	
		IN lastSalesPriceMin INT, IN lastSalesPriceMax INT,
		IN numOfBachelorMin INT, IN numOfBachelorMax INT, IN numOf1BedroomMin INT, IN numOf1BedroomMax INT, IN numOf2BedroomMin INT, IN numOf2BedroomMax INT, 
		IN numOf3BedroomMin INT, IN numOf3BedroomMax INT,
		 IN priceOfBachelorMin INT, IN priceOfBachelorMax INT, IN priceOf1BedroomMin INT, IN priceOf1BedroomMax INT, IN priceOf2BedroomMin INT, IN priceOf2BedroomMax INT, 
		IN priceOf3BedroomMin INT, IN priceOf3BedroomMax INT,
		IN windowInstallYearMin INT, IN windowInstallYearMax INT,  
		IN cableProvider VARCHAR(128),
		IN mortgageDueDateRangeStart datetime, IN mortgageDueDateRangeEnd datetime,
		IN numOfSalesMin INT, numOfSalesMax INT,
		IN buildingTypes VARCHAR(64), IN heatSystemTypes VARCHAR(64), IN numOfParkingMin INT, IN numOfParkingMax INT,
		IN offsetIndex int, IN recordCount INT, IN orderBy VARCHAR (255), OUT id int, OUT totalCount int)
BEGIN
SELECT 
	 SQL_CALC_FOUND_ROWS GROUP_CONCAT(DISTINCT owner_contact.name SEPARATOR ', ') as 'owner'
	,GROUP_CONCAT(DISTINCT owner_company.name SEPARATOR ', ') AS 'owner_company'
	,GROUP_CONCAT(DISTINCT seller_contact.name SEPARATOR ', ') AS 'seller'
	,GROUP_CONCAT(DISTINCT seller_company.name SEPARATOR ', ') AS 'seller_company'
	,GROUP_CONCAT(DISTINCT agent_contact.name SEPARATOR ', ') AS 'agent'
	,GROUP_CONCAT(DISTINCT agent_company.name SEPARATOR ', ') AS 'agent_company'
	,cur_address.street_number_begin
	,cur_address.street_number_end
	,cur_address.street_name 
	,cur_address.postal_code
	,cur_address.city
	,cur_address.province
	,cur_address.maporder
	,cur_buildings.id as 'building_id'
	,cur_buildings.unit_quantity as 'units'
	,cur_buildings.property_mgmt_company 
	,cur_buildings.prev_property_mgmt_company
	,cur_buildings.sale_date
	,cur_address.latitude
	,cur_address.longitude
	,cur_buildings.windows_installed_year
	,IFNULL(sales_count.num_of_records,0) AS num_of_sales
	,ref_building_type.type 'building_type'
	,cur_buildings.property_mgmt_company
	,cur_buildings.prev_property_mgmt_company
	,ref_heat_system_type.type 'heat_system'
	,cur_buildings.heat_system_age
	,cur_buildings.boiler_installed_year
	,cur_buildings.last_boiler_upgrade_year
	,cur_buildings.cable_internet_provider
	,cur_buildings.has_elevator
	,cur_buildings.elevator_installed_year
	,cur_buildings.last_elevator_upgrade_year
	,cur_buildings.windows_installed_year
	,cur_buildings.parking_spots
	,cur_buildings.assessed_value
	,cur_buildings.mortgage_company
	,cur_buildings.mortgage_due_date
	,cur_buildings.bachelor_price
	,cur_buildings.bedroom1_price
	,cur_buildings.bedroom2_price
	,cur_buildings.bedroom3_price
	,cur_buildings.bachelor_units
	,cur_buildings.bedroom1_units
	,cur_buildings.bedroom2_units
	,cur_buildings.bedroom3_units
	,cur_buildings.unit_quantity
	,cur_buildings.building_income
	,cur_buildings.unit_price
	,cur_buildings.cap_rate
	,cur_buildings.sale_date
	,cur_buildings.last_sale_price
FROM cur_buildings
	INNER JOIN cur_address ON (cur_address.id = cur_buildings.cur_address_id)
	LEFT JOIN cur_owner_seller_property_mapping AS owner_mapping ON (owner_mapping.property_address_id = cur_address.id AND owner_mapping.contact_type_id = 1)
	LEFT JOIN cur_contacts AS owner_contact ON (owner_contact.id = owner_mapping.contact_id AND owner_contact.is_deleted = 0)
	LEFT JOIN cur_company AS owner_company ON (owner_company.id = owner_mapping.company_id AND owner_company.is_deleted = 0)
	LEFT JOIN cur_company_address_mapping AS owner_company_address_mapping ON (owner_company_address_mapping.cur_company_id = owner_company.id)
	LEFT JOIN cur_address AS owner_company_address ON (owner_company_address.id = owner_company_address_mapping.cur_address_id)
	LEFT JOIN cur_owner_seller_property_mapping AS seller_mapping ON (seller_mapping.property_address_id = cur_address.id AND seller_mapping.contact_type_id = 2)
	LEFT JOIN cur_contacts AS seller_contact ON (seller_contact.id = seller_mapping.contact_id AND seller_contact.is_deleted = 0)
	LEFT JOIN cur_company AS seller_company ON (seller_company.id = seller_mapping.company_id AND seller_company.is_deleted = 0)
	LEFT JOIN cur_company_address_mapping AS seller_company_address_mapping ON (seller_company_address_mapping.cur_company_id = seller_company.id)
	LEFT JOIN cur_address AS seller_company_address ON (seller_company_address.id = seller_company_address_mapping.cur_address_id)
	LEFT JOIN cur_owner_seller_property_mapping AS agent_mapping ON (agent_mapping.property_address_id = cur_address.id AND agent_mapping.contact_type_id = 3)
	LEFT JOIN cur_contacts AS agent_contact on (agent_contact.id = agent_mapping.contact_id AND agent_contact.is_deleted = 0)
	LEFT JOIN cur_company AS agent_company ON (agent_company.id = agent_mapping.company_id AND agent_company.is_deleted = 0)
	LEFT JOIN cur_company_address_mapping AS agent_company_address_mapping ON (agent_company_address_mapping.cur_company_id = agent_company.id)
	LEFT JOIN cur_address AS agent_company_address ON (agent_company_address.id = agent_company_address_mapping.cur_address_id)
	LEFT JOIN ref_building_type ON (ref_building_type.id = cur_buildings.ref_building_type_id)
	LEFT JOIN ref_heat_system_type ON (ref_heat_system_type.id = cur_buildings.heat_system_type_id)
	LEFT JOIN (SELECT COUNT(DISTINCT cur_sales_record_history_id) AS 'num_of_records'
				,cur_buildings_id  
				FROM cur_sales_history_contact_mapping 
				GROUP BY cur_buildings_id) AS sales_count ON (sales_count.cur_buildings_id = cur_buildings.id)
WHERE
	(propertySearchTerms IS NULL OR MATCH(cur_address.street_name,cur_address.postal_code,cur_address.city,cur_address.province,cur_address.street_number_begin) AGAINST (propertySearchTerms IN BOOLEAN MODE))
	AND ((contactSearchTerms IS NULL OR MATCH (owner_contact.name, owner_contact.email) AGAINST (contactSearchTerms IN BOOLEAN MODE))
			OR (contactSearchTerms IS NULL OR MATCH (seller_contact.name, seller_contact.email) AGAINST (contactSearchTerms IN BOOLEAN MODE))
			OR (contactSearchTerms IS NULL OR MATCH (agent_contact.name, agent_contact.email) AGAINST (contactSearchTerms IN BOOLEAN MODE))
			OR (contactSearchTerms IS NULL OR MATCH (mortgage_company) AGAINST (contactSearchTerms IN BOOLEAN MODE))
			OR (contactSearchTerms IS NULL OR MATCH (owner_company.name) AGAINST (contactSearchTerms IN BOOLEAN MODE))
			OR (contactSearchTerms IS NULL OR MATCH (seller_company.name) AGAINST (contactSearchTerms IN BOOLEAN MODE))
			OR (contactSearchTerms IS NULL OR MATCH (agent_company.name) AGAINST (contactSearchTerms IN BOOLEAN MODE)))
	AND ((addressSearchTerms IS NULL OR MATCH(cur_address.street_name,cur_address.postal_code,cur_address.city,cur_address.province,cur_address.street_number_begin) AGAINST (addressSearchTerms IN BOOLEAN MODE))
			OR(addressSearchTerms IS NULL OR MATCH(owner_company_address.street_name,owner_company_address.postal_code,owner_company_address.city,owner_company_address.province,owner_company_address.street_number_begin) AGAINST (addressSearchTerms IN BOOLEAN MODE))
			OR(addressSearchTerms IS NULL OR MATCH(seller_company_address.street_name,seller_company_address.postal_code,seller_company_address.city,seller_company_address.province,seller_company_address.street_number_begin) AGAINST (addressSearchTerms IN BOOLEAN MODE))	
			OR(addressSearchTerms IS NULL OR MATCH(agent_company_address.street_name,agent_company_address.postal_code,agent_company_address.city,agent_company_address.province,agent_company_address.street_number_begin) AGAINST (addressSearchTerms IN BOOLEAN MODE)))
	AND (ownerSearchTerms IS NULL OR MATCH (owner_contact.name, owner_contact.email) AGAINST (ownerSearchTerms IN BOOLEAN MODE))
	AND (sellerSearchTerms IS NULL OR MATCH (seller_contact.name, seller_contact.email) AGAINST (sellerSearchTerms IN BOOLEAN MODE))
	AND (agentSearchTerms IS NULL OR MATCH (agent_contact.name, agent_contact.email) AGAINST (agentSearchTerms IN BOOLEAN MODE))
	AND (mortgageCompanySearchTerms IS NULL OR MATCH (mortgage_company) AGAINST (mortgageCompanySearchTerms IN BOOLEAN MODE))
	AND (ownerCompanySearchTerms IS NULL OR MATCH (owner_company.name) AGAINST (ownerCompanySearchTerms IN BOOLEAN MODE))
	AND (sellerCompanySearchTerms IS NULL OR MATCH (seller_company.name) AGAINST (sellerCompanySearchTerms IN BOOLEAN MODE))
	AND (agentCompanySearchTerms IS NULL OR MATCH (agent_company.name) AGAINST (agentCompanySearchTerms IN BOOLEAN MODE))
	AND (CASE WHEN unitQuantityMax IS NOT NULL THEN (cur_buildings.unit_quantity <= unitQuantityMax) ELSE 1 END)
	AND (CASE WHEN unitQuantityMin IS NOT NULL THEN (cur_buildings.unit_quantity >= unitQuantityMin) ELSE 1 END)
	AND (CASE WHEN saleDateRangeStart IS NOT NULL THEN (cur_buildings.sale_date >= saleDateRangeStart ) ELSE 1 END)
	AND (CASE WHEN saleDateRangeEnd IS NOT NULL THEN (cur_buildings.sale_date <= saleDateRangeEnd) ELSE 1 END)
	AND (CASE WHEN mortgageDueDateRangeStart IS NOT NULL THEN (cur_buildings.mortgage_due_date >= mortgageDueDateRangeStart ) ELSE 1 END)
	AND (CASE WHEN mortgageDueDateRangeEnd IS NOT NULL THEN (cur_buildings.mortgage_due_date <= mortgageDueDateRangeEnd) ELSE 1 END)
	AND (CASE WHEN boundsLatitudeMin IS NOT NULL THEN cur_address.latitude BETWEEN boundsLatitudeMin AND boundsLatitudeMax ELSE 1 END)
	AND (CASE WHEN boundsLongitudeMin IS NOT NULL THEN cur_address.longitude BETWEEN boundsLongitudeMin AND boundsLongitudeMax ELSE 1 END)
	AND (CASE WHEN capRateMax IS NOT NULL THEN (cur_buildings.cap_rate <= capRateMax) ELSE 1 END)
	AND (CASE WHEN capRateMin IS NOT NULL THEN (cur_buildings.cap_rate >= capRateMin) ELSE 1 END)
	AND (CASE WHEN elevatorInstalledYearMax IS NOT NULL THEN (cur_buildings.elevator_installed_year <= elevatorInstalledYearMax) ELSE 1 END)
	AND (CASE WHEN elevatorInstalledYearMin IS NOT NULL THEN (cur_buildings.elevator_installed_year >= elevatorInstalledYearMin) ELSE 1 END)
	AND (CASE WHEN lastElevatorInstalledYearMax IS NOT NULL THEN (cur_buildings.last_elevator_upgrade_year <= lastElevatorInstalledYearMax) ELSE 1 END)
	AND (CASE WHEN lastElevatorInstalledYearMin IS NOT NULL THEN (cur_buildings.last_elevator_upgrade_year >= lastElevatorInstalledYearMin) ELSE 1 END)
	AND (CASE WHEN lastBoilerInstalledYearMax IS NOT NULL THEN (cur_buildings.last_boiler_upgrade_year <= lastBoilerInstalledYearMax) ELSE 1 END)
	AND (CASE WHEN lastBoilerInstalledYearMin IS NOT NULL THEN (cur_buildings.last_boiler_upgrade_year >= lastBoilerInstalledYearMin) ELSE 1 END)
	AND (CASE WHEN heatAgeMax IS NOT NULL THEN (cur_buildings.heat_system_age <= heatAgeMax) ELSE 1 END)
	AND (CASE WHEN heatAgeMin IS NOT NULL THEN (cur_buildings.heat_system_age >= heatAgeMin) ELSE 1 END)
	AND (CASE WHEN boilerAgeMax IS NOT NULL THEN (cur_buildings.boiler_installed_year <= boilerAgeMax) ELSE 1 END)
	AND (CASE WHEN boilerAgeMin IS NOT NULL THEN (cur_buildings.boiler_installed_year >= boilerAgeMin) ELSE 1 END)
	AND (CASE WHEN numOf1BedroomMax IS NOT NULL THEN (cur_buildings.bedroom1_units <= numOf1BedroomMax) ELSE 1 END)
	AND (CASE WHEN numOf1BedroomMin IS NOT NULL THEN (cur_buildings.bedroom1_units >= numOf1BedroomMin) ELSE 1 END)
	AND (CASE WHEN numOf2BedroomMax IS NOT NULL THEN (cur_buildings.bedroom2_units <= numOf2BedroomMax) ELSE 1 END)
	AND (CASE WHEN numOf2BedroomMin IS NOT NULL THEN (cur_buildings.bedroom2_units >= numOf2BedroomMin) ELSE 1 END)
	AND (CASE WHEN numOf3BedroomMax IS NOT NULL THEN (cur_buildings.bedroom3_units <= numOf3BedroomMax) ELSE 1 END)
	AND (CASE WHEN numOf3BedroomMin IS NOT NULL THEN (cur_buildings.bedroom3_units >= numOf3BedroomMin) ELSE 1 END)
	AND (CASE WHEN numOfBachelorMax IS NOT NULL THEN (cur_buildings.bachelor_units <= numOfBachelorMax) ELSE 1 END)
	AND (CASE WHEN numOfBachelorMin IS NOT NULL THEN (cur_buildings.bachelor_units >= numOfBachelorMin) ELSE 1 END)
	AND (CASE WHEN priceOf1BedroomMax IS NOT NULL THEN (cur_buildings.bedroom1_price <= priceOf1BedroomMax) ELSE 1 END)
	AND (CASE WHEN priceOf1BedroomMin IS NOT NULL THEN (cur_buildings.bedroom1_price >= priceOf1BedroomMin) ELSE 1 END)
	AND (CASE WHEN priceOf2BedroomMax IS NOT NULL THEN (cur_buildings.bedroom2_price <= priceOf2BedroomMax) ELSE 1 END)
	AND (CASE WHEN priceOf2BedroomMin IS NOT NULL THEN (cur_buildings.bedroom2_price >= priceOf2BedroomMin) ELSE 1 END)
	AND (CASE WHEN priceOf3BedroomMax IS NOT NULL THEN (cur_buildings.bedroom3_price <= priceOf3BedroomMax) ELSE 1 END)
	AND (CASE WHEN priceOf3BedroomMin IS NOT NULL THEN (cur_buildings.bedroom3_price >= priceOf3BedroomMin) ELSE 1 END)
	AND (CASE WHEN priceOfBachelorMax IS NOT NULL THEN (cur_buildings.bachelor_price <= priceOfBachelorMax) ELSE 1 END)
	AND (CASE WHEN priceOfBachelorMin IS NOT NULL THEN (cur_buildings.bachelor_price >= priceOfBachelorMin) ELSE 1 END)	
	AND (CASE WHEN buildingIncomeMin IS NOT NULL THEN (cur_buildings.building_income >= buildingIncomeMin) ELSE 1 END)
	AND (CASE WHEN buildingIncomeMax IS NOT NULL THEN (cur_buildings.building_income <= buildingIncomeMax) ELSE 1 END)
	AND (CASE WHEN unitPriceMin IS NOT NULL THEN (cur_buildings.unit_price >= unitPriceMin) ELSE 1 END)
	AND (CASE WHEN unitPriceMax IS NOT NULL THEN (cur_buildings.unit_price <= unitPriceMax) ELSE 1 END)
	AND (CASE WHEN lastSalesPriceMin IS NOT NULL THEN (cur_buildings.last_sale_price >= lastSalesPriceMin) ELSE 1 END)
	AND (CASE WHEN lastSalesPriceMax IS NOT NULL THEN (cur_buildings.last_sale_price <= lastSalesPriceMax) ELSE 1 END)
	AND (CASE WHEN numOfSalesMin IS NOT NULL THEN (sales_count.num_of_records >= numOfSalesMin) ELSE 1 END)
	AND (CASE WHEN numOfSalesMax IS NOT NULL THEN (sales_count.num_of_records <= numOfSalesMax) ELSE 1 END)
	AND (CASE WHEN numOfParkingMin IS NOT NULL THEN (cur_buildings.parking_spots>= numOfParkingMin) ELSE 1 END)
	AND (CASE WHEN numOfParkingMax IS NOT NULL THEN (cur_buildings.parking_spots <= numOfParkingMax) ELSE 1 END)
	AND (CASE WHEN windowInstallYearMax IS NOT NULL THEN (cur_buildings.windows_installed_year <= windowInstallYearMax) ELSE 1 END)
	AND (CASE WHEN windowInstallYearMin IS NOT NULL THEN (cur_buildings.windows_installed_year >= windowInstallYearMin) ELSE 1 END)
	AND (CASE WHEN hasElevator IS NOT NULL THEN (cur_buildings.has_elevator = hasElevator) ELSE 1 END)
	AND (CASE WHEN propMgmt IS NOT NULL THEN (cur_buildings.property_mgmt_company LIKE propMgmt) ELSE 1 END)
	AND (CASE WHEN prevPropMgmt IS NOT NULL THEN (cur_buildings.prev_property_mgmt_company LIKE prevPropMgmt) ELSE 1 END)
	AND (CASE WHEN cableProvider IS NOT NULL THEN (cur_buildings.cable_internet_provider LIKE cableProvider) ELSE 1 END)
	AND (CASE WHEN buildingTypes IS NOT NULL THEN FIND_IN_SET(ref_building_type.id, buildingTYpes) ELSE 1 END)
	AND (CASE WHEN heatSystemTypes IS NOT NULL THEN FIND_IN_SET(ref_heat_system_type.id, heatSystemTypes) ELSE 1 END)
	AND (cur_buildings.is_deleted = 0)
GROUP BY 
	cur_address.id
ORDER BY
	CASE WHEN orderBy='maporder_asc' THEN IF(cur_address.maporder IS NULL,1,0)  END ASC,
	CASE WHEN orderBy='maporder_asc' THEN cur_address.maporder END ASC,
	CASE WHEN orderBy='property_mgmt_company_asc' THEN property_mgmt_company END ASC,
	CASE WHEN orderBy='property_mgmt_company_desc' THEN property_mgmt_company END DESC,
	CASE WHEN orderBy='owner_asc' THEN owner_contact.name END ASC,
	CASE WHEN orderBy='owner_desc' THEN owner_contact.name END DESC,
	CASE WHEN orderBy='street_number_begin_asc' THEN cur_address.street_number_begin END ASC,
	CASE WHEN orderBy='street_number_begin_desc' THEN cur_address.street_number_begin END DESC,
	CASE WHEN orderBy='street_number_end_asc' THEN cur_address.street_number_end END ASC,
	CASE WHEN orderBy='street_number_end_desc' THEN cur_address.street_number_end END DESC,
	CASE WHEN orderBy='street_name_asc' THEN cur_address.street_name END ASC,
	CASE WHEN orderBy='street_name_desc' THEN cur_address.street_name END DESC,
	CASE WHEN orderBy='postal_code_asc' THEN cur_address.postal_code END ASC,
	CASE WHEN orderBy='postal_code_desc' THEN cur_address.postal_code END DESC,
	CASE WHEN orderBy='city_asc' THEN cur_address.city END ASC,
	CASE WHEN orderBy='city_desc' THEN cur_address.city END DESC,
	CASE WHEN orderBy='units_asc' THEN units END ASC,
	CASE WHEN orderBy='units_desc' THEN units END DESC,
	CASE WHEN orderBy='sale_date_asc' THEN sale_date END ASC,
	CASE WHEN orderBy='sale_date_desc' THEN sale_date END DESC,
	CASE WHEN orderBy='longitude_asc' THEN cur_address.longitude END ASC,
	CASE WHEN orderBy='longitude_desc' THEN cur_address.longitude END DESC,
	CASE WHEN orderBy='latitude_asc' THEN cur_address.latitude END ASC,
	CASE WHEN orderBy='latitude_desc' THEN cur_address.latitude END DESC,
	CASE WHEN orderBy= null THEN cur_address.street_number_begin END ASC
LIMIT recordCount OFFSET offsetIndex;

SET id = FOUND_ROWS();

SELECT COUNT(*) INTO totalCount
FROM cur_buildings
INNER JOIN cur_address ON (cur_address.id = cur_buildings.cur_address_id)
WHERE
	(cur_buildings.is_deleted = 0) ;

END$$

DELIMITER ;

